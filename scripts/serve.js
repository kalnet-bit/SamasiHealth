// @ts-check
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const MIME = /** @type {Record<string, string>} */ ({
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
});

/** @typedef {{ file: string | null; mime: string; status?: number; body?: string }} ResolvedFile */

/**
 * Resolve a request URL into a file on disk, honouring clean URLs and the 404 page.
 * @param {string} urlPath
 * @returns {ResolvedFile | null}
 */
export function resolveFromDist(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0] ?? '/');
  } catch {
    return null; // malformed percent-encoding (e.g. /%E0%A) → treat as not found, never crash
  }
  const decoded = normalize(pathname).replace(/\\/g, '/');
  // Prevent path traversal.
  if (decoded.includes('..')) return null;

  const candidates = [];
  if (decoded.endsWith('/')) {
    candidates.push(join(DIST, decoded, 'index.html'));
  } else if (extname(decoded) === '') {
    candidates.push(join(DIST, decoded, 'index.html'));
    candidates.push(join(DIST, `${decoded}.html`));
  } else {
    candidates.push(join(DIST, decoded));
  }

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return { file: candidate, mime: MIME[extname(candidate)] ?? 'application/octet-stream' };
    }
  }

  const notFound = join(DIST, '404.html');
  if (existsSync(notFound)) {
    return { file: notFound, mime: 'text/html; charset=utf-8', status: 404 };
  }
  return { file: null, mime: 'text/plain; charset=utf-8', status: 404, body: 'Not found\n' };
}

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_WINDOW = 5;
const APPOINTMENT_STORE_MAX = 200;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Security headers applied to every response (both static files and the API).
 * CSP allows same-origin scripts, Google Fonts, and JSON-LD blocks.
 */
const BASE_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

/** @type {Map<string, object>} In-memory appointment records, keyed by reference. */
export const appointmentStore = new Map();

/** @type {Map<string, number[]>} Per-IP recent POST timestamps, for sliding-window rate limiting. */
const appointmentReqTimestamps = new Map();

/**
 * Read and parse a JSON request body with a hard size cap.
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<Record<string, unknown>>}
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) {
        reject(Object.assign(new Error('Request too large'), { code: 'PAYLOAD_TOO_LARGE' }));
        return;
      }
      let parsed;
      try {
        parsed = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { code: 'INVALID_JSON' }));
        return;
      }
      resolve(/** @type {Record<string, unknown>} */ (parsed));
    });
    req.on('error', reject);
  });
}

/**
 * Validate an appointment request. Never trusts the client — every field is
 * normalised and checked length/format before being stored.
 * @param {Record<string, unknown>} body
 * @returns {{ errors: Record<string, string>; data: Record<string, string> }}
 */
export function validateAppointmentBody(body) {
  const errors = /** @type {Record<string, string>} */ ({});
  const toStr = /** @param {unknown} v @returns {string} */ (v) =>
    typeof v === 'string' ? v.trim() : '';
  const data = {
    patientName: toStr(body.patientName).slice(0, 120),
    phone: toStr(body.phone).slice(0, 20),
    email: toStr(body.email).slice(0, 320),
    preferredDate: toStr(body.preferredDate).slice(0, 10),
    preferredTime: toStr(body.preferredTime).slice(0, 5),
    serviceId: toStr(body.serviceId).slice(0, 64),
    message: toStr(body.message).slice(0, 1000),
  };
  if (!data.patientName) errors.patientName = 'Full name is required.';
  if (!data.phone || !PHONE_RE.test(data.phone)) errors.phone = 'A valid phone number is required.';
  if (data.email && !EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate)) errors.preferredDate = 'Please choose a preferred date.';
  if (!/^\d{2}:\d{2}$/.test(data.preferredTime)) errors.preferredTime = 'Please choose a preferred time.';
  return { errors, data };
}

/**
 * Human-readable unique reference, e.g. SRP-3F8K2Q.
 * @returns {string}
 */
function createReference() {
  let reference;
  do {
    reference =
      'SRP-' + Math.floor(Math.random() * 36 ** 6).toString(36).toUpperCase().padStart(6, '0');
  } while (appointmentStore.has(reference));
  return reference;
}

/**
 * Handle POST /api/appointments. Returns 201 { status:'PENDING', reference }
 * — the clinic still confirms; an online request is never an automatic booking.
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
function handleAppointmentRequest(req, res) {
  const headers = { ...BASE_HEADERS, 'Content-Type': 'application/json; charset=utf-8' };
  if (req.method !== 'POST') {
    res.writeHead(405, { ...headers, Allow: 'POST' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Per-IP rate limiting: cheap reject before doing any body work.
  const ip = req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (appointmentReqTimestamps.get(ip) ?? []).filter((t) => t > windowStart);
  if (hits.length >= RATE_LIMIT_MAX_PER_WINDOW) {
    res.writeHead(429, headers);
    res.end(JSON.stringify({ error: 'Too many requests. Please try again later.' }));
    return;
  }
  hits.push(now);
  appointmentReqTimestamps.set(ip, hits);

  // Bounded store: reject once the queue is full so memory can't grow unbounded.
  if (appointmentStore.size >= APPOINTMENT_STORE_MAX) {
    res.writeHead(503, headers);
    res.end(JSON.stringify({ error: 'Appointment queue is full. Please call the clinic directly.' }));
    return;
  }

  readJsonBody(req)
    .then((body) => {
      const { errors, data } = validateAppointmentBody(body);
      if (Object.keys(errors).length > 0) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: 'Validation failed', fields: errors }));
        return;
      }
      const reference = createReference();
      const receivedAt = new Date().toISOString();
      appointmentStore.set(reference, { reference, status: 'PENDING', ...data, receivedAt });
      res.writeHead(201, headers);
      res.end(JSON.stringify({ status: 'PENDING', reference, receivedAt }));
    })
    .catch((err) => {
      const code = /** @type {{ code?: string }} */ (err).code;
      const isTooLarge = code === 'PAYLOAD_TOO_LARGE';
      res.writeHead(isTooLarge ? 413 : 400, headers);
      res.end(JSON.stringify({ error: isTooLarge ? 'Request too large' : 'Invalid request body' }));
    });
}

export function createDevServer() {
  return createServer((req, res) => {
    const rawUrl = req.url ?? '/';
    const pathname = (rawUrl.split('?')[0] ?? '/').split('#')[0];

    if (pathname === '/api/appointments') {
      handleAppointmentRequest(req, res);
      return;
    }

    const resolved = resolveFromDist(rawUrl);
    if (!resolved) {
      res.writeHead(404, { ...BASE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found\n');
      return;
    }

    const isHtml = resolved.file !== null && extname(resolved.file) === '.html';
    const headers = {
      ...BASE_HEADERS,
      'Content-Type': resolved.mime,
      'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=31536000, immutable',
    };

    if (!resolved.file || resolved.body !== undefined) {
      const status = resolved.status ?? 404;
      res.writeHead(status, headers);
      res.end(resolved.body ?? 'Not found\n');
      return;
    }

    const status = resolved.file.endsWith('404.html') ? 404 : resolved.status ?? 200;
    res.writeHead(status, headers);
    createReadStream(resolved.file)
      .on('error', () => {
        res.destroy();
      })
      .pipe(res);
  });
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  const port = Number(process.env.PORT ?? process.argv[2] ?? 8080);
  const server = createDevServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`serve: http://127.0.0.1:${port}  (press Ctrl+C to stop)`);
  });
}