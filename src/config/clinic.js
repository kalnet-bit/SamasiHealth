// @ts-check
/**
 * ============================================================================
 * SAMASI RANGITATU POLYCLINIC — WEBSITE CONFIGURATION
 * ============================================================================
 * This is the single source of truth for clinic information used across the
 * website. Update values in this file to change the site — no redesign or
 * code edits elsewhere are required.
 *
 * HONESTY RULE: never add anything that has not been confirmed by the clinic
 * or an official source. Every piece of information carries a verification
 * status and a source (see `contentSources` and `verificationStatus`).
 * Unconfirmed fields stay null / [] and the site shows an honest state.
 * ============================================================================
 */

/**
 * @typedef {object} Address
 * @property {string} street
 * @property {string} city
 * @property {string} country
 * @property {string} district    Administrative district from the official record (e.g. Temeke).
 * @property {string} [postcode]  Postal code from a public address directory (source noted).
 */

/**
 * @typedef {object} Hours
 * @property {string} display   Short human-readable line shown in the top bar.
 * @property {string} source    Where the displayed hours came from.
 * @property {boolean} verified Whether the clinic confirmed these hours.
 */

/**
 * Verification status for every piece of site content.
 * - VERIFIED:                   confirmed by the clinic directly.
 * - SOCIAL-MEDIA-VERIFIED:      taken from the clinic's own public social channels.
 * - OFFICIAL-RECORD-VERIFIED:   taken from an official national/public record.
 * - NEEDS-CLINIC-CONFIRMATION:  plausible but awaiting clinic confirmation.
 * - NOT-VERIFIED:               shown with an explicit "please confirm" note.
 * @typedef {'VERIFIED'|'SOCIAL-MEDIA-VERIFIED'|'OFFICIAL-RECORD-VERIFIED'|'NEEDS-CLINIC-CONFIRMATION'|'NOT-VERIFIED'} VerificationStatus
 */

/**
 * @typedef {object} ContentSource
 * @property {string} name
 * @property {string} url
 * @property {VerificationStatus} defaultStatus
 */

/**
 * @typedef {object} Service
 * @property {string} slug            URL-safe identifier (used in /services/:slug).
 * @property {string} name            Public service name.
 * @property {string} summary         One-to-two line summary for cards (not a clinical guarantee).
 * @property {import('../components/icons.js').IconName} icon  Icon key (see components/icons.js).
 * @property {boolean} bookable       Whether appointment requests can be made for it online.
 * @property {string} [description]   Long description for the detail page.
 * @property {string[]} [included]    Items the official record lists under this service.
 * @property {string[]} [eligibility] Who the service is suitable for.
 * @property {string[]} [preparation] What a patient should do before visiting.
 * @property {string} [duration]      Typical appointment duration.
 * @property {string} [price]         Add ONLY when the clinic authorises public pricing.
 * @property {VerificationStatus} [verificationStatus]  See typedef above.
 * @property {string} [source]        Where the service information came from.
 */

/**
 * @typedef {object} FaqCategory
 * @property {'LOCATION'|'CONTACT'|'APPOINTMENTS'|'HOURS'|'SERVICES'|'GENERAL_OPERATIONS'} id
 * @property {string} label
 * @property {FaqItem[]} items
 */

/**
 * @typedef {object} FaqItem
 * @property {string} q
 * @property {string} a
 */

/**
 * @typedef {object} Reason
 * @property {import('../components/icons.js').IconName} icon
 * @property {string} title
 * @property {string} text
 */

/**
 * @typedef {object} FormsConfig
 * @property {string|null} appointmentEndpoint Endpoint that accepts the appointment request as JSON.
 * @property {string|null} contactEndpoint     Endpoint that accepts the contact message as JSON.
 */

/** The clinic telephone line, used in multiple places. */
const PHONE = {
  display: '0716 324 331',
  // Converted carefully to international format for tel: links (Tanzania +255, leading 0 dropped).
  international: '+255 716 324 331',
  telHref: 'tel:+255716324331',
};

/**
 * Verified sources. Official national record first; public directories and the
 * supplied Google listing are secondary corroboration.
 * @type {Record<string, ContentSource>}
 */
