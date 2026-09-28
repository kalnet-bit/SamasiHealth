// @ts-check
import { renderPage } from '../layout/page.js';
import { clinic } from '../config/clinic.js';

export function render() {
  const body =
    `<section class="page-hero">` +
    `<div class="container page-hero__inner">` +
    `<p class="eyebrow eyebrow--light">Page not found</p>` +
    `<h1 class="page-hero__title">We couldn't find that page</h1>` +
    `<p class="page-hero__lede">The page you are looking for may have moved. Use the navigation above or one of the quick links below.</p>` +
    `<div class="page-hero__actions">` +
    `<a class="btn btn--primary" href="/">Go to Homepage</a>` +
    `<a class="btn btn--inverse" href="/appointment">Book an Appointment</a>` +
    `<a class="btn btn--link-light" href="${clinic.phone.telHref}">Call ${clinic.phone.display}</a>` +
    `</div>` +
    `</div></section>`;

  return renderPage({
    path: '/404.html',
    title: 'Page Not Found | Samasi Rangitatu Polyclinic',
    description: 'The requested page could not be found on the Samasi Rangitatu Polyclinic website.',
    active: '',
    body,
  });
}