// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';
import { sectionHeading } from './section.js';

/**
 * Location block — address + directions action.
 * Uses an elegant placeholder instead of a fake map pin (no verified coordinates).
 * @returns {string}
 */
export function locationSection() {
  return (
    `<section id="location" class="section section--soft">` +
    `<div class="container">` +
    sectionHeading({
      eyebrow: 'Location',
      title: 'Find the clinic',
      lede: 'Charambe Street, Dar es Salaam',
    }) +
    `<div class="location-card">` +
    `<div class="location-card__info">` +
    `<p class="location-card__name">${clinic.name}</p>` +
    `<p class="location-card__line">${icon('map-pin', { size: 18 })} ${clinic.address.street}</p>` +
    `<p class="location-card__line">${clinic.address.city}, ${clinic.address.country}</p>` +
    `<dl class="location-card__meta">` +
    `<div><dt>${icon('clock', { size: 16 })}<span class="visually-hidden">Hours</span></dt><dd>${clinic.hours.display}</dd></div>` +
    `<div><dt>${icon('phone', { size: 16 })}<span class="visually-hidden">Phone</span></dt><dd><a href="${clinic.phone.telHref}">${clinic.phone.display}</a></dd></div>` +
    `</dl>` +
    `<a class="btn btn--primary" href="${clinic.directionsUrl}" target="_blank" rel="noopener">Get Directions ${icon('arrow-right', { size: 16 })}</a>` +
    `</div>` +
    `<div class="location-card__map" role="img" aria-label="Map placeholder: ${clinic.address.street}, ${clinic.address.city}">` +
    `<div class="map-placeholder">` +
    `<div class="map-placeholder__pin" aria-hidden="true">${icon('map-pin', { size: 42 })}</div>` +
    `<p class="map-placeholder__name">${clinic.shortName}</p>` +
    `<p class="map-placeholder__addr">${clinic.address.street}, ${clinic.address.city}</p>` +
    `<p class="map-placeholder__note">A verified map can be embedded once the clinic confirms its exact location pin.</p>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div></section>`
  );
}