export const contentSources = {
  moh: {
    name: 'Ministry of Health (Tanzania) – Health Facility Registry, facility code 100164-3',
    url: 'https://hfrportal.moh.go.tz/web/index.php?facility_code=100164-3&r=portal%2Fpdf-facility-detail',
    defaultStatus: 'OFFICIAL-RECORD-VERIFIED',
  },
  googleListing: {
    name: 'Public Google listing (supplied by the client)',
    url: 'https://www.google.com/maps/search/?api=1&query=Charambe+Street,+Dar+es+Salaam,+Tanzania',
    defaultStatus: 'NEEDS-CLINIC-CONFIRMATION',
  },
  directory: {
    name: 'Public directory listing (medpages.info / tanzaniapostcode.com)',
    url: 'https://www.tanzaniapostcode.com/location/rangi-tatu',
    defaultStatus: 'NEEDS-CLINIC-CONFIRMATION',
  },
};

/**
 * Normative clinic identity. Only fields corroborated by the official
 * facility record or the supplied listing are populated.
 */
export const facilityRecord = {
  code: '100164-3',
  registeredName: 'SAMASI RANGITATU',
  commonName: 'Arafa Samasi',
  type: 'PolyClinic',
  ownership: 'Private, For Profit: SAMASI HEALTH LIMITED',
  opened: '2018-07-16',
  status: 'Operating',
  district: 'Temeke',
  addressLine: 'Temeke District, Dar es Salaam Region',
  source: contentSources.moh.name,
  verifiedAt: new Date().toISOString().slice(0, 10),
};

