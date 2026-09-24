// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';

/**
 * Discreet trust component — shows the supplied Google listing rating only.
 * Review content is never fabricated.
 * @returns {string}
 */
export function trustPanel() {
  return (
    `<div class="trust-panel">` +
    `<span class="trust-panel__stars" aria-hidden="true">` +
    `${icon('star', { size: 16 })}\u00a0${icon('star', { size: 16 })}\u00a0${icon('star', { size: 16 })}\u00a0${icon('star', { size: 16 })}\u00a0${icon('star', { size: 16 })}` +
    `</span>` +
    `<p class="trust-panel__value"><strong>${clinic.rating.score.toFixed(1)}</strong> \u00b7 ${clinic.rating.count} review${clinic.rating.count === 1 ? '' : 's'}</p>` +
    `<p class="trust-panel__note">Rating shown on the ${clinic.rating.source}.</p>` +
    `</div>`
  );
}

/**
 * Larger rating block used on the reviews page.
 * @returns {string}
 */
export function ratingBlock() {
  return (
    `<div class="rating-block">` +
    `<p class="rating-block__value">${clinic.rating.score.toFixed(1)}</p>` +
    `<p class="rating-block__stars" aria-label="${clinic.rating.score.toFixed(1)} out of 5 stars">` +
    Array.from({ length: 5 }, () => icon('star', { size: 22 })).join('') +
    `</p>` +
    `<p class="rating-block__count">${clinic.rating.count} reviews</p>` +
    `<p class="rating-block__note">Source: ${clinic.rating.source.toLowerCase()}.</p>` +
    `</div>`
  );
}