// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';
import { ratingBlock } from './trustcard.js';
import { sectionHeading } from './section.js';

/**
 * Reviews section — only the supplied rating, clearly sourced.
 * @param {{ full?: boolean }} [opts]
 * @returns {string}
 */
export function reviewsSection(opts = {}) {
  const { full = false } = opts;

  const action = clinic.googleReviewsUrl
    ? `<a class="btn btn--outline" href="${clinic.googleReviewsUrl}" target="_blank" rel="noopener">View Google Reviews ${icon('arrow-right', { size: 16 })}</a>`
    : `<p class="text-note">A direct link to the clinic's Google reviews page will be added once the clinic confirms it.</p>`;

  const body = `<div class="reviews-grid">${ratingBlock()}` +
    `<div class="reviews-card">` +
    `<p class="reviews-card__title">Where this rating comes from</p>` +
    `<p class="reviews-card__text">The rating above reflects the ${clinic.rating.source.toLowerCase()} at the time the website was prepared. Ratings and review counts change over time and should be verified with the clinic or the listing itself.</p>` +
    `<p class="reviews-card__text">Individual patient reviews are only published here when they are confirmed by the clinic or supplied by patients with permission.</p>` +
    `</div></div>` +
    `<div class="section-actions">${action}</div>`;

  if (full) {
    return body;
  }

  return (
    `<section id="reviews" class="section section--soft">` +
    `<div class="container">` +
    sectionHeading({
      eyebrow: 'Reviews',
      title: 'Patient Reviews',
      lede: `What the Google listing currently shows for ${clinic.name}.`,
    }) +
    body +
    `</div></section>`
  );
}