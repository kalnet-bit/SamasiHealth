// @ts-check
import { clinic } from '../config/clinic.js';
import { brand } from './brand.js';
import { navList } from './nav.js';
import { icon } from './icons.js';

/**
 * Page header: sticky, brand, desktop nav + CTAs, hamburger for mobile.
 * @param {{ active: string }} opts
 * @returns {string}
 */
export function header({ active }) {
  return (
    `<header class="site-header">` +
    `<div class="container site-header__inner">` +
    brand() +
    `<nav class="nav" aria-label="Main">` +
    navList(active) +
    `<a class="btn btn--ghost btn--sm site-header__call" href="${clinic.phone.telHref}">` +
    `<span class="btn__icon">${icon('phone', { size: 18 })}</span>Call Clinic</a>` +
    `<a class="btn btn--primary btn--sm site-header__cta" href="/appointment">Book an Appointment</a>` +
    `</nav>` +
    `<button type="button" class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">` +
    `<span class="menu-toggle__label">Menu</span>` +
    `<span class="menu-toggle__icon" aria-hidden="true" data-menu-icon>${icon('menu', { size: 26 })}</span>` +
    `</button>` +
    `</div>` +
    `<div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>` +
    `<div class="mobile-menu__panel">` +
    `<div class="mobile-menu__nav">` +
    navList(active) +
    `</div>` +
    `<div class="mobile-menu__actions">` +
    `<a class="btn btn--ghost btn--block" href="${clinic.phone.telHref}">${icon('phone', { size: 18 })}\u00a0\u00a0Call ${clinic.phone.display}</a>` +
    `<a class="btn btn--primary btn--block" href="/appointment">Book an Appointment</a>` +
    `<a class="btn btn--outline btn--block" href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('map-pin', { size: 18 })}\u00a0\u00a0Get Directions</a>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</header>`
  );
}