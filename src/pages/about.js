// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { whyChooseUs } from '../components/whychooseus.js';
import { openSection, closeSection, ctaBand } from '../components/section.js';
import { medicalDisclaimer } from '../components/notices.js';
import { clinic, facilityRecord, contentSources } from '../config/clinic.js';

const DESCRIPTION =
  'About Samasi Rangitatu Polyclinic — a private healthcare facility on Charambe Street, Dar es Salaam, Tanzania.';

function body() {
  return (
    pageHero({
      eyebrow: 'About the Clinic',
      title: 'About ' + clinic.shortName,
      lede: `Private healthcare, presented clearly — where the clinic is, how to reach it, and how to request a visit.`,
    }) +
    openSection() +
    `<div class="container container--narrow">` +
    `<div class="prose">` +
    `<h2>${clinic.name}</h2>` +
    `<p>${clinic.name} is presented as a private healthcare facility located on Charambe Street in Dar es Salaam, Tanzania.</p>` +
    `<p>This website is built around the essentials patients care about most: how to find the clinic, how to contact it, and how to request an appointment.</p>` +
    `<h3>Patient convenience</h3>` +
    `<p>The clinic can be reached directly by phone, and patients can submit an appointment request online from one convenient place.</p>` +
    `<p class="text-note">Detailed information about the clinic's history, staff, departments and equipment will be added as it is confirmed by the clinic. Until then, please contact the clinic directly.</p>` +
    `</div>` +
    `<div class="spacer"></div>` +
    `<div class="prose">` +
    `<h2>Registered facility</h2>` +
    `<p>The clinic is registered in Tanzania's national health facility registry, so the facility can be verified independently:</p>` +
    `<dl class="fact-list">` +
    `<div class="fact-row"><dt>Registry name</dt><dd>${facilityRecord.registeredName} Polyclinic</dd></div>` +
    `<div class="fact-row"><dt>Facility code</dt><dd>${facilityRecord.code}</dd></div>` +
    `<div class="fact-row"><dt>Type</dt><dd>${facilityRecord.type}</dd></div>` +
    `<div class="fact-row"><dt>Ownership</dt><dd>${facilityRecord.ownership}</dd></div>` +
    `<div class="fact-row"><dt>Operating since</dt><dd>${facilityRecord.opened}</dd></div>` +
    `<div class="fact-row"><dt>District</dt><dd>${facilityRecord.district}</dd></div>` +
    `</dl>` +
    `<p class="text-note">Source: ${facilityRecord.source}.<br/><a href="${contentSources.moh.url}" rel="noopener" target="_blank">View the facility record</a></p>` +
    `</div>` +
    `<div class="spacer"></div>` +
    whyChooseUs() +
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
    path: '/about',
    title: 'About | Samasi Rangitatu Polyclinic',
    description: DESCRIPTION,
    active: 'about',
    body: body(),
  });
}