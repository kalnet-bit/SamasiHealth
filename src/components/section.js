// @ts-check
import { clinic } from '../config/clinic.js';

/**
 * Page-section structural helpers used by every page.
 * @param {{ id?: string; className?: string; background?: 'soft' | 'blue' | 'teal' }} [opts]
 */
export function openSection(opts = {}) {
  const { id = '', className = '', background = '' } = opts;
  const attrs = [
    id ? ` id="${id}"` : '',
    ` class="section${className ? ' ' + className : ''}${background ? ` section--${background}` : ''}"`,
  ].join('');
  return `<section${attrs}>`;
}

/** @returns {string} */
export function closeSection() {
  return `</section>`;
}

/**
 * Consistent heading block: optional eyebrow, title, lede, optional link.
 * @param {{ eyebrow?: string; title: string; lede?: string; align?: 'left'|'center' }} p
 * @returns {string}
 */
export function sectionHeading(p) {
  const { eyebrow = '', title, lede = '', align = 'center' } = p;
  return (
    `<div class="section-head section-head--${align}">` +
    (eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : '') +
    `<h2 class="section-head__title">${title}</h2>` +
    (lede ? `<p class="section-head__lede">${lede}</p>` : '') +
    `</div>`
  );
}

/**
 * CTA band used across pages: primary appointment action + call fallback.
 * @param {{ title?: string; text?: string; contextClass?: string }} [opts]
 * @returns {string}
 */
export function ctaBand(opts = {}) {
  const { title = 'Book a visit', text = 'Request an appointment online or call the clinic directly. Requests are subject to confirmation by the clinic.', contextClass = '' } = opts;
  return (
    `<div class="cta-band${contextClass ? ' ' + contextClass : ''}">` +
    `<div class="container cta-band__inner">` +
    `<div class="cta-band__copy">` +
    `<h2 class="cta-band__title">${title}</h2>` +
    `<p class="cta-band__text">${text}</p>` +
    `</div>` +
    `<div class="cta-band__actions">` +
    `<a class="btn btn--inverse" href="/appointment">Book an Appointment</a>` +
    `<a class="btn btn--counter-soft" href="${clinic.phone.telHref}">Call ${clinic.phone.display}</a>` +
    `</div>` +
    `</div></div>`
  );
}