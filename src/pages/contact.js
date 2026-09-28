// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { contactForm } from '../components/forms.js';
import { locationSection } from '../components/location.js';
import { openSection, closeSection, sectionHeading } from '../components/section.js';
import { emergencyNotice, medicalDisclaimer } from '../components/notices.js';
import { icon } from '../components/icons.js';
import { clinic } from '../config/clinic.js';

const DESCRIPTION =
  'Contact Samasi Rangitatu Polyclinic, Charambe Street, Dar es Salaam. Call 0716 324 331 or send a message.';

function contactCards() {
  /** @type {({ icon: import('../components/icons.js').IconName; title: string; body: string; note: string })[]} */
  const cards = [
    {
      icon: 'phone',
      title: 'Call the Clinic',
      body: `<a class="contact-card__link" href="${clinic.phone.telHref}">${clinic.phone.display}</a>`,
      note: 'Quickest way to confirm services and availability.',
    },
    {
      icon: 'map-pin',
      title: 'Visit the Clinic',
      body: `${clinic.address.street}, ${clinic.address.city}`,
      note: clinic.address.country,
    },
    {
      icon: 'clock',
      title: 'Hours',
      body: clinic.hours.display,
      note: `${clinic.hours.source}. Please call to confirm.`,
    },
  ];
  return (
    `<div class="contact-cards">` +
    cards
      .map(
        (c) =>
          `<div class="contact-card">` +
          `<div class="contact-card__icon" aria-hidden="true">${icon(c.icon, { size: 22 })}</div>` +
          `<h3 class="contact-card__title">${c.title}</h3>` +
          `<p class="contact-card__body">${c.body}</p>` +
          `<p class="contact-card__note">${c.note}</p>` +
          `</div>`,
      )
      .join('\n') +
    `</div>`
  );
}

function body() {
  return (
    pageHero({
      eyebrow: 'Contact',
      title: 'Contact the Clinic',
      lede: `Reach ${clinic.shortName} directly by phone, or send a message.`,
    }) +
    `<div class="section"><div class="container">${emergencyNotice()}</div></div>` +
    openSection() +
    `<div class="container">` +
    contactCards() +
    `</div>` +
    closeSection() +
    openSection({ className: 'section--soft' }) +
    `<div class="container">` +
    `<div class="contact-layout">` +
    `<div class="contact-layout__form">` +
    sectionHeading({ eyebrow: 'Message', title: `Send a message`, align: 'left' }) +
    contactForm() +
    `</div>` +
    `<div class="contact-layout__aside">` +
    `<div class="side-card">` +
    `<h3 class="side-card__title">Prefer to talk?</h3>` +
    `<p class="side-card__text">Call the clinic directly — it is the fastest way to confirm services and arrange a visit.</p>` +
    `<a class="btn btn--primary btn--block" href="${clinic.phone.telHref}">${icon('phone', { size: 18 })}\u00a0\u00a0Call ${clinic.phone.display}</a>` +
    `<p class="side-card__note">${clinic.hours.display}. Hours may change — please confirm with the clinic.</p>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    closeSection() +
    locationSection() +
    `<div class="section"><div class="container container--narrow">` +
    medicalDisclaimer() +
    `</div></div>`
  );
}

export function render() {
  return renderPage({
    path: '/contact',
    title: 'Contact | Samasi Rangitatu Polyclinic',
    description: DESCRIPTION,
    active: 'contact',
    body: body(),
  });
}