// @ts-check
import { clinic } from '../config/clinic.js';
import { brandMark } from './icons.js';

/**
 * Text-based brand lockup. Uses the wordmark plus a subtle website-brand mark.
 * When the clinic supplies an official logo (clinic.logo), that is used instead.
 * Always rendered as a non-heading element: the page's single <h1> belongs to
 * its main content heading, so the logo never competes for it.
 * @returns {string}
 */
export function brand() {
  const logo = clinic.logo
    ? `<img src="${clinic.logo}" alt="${clinic.name}" class="brand-logo" width="auto" height="40" />`
    : brandMark({ size: 40, className: 'brand-mark' });
  return (
    `<p class="brand">` +
    `<a href="/" class="brand__link" aria-label="${clinic.name} — home">` +
    logo +
    `<span class="brand__text">` +
    `<span class="brand__name">Samasi Rangitatu</span>` +
    `<span class="brand__sub">Polyclinic</span>` +
    `</span>` +
    `</a></p>`
  );
}

/**
 * Line of text describing the proposed positioning, with an honesty note.
 * @returns {string}
 */
export function taglineLine() {
  return `Website positioning proposed by the website team — not a confirmed official slogan.`;
}