// @ts-check
import { clinic } from '../config/clinic.js';
import { comingSoonNotice } from './notices.js';
import { icon } from './icons.js';

/**
 * "Before your visit" — general, configurable information only.
 * @returns {string}
 */
export function patientInfo() {
  const checklist =
    clinic.patientChecklist.length > 0
      ? `<ul class="check-list">` +
        clinic.patientChecklist.map((item) => `<li>${icon('check', { size: 16 })}<span>${item}</span></li>`).join('\n') +
        `</ul>`
      : `<div class="empty-state empty-state--inline">` +
        comingSoonNotice(
          'What to bring during a visit is being added. Please contact the clinic to confirm what is required.',
        ) +
        `</div>`;

  return (
    `<div class="patient-info">` +
    `<div class="info-card">` +
    `<h3 class="info-card__title">What to bring</h3>` +
    `<p class="info-card__lede">General information — please confirm with the clinic before your visit.</p>` +
    checklist +
    `</div>` +
    `<div class="info-card">` +
    `<h3 class="info-card__title">Appointment requests</h3>` +
    `<p class="info-card__text">Online appointment requests are received by the clinic and require confirmation. The clinic will contact you to confirm your appointment time.</p>` +
    `<p class="info-card__text">For same-day needs, call <a href="${clinic.phone.telHref}">${clinic.phone.display}</a>.</p>` +
    `</div>` +
    `<div class="info-card">` +
    `<h3 class="info-card__title">Contact</h3>` +
    `<p class="info-card__text"><a class="info-card__tel" href="${clinic.phone.telHref}">${icon('phone', { size: 16 })}\u00a0${clinic.phone.display}</a></p>` +
    `<p class="info-card__text">${clinic.address.street}, ${clinic.address.city}, ${clinic.address.country}</p>` +
    `</div>` +
    `</div>`
  );
}