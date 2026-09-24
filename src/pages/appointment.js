// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { appointmentForm } from '../components/forms.js';
import { openSection, closeSection } from '../components/section.js';
import { emergencyNotice, medicalDisclaimer } from '../components/notices.js';
import { clinic } from '../config/clinic.js';
import { icon } from '../components/icons.js';

const DESCRIPTION =
  'Request an appointment online at Samasi Rangitatu Polyclinic, Dar es Salaam. Submit a request and the clinic will contact you to confirm.';

/**
 * @typedef {{ icon: import('../components/icons.js').IconName; title: string; text: string }} HowItWorksStep
 */
function howItWorks() {
  /** @type {HowItWorksStep[]} */
  const steps = [
    {
      icon: 'send',
      title: 'Submit your request',
      text: 'Complete the short form with a preferred date and time.',
    },
    {
      icon: 'phone',
      title: 'Clinic contacts you',
      text: 'The clinic calls you to confirm the details of your appointment.',
    },
    {
      icon: 'check',
      title: 'Visit confirmed',
      text: 'Once confirmed, visit the clinic at the agreed time.',
    },
  ];

  const list = steps
    .map(
      (s, i) =>
        `<li class="step">` +
        `<span class="step__num" aria-hidden="true">${i + 1}</span>` +
        `<div class="step__icon" aria-hidden="true">${icon(s.icon, { size: 20 })}</div>` +
        `<h3 class="step__title">${s.title}</h3>` +
        `<p class="step__text">${s.text}</p>` +
        `</li>`,
    )
    .join('\n');
  return `<ol class="steps">${list}</ol>`;
}

function body() {
  const serviceNote =
    clinic.services.length === 0
      ? `<p class="text-note">The online form accepts appointment requests for any visit. If you would like a particular service, mention it in the reason field or call the clinic to confirm availability.</p>`
      : '';

  return (
    pageHero({
      eyebrow: 'Appointments',
      title: 'Book an Appointment',
      lede: `Submit a request and the clinic will contact you to confirm.`,
    }) +
    `<div class="section"><div class="container">${emergencyNotice()}</div></div>` +
    openSection({ className: 'section--soft' }) +
    `<div class="container">` +
    `<div class="appointment-layout">` +
    `<div class="appointment-layout__form">` +
    appointmentForm() +
    serviceNote +
    `</div>` +
    `<div class="appointment-layout__side">` +
    `<div class="side-card">` +
    `<h3 class="side-card__title">How appointment requests work</h3>` +
    howItWorks() +
    `<p class="side-card__note">An online request is not an automatic confirmation. The clinic always contacts you to confirm before your visit.</p>` +
    `</div>` +
    `<div class="side-card">` +
    `<h3 class="side-card__title">Prefer to book by phone?</h3>` +
    `<p class="side-card__text">Call ${clinic.phone.display} and the clinic will help you directly.</p>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    closeSection() +
    `<div class="section"><div class="container container--narrow">` +
    medicalDisclaimer() +
    `</div></div>`
  );
}

export function render() {
  return renderPage({
    path: '/appointment',
    title: 'Book an Appointment | Samasi Rangitatu Polyclinic',
    description: DESCRIPTION,
    active: '',
    body: body(),
  });
}