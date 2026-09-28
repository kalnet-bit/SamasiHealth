// @ts-check
import { clinic } from '../config/clinic.js';
import { NAV_LINKS } from './nav.js';

/**
 * Site footer with identity, contact, navigation and legal links.
 * Social icons are only rendered when official accounts are configured.
 * @returns {string}
 */
export function footer() {
  const nav = NAV_LINKS.map(
    (l) => `<li><a class="footer__link" href="${l.href}">${l.label}</a></li>`,
  ).join('\n');

  const social = Object.keys(clinic.social)
    .map((key) => {
      const url = (clinic.social)[key];
      return `<a class="footer__social" href="${url}" target="_blank" rel="noopener" aria-label="${key}">${key}</a>`;
    })
    .join('');

  return (
    `<footer class="site-footer">` +
    `<div class="container">` +
    `<div class="footer__grid">` +
    `<div class="footer__col">` +
    `<p class="footer__brand">${clinic.name}</p>` +
    `<p class="footer__text">${clinic.address.street}, ${clinic.address.city}, ${clinic.address.country}</p>` +
    `<p class="footer__text"><a class="footer__link footer__tel" href="${clinic.phone.telHref}">${clinic.phone.display}</a></p>` +
    (social ? `<p class="footer__socials">${social}</p>` : '') +
    `</div>` +
    `<div class="footer__col">` +
    `<p class="footer__title">Navigation</p>` +
    `<ul class="footer__list">${nav}</ul>` +
    `</div>` +
    `<div class="footer__col">` +
    `<p class="footer__title">Hours</p>` +
    `<p class="footer__text">${clinic.hours.display}</p>` +
    `<p class="footer__note">${clinic.hours.source}. Hours may change — please call to confirm.</p>` +
    `<p class="footer__title">Website</p>` +
    `<ul class="footer__list">` +
    `<li><a class="footer__link" href="/privacy">Privacy Policy</a></li>` +
    `<li><a class="footer__link" href="/terms">Terms of Use</a></li>` +
    `<li><a class="footer__link" href="/medical-disclaimer">Medical Disclaimer</a></li>` +
    `</ul>` +
    `</div>` +
    `</div>` +
    `<div class="footer__bottom">` +
    `<p class="footer__note">Website branding and positioning are based on publicly listed details. Unverified information is clearly marked.</p>` +
    `<p class="footer__note footer__copy">© ${new Date().getFullYear()} ${clinic.shortName}. Website for information and appointment requests.</p>` +
    `</div>` +
    `</div></footer>`
  );
}