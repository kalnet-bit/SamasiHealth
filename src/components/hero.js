// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';
import { trustPanel } from './trustcard.js';

/**
 * Hero — communicates WHO / WHAT / WHERE / ACTION.
 * Uses an elegant CSS/SVG treatment instead of unverified stock photos of staff.
 * @returns {string}
 */
export function hero() {
  return (
    `<section class="hero">` +
    `<div class="container hero__inner">` +
    `<div class="hero__copy">` +
    `<p class="eyebrow eyebrow--light">Private Polyclinic \u2022 Dar es Salaam</p>` +
    `<h1 class="hero__title">Quality Healthcare, Close to You</h1>` +
    `<p class="hero__lede">Access healthcare information, contact the clinic, and request an appointment from one convenient place.</p>` +
    `<div class="hero__actions">` +
    `<a class="btn btn--primary btn--lg" href="${clinic.phone.telHref}">${icon('phone', { size: 20 })}\u00a0\u00a0Call ${clinic.phone.display}</a>` +
    `<a class="btn btn--inverse btn--lg" href="/appointment">Book an Appointment</a>` +
    `<a class="btn btn--link-light" href="${clinic.directionsUrl}" target="_blank" rel="noopener">Get Directions ${icon('arrow-right', { size: 18 })}</a>` +
    `</div>` +
    trustPanel() +
    `</div>` +
    `<div class="hero__aside" aria-hidden="false">` +
    `<div class="clinic-card">` +
    `<p class="clinic-card__name">${clinic.name}</p>` +
    `<p class="clinic-card__addr">${icon('map-pin', { size: 16 })} ${clinic.address.street}, ${clinic.address.city}</p>` +
    `<dl class="clinic-card__list">` +
    `<div class="clinic-card__row"><dt>${icon('phone', { size: 16 })}<span class="visually-hidden">Phone</span></dt><dd><a href="${clinic.phone.telHref}">${clinic.phone.display}</a></dd></div>` +
    `<div class="clinic-card__row"><dt>${icon('clock', { size: 16 })}<span class="visually-hidden">Hours</span></dt><dd>${clinic.hours.display}</dd></div>` +
    `<div class="clinic-card__row"><dt>${icon('user', { size: 16 })}<span class="visually-hidden">Type</span></dt><dd>Private polyclinic</dd></div>` +
    `</dl>` +
    `<a class="btn btn--primary btn--block" href="/appointment">Request an Appointment</a>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</section>`
  );
}