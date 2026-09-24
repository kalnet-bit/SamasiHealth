// @ts-check
import { clinic } from '../config/clinic.js';
import { topbar } from '../components/topbar.js';
import { header } from '../components/header.js';
import { footer } from '../components/footer.js';
import { mobileActionBar } from '../components/mobileactionbar.js';

const SITE_DESCRIPTION =
  'Samasi Rangitatu Polyclinic is a private healthcare facility on Charambe Street, Dar es Salaam, Tanzania. Contact the clinic to confirm services or request an appointment.';

/**
 * MedicalClinic structured data. Only verified fields are included —
 * geo coordinates and full opening hours are omitted until confirmed.
 * @param {string} path
 * @returns {object}
 */
export function medicalClinicLd(path) {
  const ld = /** @type {Record<string, unknown>} */ ({
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinic.name,
    description: SITE_DESCRIPTION,
    telephone: clinic.phone.international,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressCountry: 'TZ',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: clinic.rating.score,
      reviewCount: clinic.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
  });
  if (clinic.siteUrl) {
    ld.url = clinic.siteUrl + path;
  }
  return ld;
}

/**
 * FAQPage structured data using only supplied/operational FAQ items.
 * @returns {object}
 */
export function faqPageLd() {
  const mainEntity = clinic.faqCategories
    .flatMap((category) => category.items)
    .map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

/**
 * Render a complete page.
 * @param {{ path: string; title: string; description: string; active: string; body: string; extraLd?: object[] }} p
 * @returns {string}
 */
export function renderPage(p) {
  const siteUrl = clinic.siteUrl;
  const canonical = siteUrl ? `\n    <link rel="canonical" href="${siteUrl}${p.path}">` : '';
  const og = siteUrl
    ? `\n    <meta property="og:type" content="website">\n    <meta property="og:site_name" content="${clinic.name}">\n    <meta property="og:title" content="${p.title}">\n    <meta property="og:description" content="${p.description}">\n    <meta property="og:url" content="${siteUrl}${p.path}">`
    : '';

  const ldBlocks = [medicalClinicLd(p.path), ...(p.extraLd || [])]
    .map((obj) => `\n    <script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('');

  return (
    `<!DOCTYPE html>\n` +
    `<html lang="en">\n` +
    `<head>\n` +
    `    <meta charset="UTF-8">\n` +
    `    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
    `    <meta name="description" content="${p.description}">\n` +
    `    <meta name="robots" content="index, follow">\n` +
    `    <meta name="theme-color" content="#0b4f6c">\n` +
    `    <link rel="icon" href="/favicon.ico" sizes="any">\n` +
    `    <link rel="preconnect" href="https://fonts.googleapis.com">\n` +
    `    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n` +
    `    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n` +
    `    <title>${p.title}</title>${canonical}${og}\n` +
    ldBlocks +
    `\n    <link rel="stylesheet" href="/assets/css/styles.css">\n` +
    `</head>\n` +
    `<body>\n` +
    `<a class="skip-link" href="#main">Skip to main content</a>\n` +
    topbar() +
    header({ active: p.active }) +
    `<main id="main">\n${p.body}\n</main>\n` +
    footer() +
    mobileActionBar() +
    `<script src="/assets/js/main.js" defer></script>\n` +
    `<script>\n` +
    `  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };\n` +
    `</script>\n` +
    `<script defer src="/_vercel/speed-insights/script.js"></script>\n` +
    `</body>\n` +
    `</html>\n`
  );
}