// @ts-check
import { renderPage, faqPageLd } from '../layout/page.js';
import { hero } from '../components/hero.js';
import { quickActions } from '../components/quickactions.js';
import { servicesSection } from '../components/services.js';
import { whyChooseUs } from '../components/whychooseus.js';
import { openSection, closeSection, sectionHeading, ctaBand } from '../components/section.js';
import { reviewsSection } from '../components/reviews.js';
import { locationSection } from '../components/location.js';
import { faqSection } from '../components/faq.js';
import { medicalDisclaimer } from '../components/notices.js';
import { clinic } from '../config/clinic.js';

const DESCRIPTION =
  'Samasi Rangitatu Polyclinic is a private healthcare facility on Charambe Street, Dar es Salaam. Contact the clinic or request an appointment online.';

function aboutHomePreview() {
  return (
    openSection({ id: 'about', className: 'section--about' }) +
    `<div class="container">` +
    `<div class="about-grid">` +
    `<div class="about-copy">` +
    sectionHeading({
      eyebrow: 'About',
      title: 'About ' + clinic.shortName,
      align: 'left',
      lede: `A private polyclinic on Charambe Street, carefully presented so patients always know where to find the clinic, how to reach it, and how to request a visit.`,
    }) +
    `<p class="about-text">${clinic.name} is a private healthcare facility located on Charambe Street in Dar es Salaam, Tanzania. The clinic focuses on being easy to reach, easy to communicate with, and convenient for every patient.</p>` +
    `<a class="btn btn--outline" href="/about">Learn more about the clinic</a>` +
    `</div>` +
    `<div class="about-fact">` +
    `<dl class="fact-list">` +
    `<div class="fact-row"><dt>Location</dt><dd>${clinic.address.street}, ${clinic.address.city}</dd></div>` +
    `<div class="fact-row"><dt>Phone</dt><dd><a href="${clinic.phone.telHref}">${clinic.phone.display}</a></dd></div>` +
    `<div class="fact-row"><dt>Hours</dt><dd>${clinic.hours.display}</dd></div>` +
    `<div class="fact-row"><dt>Type</dt><dd>Private polyclinic</dd></div>` +
    `</dl>` +
    `<p class="text-note">Details based on the supplied Google listing. Please contact the clinic to confirm.</p>` +
    `</div>` +
    `</div>` +
    `</div>` +
    closeSection()
  );
}

function homeBody() {
  return (
    hero() +
    quickActions() +
    aboutHomePreview() +
    servicesSection() +
    whyChooseUsSection() +
    ctaBand({
      title: 'Ready when you are',
      text: 'Book at your convenience. Submit an appointment request online and the clinic will contact you to confirm.',
    }) +
    faqSectionBlock() +
    reviewsSection() +
    locationSection() +
    `<div class="section">` +
    `<div class="container">` +
    medicalDisclaimer() +
    `</div></div>`
  );
}

function whyChooseUsSection() {
  return (
    openSection({ className: 'section--soft' }) +
    `<div class="container">` +
    whyChooseUs() +
    `</div>` +
    closeSection()
  );
}

function faqSectionBlock() {
  return (
    openSection({ id: 'faq' }) +
    `<div class="container">` +
    sectionHeading({
      eyebrow: 'Help',
      title: 'Patient FAQs',
      lede: 'Quick answers to common questions.',
    }) +
    faqSection() +
    `<p class="section-actions"><a class="btn btn--outline" href="/patients">Patient information</a></p>` +
    `</div>` +
    closeSection()
  );
}

export function render() {
  return renderPage({
    path: '/',
    title: 'Samasi Rangitatu Polyclinic | Private Healthcare in Dar es Salaam',
    description: DESCRIPTION,
    active: 'home',
    extraLd: [faqPageLd()],
    body: homeBody(),
  });
}