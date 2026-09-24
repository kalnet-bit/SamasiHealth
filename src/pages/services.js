// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { servicesGrid, servicesNote } from '../components/services.js';
import { openSection, closeSection, ctaBand } from '../components/section.js';
import { clinic } from '../config/clinic.js';

const DESCRIPTION =
  'Healthcare services at Samasi Rangitatu Polyclinic, Charambe Street, Dar es Salaam. Contact the clinic to confirm services currently available.';

function body() {
  return (
    pageHero({
      eyebrow: 'Services',
      title: 'Healthcare Services',
      lede: `Explore the healthcare services available at ${clinic.shortName}.`,
    }) +
    openSection() +
    `<div class="container">` +
    servicesGrid() +
    `<p class="text-note text-note--center">${servicesNote()}</p>` +
    `<div class="section-actions">` +
    `<a class="btn btn--primary" href="${clinic.phone.telHref}">Call ${clinic.phone.display}</a>` +
    `<a class="btn btn--outline" href="/appointment">Request an Appointment</a>` +
    `</div>` +
    `</div>` +
    closeSection() +
    ctaBand({
      title: 'Not sure what you need?',
      text: 'Call the clinic — a direct phone contact is available to help you.',
    })
  );
}

export function render() {
  return renderPage({
    path: '/services',
    title: 'Services | Samasi Rangitatu Polyclinic',
    description: DESCRIPTION,
    active: 'services',
    body: body(),
  });
}