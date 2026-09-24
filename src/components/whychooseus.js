// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';
import { sectionHeading } from './section.js';

/**
 * Values-based "Why choose us" section.
 * Framed as website/service principles — no clinical-outcome claims.
 * @returns {string}
 */
export function whyChooseUs() {
  const cards = clinic.whyChooseUs
    .map(
      (r) =>
        `<article class="value-card">` +
        `<div class="value-card__icon" aria-hidden="true">${icon(r.icon, { size: 24 })}</div>` +
        `<h3 class="value-card__title">${r.title}</h3>` +
        `<p class="value-card__text">${r.text}</p>` +
        `</article>`,
    )
    .join('\n');

  return (
    `<div id="why-us">` +
    sectionHeading({
      eyebrow: 'Why choose us',
      title: 'Built around patient convenience',
      lede: 'Simple, respectful and accessible — the principles behind this website.',
    }) +
    `<div class="values-grid">${cards}</div>` +
    `<p class="text-note"><strong>Note:</strong> these are the values of our website and service approach. For information about clinical outcomes, please speak directly with ${clinic.name}.</p>` +
    `</div>`
  );
}