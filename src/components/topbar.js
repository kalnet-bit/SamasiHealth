// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';

/**
 * Slim information bar (location / phone / hours).
 * Hours come from a public listing and may change — clearly marked as such.
 * @returns {string}
 */
export function topbar() {
  const hourNote = clinic.hours.verified
    ? ''
    : ` <span class="topbar__note">(listed hours — please confirm with the clinic)</span>`;
  return (
    `<div class="topbar">` +
    `<div class="container topbar__inner">` +
    `<span class="topbar__item">${icon('map-pin', { size: 16 })}\u00a0<span>${clinic.address.street}, ${clinic.address.city}</span></span>` +
    `<a class="topbar__item topbar__link" href="${clinic.phone.telHref}">${icon('phone', { size: 16 })}\u00a0<span>${clinic.phone.display}</span></a>` +
    `<span class="topbar__item">${icon('clock', { size: 16 })}\u00a0<span>${clinic.hours.display}</span>${hourNote}</span>` +
    `</div></div>`
  );
}