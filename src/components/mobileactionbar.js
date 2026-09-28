// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';

/**
 * Persistent mobile action bar: Call | Directions | Appointment.
 * Hidden on larger screens; padded for in the CSS so it never blocks content.
 * @returns {string}
 */
export function mobileActionBar() {
  return (
    `<nav class="mobile-bar" aria-label="Quick actions">` +
    `<a class="mobile-bar__item" href="${clinic.phone.telHref}">${icon('phone', { size: 20 })}<span>Call</span></a>` +
    `<a class="mobile-bar__item" href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('map-pin', { size: 20 })}<span>Directions</span></a>` +
    `<a class="mobile-bar__item" href="/appointment">${icon('calendar', { size: 20 })}<span>Appointment</span></a>` +
    `</nav>`
  );
}