export const clinic = {
  name: 'Samasi Rangitatu Polyclinic',
  shortName: 'Samasi Polyclinic',
  tagline: 'Quality Healthcare, Close to You',
  // Website positioning statement — not a confirmed official slogan.

  phone: PHONE,

  address: {
    street: 'Charambe Street',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    district: facilityRecord.district,
    postcode: '15117', // Rangi Tatu, Charambe ward — from the public postcode directory.
  },

  hours: {
    // From the supplied public Google listing. Shown to patients with a note
    // that hours should be confirmed with the clinic; not a verified guarantee.
    display: 'Open · closes 10 PM',
    source: 'Google listing (supplied)',
    verified: false,
  },

  rating: {
    score: 5.0,
    count: 2,
    source: 'Google listing (supplied)',
  },

  // Public URLs the clinic must confirm/own. null hides the related UI.
  directionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Charambe+Street,+Dar+es+Salaam,+Tanzania',
  googleReviewsUrl: null,
  siteUrl: '', // e.g. 'https://samasi.example.com' — enables canonicals, sitemap, OG tags.
  logo: null, // official logo file (e.g. 'img/logo.png' relative to dist); null = text brand.
  logoUrl: 'https://samasi.example.com/logo.png', // absolute URL for structured data only when logo set.
  heroImage: null, // real clinic photograph when supplied.

  // Social links — only add official accounts verified by the clinic.
  social: /** @type {Record<string,string>} */ ({}),

  // http(s) URLs the QA script allows in rendered pages (Google Fonts + maps search).
  allowedExternal: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google.com/maps/search/',
    'https://schema.org',
  ],

  /**
   * SERVICE LIST — sourced from Tanzania's national health facility record
   * (facility code 100164-3). Each service is marked OFFICIAL-RECORD-VERIFIED;
   * actual availability and pricing must still be confirmed with the clinic.
   * The build generates:
   *   /services             (index of all services)
   *   /services/:slug       (per-service detail page)
   * @type {Service[]}
   */
  services: [
    {
      slug: 'opd',
      name: 'OPD · Outpatient Services',
      summary: 'General outpatient consultations for routine medical care at the clinic.',
      icon: 'stethoscope',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'The clinic\u2019s national health facility record lists general clinical services, including OPD (outpatient) consultations. Call the clinic to confirm current opening times and whether a prior appointment is preferred.',
      included: ['Outpatient (OPD) consultations'],
    },
    {
      slug: 'malaria',
      name: 'Malaria Diagnosis & Treatment',
      summary: 'Diagnosis and first-line treatment for malaria, including rapid testing and microscopy.',
      icon: 'droplet',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Malaria diagnosis and treatment is listed in the clinic\u2019s national facility record. It includes first-line treatment, rapid diagnostic testing (mRDT), slide microscopy and treatment of complicated or severe malaria.',
      included: [
        'First-line treatment',
        'mRDT – rapid diagnostic testing',
        'Slide microscopy',
        'Treatment of complicated malaria',
      ],
    },
    {
      slug: 'hiv-prevention',
      name: 'HIV/AIDS Prevention Services',
      summary: 'HIV testing and counselling, including programmes to prevent mother-to-child transmission.',
      icon: 'shield-check',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'HIV and AIDS prevention services in the national record include provider-initiated testing and counselling (PITC), prevention of mother-to-child transmission (PMTCT) under antenatal care, and voluntary counselling and testing (VCT).',
      included: [
        'PITC – provider-initiated testing and counselling',
        'PMTCT – prevention of mother-to-child transmission (with ANC)',
        'VCT – voluntary counselling and testing',
      ],
    },
    {
      slug: 'anc-pmtct',
      name: 'ANC / PMTCT',
      summary: 'Antenatal care with prevention of mother-to-child transmission of HIV.',
      icon: 'heart',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'The clinic\u2019s national record lists antenatal care (ANC) combined with PMTCT services — screening and support to prevent mother-to-child transmission of HIV during and after pregnancy.',
      included: ['Antenatal care (ANC) with PMTCT'],
    },
    {
      slug: 'laboratory',
      name: 'Laboratory Services',
      summary: 'On-site laboratory testing across clinical chemistry, haematology and serology.',
      icon: 'flask',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Laboratory services are listed in the clinic\u2019s national record, spanning clinical chemistry, haematology and blood transfusion, and serology. Contact the clinic to confirm which tests are available on a given day and how to prepare.',
      included: [
        'Blood sugar / glucose test (POCT)',
        'Lipid profile test',
        'Liver function tests',
        'UPT (pregnancy) test',
        'Urine chemistry',
        'ABO blood grouping',
        'Full blood picture',
        'Sickle cell screening test',
        'Rapid tests (dengue, Hepatitis B, HIV)',
        'HIV viral load',
        'Hormonal tests',
        'RPR/VDRL rapid test',
      ],
    },
    {
      slug: 'radiology',
      name: 'Radiology Services',
      summary: 'Diagnostic imaging services for patients — contact the clinic to confirm availability.',
      icon: 'scan',
      bookable: false,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Radiology services are listed in the clinic\u2019s national facility record. Please contact the clinic to confirm which imaging services are currently available and any preparation required.',
    },
    {
      slug: 'family-planning',
      name: 'Family Planning',
      summary: 'Family planning services and counselling under reproductive and child health care.',
      icon: 'users',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Family planning is listed under reproductive and child health care in the clinic\u2019s national record. Contact the clinic to confirm which family planning services are currently offered.',
    },
    {
      slug: 'emergency-dental',
      name: 'Emergency Dental Services',
      summary: 'Emergency dental treatment for urgent oral health concerns.',
      icon: 'tooth',
      bookable: false,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Emergency dental services are listed under oral health services in the clinic\u2019s national record. For urgent dental concerns, contact the clinic directly by phone.',
      included: ['Emergency dental treatment'],
    },
    {
      slug: 'vaccination',
      name: 'Vaccination',
      summary: 'Vaccination services for patients — contact the clinic to confirm current availability.',
      icon: 'syringe',
      bookable: false,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Vaccination services are listed in the clinic\u2019s national facility record. Contact the clinic to confirm which vaccines are currently available and whether an appointment is required.',
    },
    {
      slug: 'nutritional-counselling',
      name: 'Nutritional Counselling',
      summary: 'Nutritional counselling to support everyday health and wellbeing.',
      icon: 'leaf',
      bookable: true,
      verificationStatus: 'OFFICIAL-RECORD-VERIFIED',
      source: contentSources.moh.name,
      description:
        'Nutritional counselling is listed in the clinic\u2019s national facility record. Bookings and service details can be confirmed with the clinic directly.',
    },
  ],

  /**
   * OPERATIONAL FAQs ONLY — no unverified medical advice. Categorised per the
   * site content model. Answers are limited to what is confirmed or clearly
   * flagged for confirmation.
   * @type {FaqCategory[]}
   */
  faqCategories: [
    {
      id: 'LOCATION',
      label: 'Location',
      items: [
        {
          q: 'Where exactly is the clinic?',
          a: 'Samasi Rangitatu Polyclinic is located on Charambe Street (Rangi Tatu), Dar es Salaam, Tanzania. The national facility record places the clinic in Temeke District.',
        },
        {
          q: 'How do I get to the clinic?',
          a: 'Use the "Get Directions" link on this website or search for Charambe Street, Dar es Salaam in your maps app.',
        },
      ],
    },
    {
      id: 'CONTACT',
      label: 'Contact',
      items: [
        {
          q: 'How can I contact the clinic?',
          a: 'You can call the clinic using the phone number shown on this website. Calling is the quickest way to confirm services and availability.',
        },
        {
          q: 'Is the phone number on this website current?',
          a: 'The number shown matches the clinic\u2019s official national facility record. If you cannot reach the clinic, please let us know through the contact page.',
        },
      ],
    },
    {
      id: 'APPOINTMENTS',
      label: 'Appointments',
      items: [
        {
          q: 'Can I request an appointment online?',
          a: 'Yes. You can submit an appointment request through this website. Requests are received by the clinic and are subject to confirmation — the clinic will contact you to confirm before your visit.',
        },
        {
          q: 'Does an online request automatically confirm my appointment?',
          a: 'No. An online request is not an automatic confirmation. The clinic always contacts you to confirm the date, time and service before your visit.',
        },
      ],
    },
    {
      id: 'HOURS',
      label: 'Hours',
      items: [
        {
          q: 'What are the clinic\u2019s opening hours?',
          a: 'Based on the public Google listing, the clinic is open and typically closes at 10 PM. Hours may change, so please call the clinic to confirm before visiting.',
        },
      ],
    },
    {
      id: 'SERVICES',
      label: 'Services',
      items: [
        {
          q: 'What services are available?',
          a: 'The clinic\u2019s national health facility record (code 100164-3) lists outpatient care, malaria diagnosis and treatment, HIV testing and counselling, antenatal care with PMTCT, laboratory and radiology services, family planning, emergency dental services, vaccination and nutritional counselling. Please contact the clinic to confirm current availability.',
        },
      ],
    },
    {
      id: 'GENERAL_OPERATIONS',
      label: 'General & operations',
      items: [
        {
          q: 'Is the clinic a registered facility?',
          a: 'Yes. The clinic is listed in Tanzania\u2019s national health facility record under the name Samasi Rangitatu (facility code 100164-3), operating since July 2018 as a private polyclinic.',
        },
        {
          q: 'Does this website handle emergencies?',
          a: 'No. This website is for information and appointment requests. If you have a medical emergency, seek appropriate emergency medical assistance rather than relying on this website or its forms.',
        },
      ],
    },
  ],

  /** @type {Reason[]} Website/service principles — not claims about outcomes. */
  whyChooseUs: [
    {
      icon: 'heart',
      title: 'Patient-focused experience',
      text: 'Designed around clear communication and easy access for every patient.',
    },
    {
      icon: 'map-pin',
      title: 'Convenient location',
      text: 'Located on Charambe Street, Dar es Salaam — easy to reach and simple to find.',
    },
    {
      icon: 'phone',
      title: 'Easy communication',
      text: 'A direct phone contact is available, so patients can speak to the clinic directly.',
    },
    {
      icon: 'shield',
      title: 'Registered facility',
      text: `Listed in the national health facility record (code ${facilityRecord.code}), operating since 2018.`,
    },
  ],

  // What to bring on a first visit — confirm with the clinic before publishing.
  /** @type {string[]} */
  patientChecklist: [],

  forms: /** @type {FormsConfig} */ {
    appointmentEndpoint: '/api/appointments',
    contactEndpoint: null, // e.g. '/api/contact' — not connected yet; the contact form shows the honest "call us" state.
  },
};

/** @typedef {typeof clinic} ClinicConfig */

/** @typedef {import('../components/icons.js').IconName} IconName */