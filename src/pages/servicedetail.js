// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { openSection, closeSection } from '../components/section.js';
import { emergencyNotice, medicalDisclaimer } from '../components/notices.js';
import { icon } from '../components/icons.js';
import { clinic, facilityRecord } from '../config/clinic.js';

/**
 * Detail page for a single configured service (/services/:slug).
 * Only fields that exist on the service are rendered — nothing is invented.
 * @param {import('../config/clinic.js').Service} service
 * @returns {{ path: string; html: string }}
 */
export function renderServiceDetail(service) {
  const blocks = [];

  if (service.description) {
    blocks.push(`<h2>About this service</h2><p>${service.description}</p>`);
  }

  if (service.included && service.included.length) {
    blocks.push(
      `<h2>What the national record lists</h2><ul>` +
        service.included.map((i) => `<li>${i}</li>`).join('') +
        `</ul>` +
        `<p class="text-note">These items come from the clinic's official national facility record. Confirm current availability with the clinic before visiting.</p>`,
    );
  }

  if (service.eligibility && service.eligibility.length) {
    blocks.push(
      `<h2>Who it is for</h2><ul>` +
        service.eligibility.map((e) => `<li>${e}</li>`).join('') +
        `</ul>`,
    );
  }

  if (service.preparation && service.preparation.length) {
    blocks.push(
      `<h2>Before your visit</h2><ul>` +
        service.preparation.map((p) => `<li>${p}</li>`).join('') +
        `</ul>`,
    );
  }

  const metaRows = [];
  if (service.verificationStatus === 'OFFICIAL-RECORD-VERIFIED') {
    metaRows.push(
      `<div class="fact-row"><dt>Source</dt><dd>Listed in the national health facility record (code ${facilityRecord.code})</dd></div>`,
    );
  }
  if (service.duration) {
    metaRows.push(`<div class="fact-row"><dt>Typical duration</dt><dd>${service.duration}</dd></div>`);
  }
  if (service.price) {
    // Only rendered when the clinic authorised a public price.
    metaRows.push(`<div class="fact-row"><dt>Price</dt><dd>${service.price}</dd></div>`);
  }

  const meta = metaRows.length
    ? `<div class="service-meta"><dl class="fact-list">${metaRows.join('\n')}</dl></div>`
    : '';

  const availability =
    service.bookable
      ? `<p class="text-note">Appointment requests are available for this service — requests are submitted to the clinic and subject to confirmation before your visit.</p>`
      : `<p class="text-note">For this service, please contact the clinic to check availability.</p>`;

  const actions =
    service.bookable
      ? `<a class="btn btn--primary" href="/appointment">Book an Appointment</a>` +
        `<a class="btn btn--outline" href="${clinic.phone.telHref}">${icon('phone', { size: 16 })}\u00a0\u00a0Contact the Clinic</a>`
      : `<a class="btn btn--primary" href="${clinic.phone.telHref}">${icon('phone', { size: 16 })}\u00a0\u00a0Contact the Clinic</a>`;

  const body =
    pageHero({
      eyebrow: 'Services \u2022 ' + clinic.shortName,
      title: service.name,
      lede: service.summary,
    }) +
    `<div class="section"><div class="container">${emergencyNotice()}</div></div>` +
    openSection() +
    `<div class="container container--narrow">` +
    `<article class="prose">` +
    (blocks.length ? blocks.join('\n') : `<p>Detailed information for this service is being prepared by the clinic.</p>`) +
    `</article>` +
    meta +
    availability +
    `<div class="section-actions">` +
    actions +
    `</div>` +
    `</div>` +
    closeSection() +
    `<div class="section"><div class="container container--narrow">` +
    medicalDisclaimer() +
    `</div></div>`;

  return {
    path: `/services/${service.slug}/`,
    html: renderPage({
      path: `/services/${service.slug}/`,
      title: `${service.name} | Services | Samasi Rangitatu Polyclinic`,
      description: service.summary,
      active: 'services',
      body,
    }),
  };
}