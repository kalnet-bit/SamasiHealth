// @ts-check
import { clinic, contentSources } from '../config/clinic.js';
import { icon } from './icons.js';
import { comingSoonNotice } from './notices.js';
import { sectionHeading } from './section.js';

/**
 * Service card — rendered from configured services only.
 * @param {import('../config/clinic.js').Service} service
 * @returns {string}
 */
export function serviceCard(service) {
  const bookable = service.bookable
    ? `<span class="card__tag card__tag--ok">Request online</span>`
    : `<span class="card__tag">Contact clinic</span>`;
  const verified =
    service.verificationStatus === 'OFFICIAL-RECORD-VERIFIED'
      ? `<p class="service-card__source"><a class="service-card__source-link" href="${contentSources.moh.url}" rel="noopener" target="_blank">${icon('shield-check', { size: 14 })}&nbsp;Listed in the national health facility record</a></p>`
      : '';
  return (
    `<article class="service-card">` +
    `<div class="service-card__icon" aria-hidden="true">${icon(service.icon, { size: 24 })}</div>` +
    `<h3 class="service-card__title">${service.name}</h3>` +
    verified +
    `<p class="service-card__text">${service.summary}</p>` +
    bookable +
    `<a class="service-card__link" href="/services/${service.slug}/">View details ${icon('arrow-right', { size: 16 })}</a>` +
    `</article>`
  );
}

/**
 * Honest empty state — used until the clinic confirms its service list.
 * @returns {string}
 */
export function servicesEmptyState() {
  return (
    `<div class="empty-state">` +
    `<div class="empty-state__mark" aria-hidden="true">${icon('info', { size: 28 })}</div>` +
    `<h3 class="empty-state__title">Service list being prepared</h3>` +
    comingSoonNotice(
      'Service information is being updated. Please contact the clinic to confirm services currently available.',
    ) +
    `<a class="btn btn--primary" href="${clinic.phone.telHref}">Call ${clinic.phone.display}</a>` +
    `</div>`
  );
}

/**
 * Services preview section for the home page.
 * @returns {string}
 */
export function servicesSection() {
  return (
    `<section id="services" class="section">` +
    `<div class="container">` +
    sectionHeading({
      eyebrow: 'Services',
      title: 'Healthcare Services',
      lede: 'Explore the healthcare services available at Samasi Rangitatu Polyclinic.',
    }) +
    (clinic.services.length
      ? `<div class="services-grid">${clinic.services.map(serviceCard).join('\n')}</div>`
      : servicesEmptyState()) +
    `<p class="section-actions"><a class="btn btn--outline" href="/services">View all services</a></p>` +
    `</div></section>`
  );
}

/**
 * Service index grid used by the /services page.
 * @returns {string}
 */
export function servicesGrid() {
  const grid = clinic.services.length
    ? `<div class="services-grid">${clinic.services.map(serviceCard).join('\n')}</div>`
    : servicesEmptyState();
  return grid;
}

/**
 * Data-source note shown under empty service UI.
 * @returns {string}
 */
export function servicesNote() {
  return `The list of services shown is added only after confirmation by ${clinic.name}. No services are implied or invented.`;
}