// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { reviewsSection } from '../components/reviews.js';
import { openSection, closeSection } from '../components/section.js';
import { medicalDisclaimer } from '../components/notices.js';
import { clinic } from '../config/clinic.js';

const DESCRIPTION =
  'Patient reviews for Samasi Rangitatu Polyclinic, Dar es Salaam — rating shown on the supplied Google listing.';

function body() {
  return (
    pageHero({
      eyebrow: 'Reviews',
      title: 'Patient Reviews',
      lede: `What the Google listing currently shows for ${clinic.shortName}.`,
    }) +
    openSection() +
    `<div class="container">` +
    reviewsSection({ full: true }) +
    `<p class="text-note text-note--center">Ratings change over time. Please confirm current reviews through the clinic's Google listing. Individual testimonials are only published with confirmation or patient permission.</p>` +
    `</div>` +
    closeSection() +
    `<div class="section"><div class="container container--narrow">` +
    medicalDisclaimer() +
    `</div></div>`
  );
}

export function render() {
  return renderPage({
    path: '/reviews',
    title: 'Reviews | Samasi Rangitatu Polyclinic',
    description: DESCRIPTION,
    active: 'reviews',
    body: body(),
  });
}