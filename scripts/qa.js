// @ts-check
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname } from 'node:path';

import { buildPageSet, pagePathToFile } from './build.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const BANNED = [
  'lorem ipsum',
  '24/7',
  'state-of-the-art',
  'state of the art',
  'years of experience',
  'thousands of patients',
  '100%',
  'world-class',
  'world class',
  'cutting-edge',
  'cutting edge',
  'guaranteed',
  'best in the city',
  'leading clinic',
  'expert team',
  'highly qualified doctors',
  'jump to', // leftover anchor text
  'under construction', // we use "coming soon" instead
  'upload', // placeholder buzz
];

const ALLOWED_EXTERNAL_PREFIXES = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.google.com/maps/search',
  'https://google.com/maps/search',
  'https://schema.org',
  'https://www.google.com/search',
  'https://hfrportal.moh.go.tz',
];

/** Collect all .html files reachable under dist (excluding assets). */
/**
 * @param {string} dir
 * @param {string} base
 * @param {string[]} out
 * @returns {Promise<string[]>}
 */
async function htmlFiles(dir = DIST, base = DIST, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'assets') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await htmlFiles(full, base, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const LANG_RE = /<html\b[^>]*\blang=["'][^"']+["']/;
const CHARSET_RE = /<meta\s+charset=["'][^"']+["']/i;
const VIEWPORT_RE = /<meta\s+name=["']viewport["']/i;
const DESC_RE = /<meta\s+name=["']description["'][^>]*content=["']([^"']+)["']/i;
const H1_RE = /<h1[\s>]/gi;
const TEL_LINK_RE = /href=["']tel:([^"']+)["']/gi;
const JSONLD_RE = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
const HREF_RE = /(?:href|src)=["']([^"']+)["']/g;
const INPUT_RE = /<(input|textarea|select)\b([^>]*)>/gi;

/**
 * @param {boolean} ok
 * @param {string} label
 */
function tabulate(ok, label) {
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
}

/**
 * @param {string} filePath
 * @param {string} href
 * @returns {boolean}
 */
function linkTargetExists(filePath, href) {
  if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(href)) return true;
  const clean = href.split('#')[0];
  if (!clean) return true;
  return true; // resolved below because it depends on the page
}

/**
 * @param {{ ok: boolean }[]} checks
 * @returns {boolean}
 */
function assertAll(checks) {
  return checks.filter((c) => c.ok).length === checks.length;
}

async function runQa() {
  console.log('\nqa: verifying dist/ output\n');

  const pages = buildPageSet();
  const rendered = new Map();
  for (const [path, page] of pages) {
    rendered.set(pagePathToFile(path), { path, html: page.html });
  }

  // Every configured route rendered to disk.
  const onDisk = await htmlFiles();
  let routesOk = true;
  for (const [file] of rendered) {
    const full = join(DIST, file);
    if (!onDisk.includes(full)) {
      tabulate(false, `route ${file} missing on disk`);
      routesOk = false;
    }
  }
  if (routesOk) tabulate(true, `all ${rendered.size} routes written to disk`);

  const failures = [];

  for (const file of onDisk) {
    const rel = file.slice(DIST.length + 1).replace(/\\/g, '/');
    const html = await readFile(file, 'utf8');
    const name = rel === 'index.html' ? '/' : `/${rel.replace(/\/index\.html$/, '')}`;

    if (!LANG_RE.test(html)) failures.push(`${name}: missing lang attribute`);
    if (!CHARSET_RE.test(html)) failures.push(`${name}: missing charset`);
    if (!VIEWPORT_RE.test(html)) failures.push(`${name}: missing viewport`);
    else if (!/width=device-width/i.test(html)) failures.push(`${name}: viewport malformed`);

    const desc = DESC_RE.exec(html);
    if (!desc) failures.push(`${name}: missing meta description`);
    else if (desc[1].trim().length < 40) failures.push(`${name}: meta description too short`);

    const h1Count = (html.match(H1_RE) || []).length;
    if (h1Count === 0) failures.push(`${name}: no <h1>`);
    else if (h1Count > 1) failures.push(`${name}: multiple <h1> (${h1Count})`);

    if (!html.includes('skip-link')) failures.push(`${name}: missing skip link target/focusable`);

    for (const phrase of BANNED) {
      if (html.toLowerCase().includes(phrase)) {
        failures.push(`${name}: banned phrase "${phrase}"`);
      }
    }

    let tel;
    const telLinks = [];
    for (const m of html.matchAll(TEL_LINK_RE)) telLinks.push(m[1]);
    if ((tel = telLinks.find((t) => !/^\+?\d{6,15}$/.test(t)))) {
      failures.push(`${name}: malformed tel: link "${tel}"`);
    }

    if (html.includes('mailto:')) {
      const mailto = html.match(/href=["']mailto:([^"']+)["']/);
      if (!mailto || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mailto[1])) {
        failures.push(`${name}: malformed or missing mailto link`);
      }
    }

    // JSON-LD sanity.
    const ld = [];
    for (const m of html.matchAll(JSONLD_RE)) {
      try {
        ld.push(JSON.parse(m[1]));
      } catch {
        failures.push(`${name}: invalid JSON-LD block`);
      }
    }
    const medical = ld.find((b) => b?.['@type'] === 'MedicalClinic');
    if (medical) {
      const addr = medical.address;
      if (!medical.name) failures.push(`${name}: MedicalClinic missing name`);
      if (!medical.telephone || !/^\+/.test(medical.telephone)) failures.push(`${name}: MedicalClinic telephone must be international`);
      if (!addr || !addr.addressLocality || !addr.addressCountry) failures.push(`${name}: MedicalClinic address incomplete`);
      if (medical.aggregateRating && typeof medical.aggregateRating.ratingValue !== 'number') {
        failures.push(`${name}: MedicalClinic aggregateRating not numeric`);
      }
    } else if (!rel.startsWith('404')) {
      failures.push(`${name}: missing MedicalClinic JSON-LD`);
    }

    // Links.
    const ext = [];
    for (const m of html.matchAll(HREF_RE)) {
      const href = m[1];
      if (!href.trim()) {
        failures.push(`${name}: empty href/src`);
        continue;
      }
      if (href.startsWith('#')) continue;
      if (href.startsWith('/')) {
        const target = href.split('#')[0];
        const clean = target.replace(/\/+$/, '') || '/';
        if (target === '/404.html') continue;
        const expected = clean === '/' ? join('.', 'index.html') : join('.', clean.replace(/^\//, ''), 'index.html');
        if (rendered.has(expected)) continue;
        // Path with a file extension is a static asset served verbatim from dist/.
        if (/\.[a-zA-Z0-9]+$/.test(clean)) {
          // Skip Vercel Speed Insights runtime script (served by Vercel at runtime)
          if (clean === '/_vercel/speed-insights/script.js') continue;
          if (!existsSync(join(DIST, clean.replace(/^\//, '')))) {
            failures.push(`${name}: missing static asset /${clean}`);
          }
        } else {
          failures.push(`${name}: internal link /${clean} has no rendered target`);
        }
      } else if (/^(https?:)/i.test(href)) {
        ext.push(href);
      }
    }
    for (const url of ext) {
      if (!ALLOWED_EXTERNAL_PREFIXES.some((p) => url.startsWith(p))) {
        failures.push(`${name}: unexpected external link "${url}" (not in allowlist)`);
      }
    }

    // Forms: every field needs a label, and the form shell must be wired.
    if (html.includes('<form')) {
      const ids = new Set([...html.matchAll(/<label\b[^>]*for=["']([^"']+)["']/g)].map((m) => m[1]));
      const fields = [...html.matchAll(INPUT_RE)].map((m) => ({ tag: m[1], raw: m[2] }));
      for (const f of fields) {
        if (f.tag === 'input' && /\btype=["'](hidden|submit|reset|button)["']/.test(f.raw)) continue;
        if (/\baria-hidden/i.test(f.raw)) continue;
        if (!ids.has(f.raw.match(/\bid=["']([^"']+)["']/)?.[1] ?? '')) {
          failures.push(`${name}: unassociated form field`);
        }
      }
      if (!/<form\b[^>]*\bdata-form\b/i.test(html)) failures.push(`${name}: form missing data-form wiring`);
    }

    // Emergency notice requirements.
    if (name === '/contact' || name === '/appointment' || name === '/patients') {
      if (!/medical emergency/i.test(html)) failures.push(`${name}: missing medical emergency notice`);
    }
  }

  // Copy of assertAll used to keep the console tidy.
  if (failures.length === 0) {
    tabulate(true, `all ${onDisk.length} pages passed content/link/SEO checks`);
  } else {
    for (const f of [...new Set(failures)]) {
      console.error(`  ✗ ${f}`);
    }
    tabulate(false, `${failures.length} failures found (duplicates deduped)`);
    return { ok: false, failures };
  }

  return { ok: true, failures: [] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runQa().then((r) => {
    if (!r.ok) process.exitCode = 1;
  });
}

export { runQa, assertAll, linkTargetExists, ALLOWED_EXTERNAL_PREFIXES };