// @ts-check
import { build } from 'esbuild';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

import { clinic } from '../src/config/clinic.js';
import { render as renderHome } from '../src/pages/home.js';
import { render as renderAbout } from '../src/pages/about.js';
import { render as renderServices } from '../src/pages/services.js';
import { render as renderPatients } from '../src/pages/patients.js';
import { render as renderReviews } from '../src/pages/reviews.js';
import { render as renderContact } from '../src/pages/contact.js';
import { render as renderAppointment } from '../src/pages/appointment.js';
import { render as renderPrivacy } from '../src/pages/privacy.js';
import { render as renderTerms } from '../src/pages/terms.js';
import { render as renderMedicalDisclaimer } from '../src/pages/medicaldisclaimer.js';
import { render as renderNotFound } from '../src/pages/notfound.js';
import { renderServiceDetail } from '../src/pages/servicedetail.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

/** @typedef {{ path: string; html: string }} BuiltPage */

/**
 * All pages keyed by URL path.
 * @returns {Map<string, BuiltPage>}
 */
export function buildPageSet() {
  /** @type {Map<string, BuiltPage>} */
  const pages = new Map();
  const add = /** @param {string} path @param {string} html */ (path, html) => {
    pages.set(path, { path, html });
  };
  add('/', renderHome());
  add('/about', renderAbout());
  add('/services', renderServices());
  add('/patients', renderPatients());
  add('/reviews', renderReviews());
  add('/contact', renderContact());
  add('/appointment', renderAppointment());
  add('/privacy', renderPrivacy());
  add('/terms', renderTerms());
  add('/medical-disclaimer', renderMedicalDisclaimer());
  add('/404.html', renderNotFound());
  for (const service of clinic.services) {
    const page = renderServiceDetail(service);
    pages.set(page.path, page);
  }
  return pages;
}

/**
 * Map an internal URL path to a relative dist-relative file path (index.html scheme).
 * @param {string} path
 * @returns {string}
 */
export function pagePathToFile(path) {
  if (path === '/' || path === '') return join('index.html');
  if (path === '/404.html') return join('.', '404.html');
  return join('.', path.replace(/^\/+/, ''), 'index.html');
}

async function bundleAssets() {
  await build({
    entryPoints: [join(SRC, 'assets', 'js', 'main.js')],
    outfile: join(DIST, 'assets', 'js', 'main.js'),
    bundle: true,
    minify: true,
    target: ['es2020'],
    legalComments: 'none',
  });
  await build({
    entryPoints: [join(SRC, 'assets', 'css', 'styles.css')],
    outfile: join(DIST, 'assets', 'css', 'styles.css'),
    bundle: true,
    minify: true,
    loader: { '.css': 'css' },
  });
}

async function copyPublic() {
  await cp(join(SRC, 'public'), DIST, { recursive: true });
}

/**
 * @param {Map<string, BuiltPage>} pages
 */
async function writePages(pages) {
  for (const [path, page] of pages) {
    const file = pagePathToFile(path);
    const out = join(DIST, file);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, page.html, 'utf8');
    console.log('  page', path, '->', file);
  }
}

/**
 * @param {Map<string, BuiltPage>} pages
 */
async function writeSEO(pages) {
  const withUrl = clinic.siteUrl ? `${clinic.siteUrl.replace(/\/+$/, '')}` : '';
  if (!withUrl) {
    console.log('  no siteUrl configured; sitemap.xml and robots.txt deferred');
    return;
  }
  const urls = [];
  for (const path of pages.keys()) {
    if (path === '/404.html') continue;
    const clean = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    urls.push(`  <url><loc>${withUrl}${clean}</loc></url>`);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${withUrl}/sitemap.xml\n`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(join(DIST, 'robots.txt'), robots, 'utf8');
  console.log('  wrote sitemap.xml + robots.txt');
}

/**
 * Render the whole site into dist/.
 * @returns {Promise<string[]>} rendered URL paths
 */
export async function runBuild() {
  console.log('build: cleaning dist/');
  await rm(DIST, { recursive: true, force: true });

  console.log('build: bundling assets');
  await bundleAssets();

  console.log('build: copying public assets');
  await copyPublic();

  console.log('build: rendering pages');
  const pages = buildPageSet();
  await writePages(pages);

  console.log('build: writing SEO artifacts');
  await writeSEO(pages);

  console.log('build: done');
  return [...pages.keys()];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runBuild().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}