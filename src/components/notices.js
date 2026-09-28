// @ts-check
import { icon } from './icons.js';

/**
 * Emergency safety notice — we never claim emergency capability.
 * @returns {string}
 */
export function emergencyNotice() {
  return (
    `<aside class="notice notice--alert" role="note">` +
    `<span class="notice__icon" aria-hidden="true">${icon('alert', { size: 20 })}</span>` +
    `<p class="notice__text"><strong>Medical emergency?</strong> If you are experiencing a medical emergency, seek appropriate emergency medical assistance rather than relying on this website or online contact forms.</p>` +
    `</aside>`
  );
}

/**
 * Medical disclaimer used at the bottom of health-information pages.
 * @returns {string}
 */
export function medicalDisclaimer() {
  return (
    `<aside class="notice" role="note">` +
    `<span class="notice__icon" aria-hidden="true">${icon('info', { size: 20 })}</span>` +
    `<p class="notice__text"><strong>Medical disclaimer.</strong> The information on this website is provided for general awareness and appointment purposes. It does not replace professional medical advice, diagnosis or treatment. Always consult qualified healthcare staff for medical concerns. See the <a href="/medical-disclaimer">full medical disclaimer</a>.</p>` +
    `</aside>`
  );
}

/**
 * Data honesty notice shown wherever unverified information appears (empty states).
 * @param {string} text
 * @returns {string}
 */
export function comingSoonNotice(text) {
  return (
    `<p class="empty-state__text"><span class="empty-state__icon" aria-hidden="true">${icon('info', { size: 18 })}</span>${text}</p>`
  );
}