// @ts-check
import { renderPage, faqPageLd } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { patientInfo } from '../components/patientinfo.js';
import { faqSection } from '../components/faq.js';
import { openSection, closeSection, sectionHeading, ctaBand } from '../components/section.js';
import { emergencyNotice, medicalDisclaimer } from '../components/notices.js';

const DESCRIPTION =
  'Patient information for Samasi Rangitatu Polyclinic, Dar es Salaam — what to bring, appointment requests, contact and location.';

function body() {
  return (
    pageHero({
      eyebrow: 'Patients',
      title: 'Before Your Visit',
      lede: `General information to help you prepare. Medical instructions are only provided by the clinic.`,
    }) +
    `<div class="section"><div class="container">${emergencyNotice()}</div></div>` +
    openSection() +
    `<div class="container">` +
    `<div class="stack">` +
    patientInfo() +
    `</div>` +
    `</div>` +
    closeSection() +
    openSection({ className: 'section--soft' }) +
    `<div class="container">` +
    sectionHeading({
      eyebrow: 'Help',
      title: 'Patient Questions',
      lede: 'Frequently asked operational questions.',
    }) +
    faqSection() +
    `</div>` +
    closeSection() +
    ctaBand() +
    `<div class="section"><div class="container container--narrow">` +
    medicalDisclaimer() +
    `</div></div>`
  );
}

export function render() {
  return renderPage({
    path: '/patients',
    title: 'Patient Information | Samasi Rangitatu Polyclinic',
    description: DESCRIPTION,
    active: 'patients',
    extraLd: [faqPageLd()],
    body: body(),
  });
}