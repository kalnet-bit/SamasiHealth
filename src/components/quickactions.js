// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';

/**
 * Quick action strip right below the hero.
 * @returns {string}
 */
export function quickActions() {
  /** @type {({ icon: import('./icons.js').IconName; title: string; text: string; href: string; external: boolean })[]} */
  const items = [
    {
      icon: 'phone',
      title: 'Call the Clinic',
      text: clinic.phone.display,
      href: clinic.phone.telHref,
      external: false,
    },
    {
      icon: 'map-pin',
      title: 'Get Directions',
      text: clinic.address.street,
      href: clinic.directionsUrl,
      external: true,
    },
    {
      icon: 'calendar',
      title: 'Book an Appointment',
      text: 'Request a preferred time',
      href: '/appointment',
      external: false,
    },
    {
      icon: 'chat',
      title: 'Ask a Question',
      text: 'Contact the clinic',
      href: '/contact',
      external: false,
    },
  ];
  const cards = items
    .map((it) => {
      const ext = it.external ? ' target="_blank" rel="noopener"' : '';
      return (
        `<a class="quick-card" href="${it.href}"${ext}>` +
        `<span class="quick-card__icon" aria-hidden="true">${icon(it.icon, { size: 22 })}</span>` +
        `<span class="quick-card__body"><strong class="quick-card__title">${it.title}</strong>` +
        `<span class="quick-card__text">${it.text}</span></span>` +
        `<span class="quick-card__arrow" aria-hidden="true">${icon('arrow-right', { size: 18 })}</span>` +
        `</a>`
      );
    })
    .join('\n');
  return `<div class="quick-actions"><div class="container quick-actions__grid">${cards}</div></div>`;
}