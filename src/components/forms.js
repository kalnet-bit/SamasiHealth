// @ts-check
import { clinic } from '../config/clinic.js';

/**
 * Minimal data-collection policy line under forms.
 * @returns {string}
 */
export function formPrivacyNote() {
  return (
    `<p class="form-note">The information you submit is used only to respond to your request and is not published. Please do not include sensitive medical details in this form.</p>`
  );
}

/**
 * Shared form skeleton with labelled fields, honeypot and aria-live status area.
 * @param {{ id: string; title: string; description: string; fields: string; submitLabel: string; extra?: string; endpointAttr: string; successTitle: string; successText: string }} p
 * @returns {string}
 */
function formShell(p) {
  return (
    `<form class="clinic-form" id="${p.id}" data-form novalidate ${p.endpointAttr}>` +
    `<input type="text" name="company" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />` +
    `<h3 class="clinic-form__title">${p.title}</h3>` +
    `<p class="clinic-form__desc">${p.description}</p>` +
    `<div class="clinic-form__fields">${p.fields}</div>` +
    (p.extra || '') +
    `<div class="clinic-form__status" data-form-status role="status" aria-live="polite"></div>` +
    `<button type="submit" class="btn btn--primary btn--block btn--lg" data-form-submit>${p.submitLabel}</button>` +
    formPrivacyNote() +
    `</form>`
  );
}

/**
 * Serialise an endpoint value into a data-endpoint attribute, or mark the
 * form as "off" (not yet connected). Uses typeof narrowing so the value is
 * always a real string before .replace().
 * @param {string | null} endpoint
 * @returns {string} the full attribute markup
 */
function endpointAttr(endpoint) {
  return typeof endpoint === 'string' && endpoint.length > 0
    ? ` data-endpoint="${endpoint.replace(/"/g, '&quot;')}"`
    : ' data-endpoint="off"';
}

/**
 * Appointment request form (§17). Fields per spec; requires consent.
 * @returns {string}
 */
export function appointmentForm() {
  const serviceField = clinic.services.length
    ? field(
        'select',
        {
          id: 'appointment-service',
          name: 'serviceId',
          label: 'Service (optional)',
          options: [
            { value: '', label: 'Not sure yet — contact me' },
            ...clinic.services.map((s) => ({ value: s.slug, label: s.name })),
          ],
        },
        'Only services confirmed by the clinic can be selected.',
      )
    : '';

  const fields =
    field('text', {
      id: 'appointment-name',
      name: 'patientName',
      label: 'Full name',
      required: true,
      autocomplete: 'name',
      placeholder: 'Enter your full name',
    }) +
    field('tel', {
      id: 'appointment-phone',
      name: 'phone',
      label: 'Phone number',
      required: true,
      autocomplete: 'tel',
      placeholder: 'e.g. 07xx xxx xxx',
      helper: 'The clinic will use this number to confirm your appointment.',
    }) +
    field('email', {
      id: 'appointment-email',
      name: 'email',
      label: 'Email (optional)',
      autocomplete: 'email',
      placeholder: 'you@example.com',
    }) +
    `<div class="field-row">` +
    field('date', {
      id: 'appointment-date',
      name: 'preferredDate',
      label: 'Preferred date',
      required: true,
    }) +
    field('time', {
      id: 'appointment-time',
      name: 'preferredTime',
      label: 'Preferred time',
      required: true,
    }) +
    `</div>` +
    serviceField +
    field('textarea', {
      id: 'appointment-reason',
      name: 'message',
      label: 'Short reason for visit (optional)',
      maxlength: 300,
      rows: 3,
      placeholder: 'A few words helps the clinic prepare for your visit.',
    });

  const consent =
    `<div class="field field--check">` +
    `<input type="checkbox" id="appointment-consent" name="consent" required />` +
    `<label for="appointment-consent">I understand that submitting this request does not confirm an appointment — the clinic will contact me to confirm it.</label>` +
    `</div>`;

  return formShell({
    id: 'appointment-form',
    title: 'Request an Appointment',
    description: 'Complete the form and the clinic will contact you to confirm your visit.',
    fields,
    extra: consent,
    submitLabel: 'Request Appointment',
    endpointAttr: endpointAttr(clinic.forms.appointmentEndpoint),
    successTitle: 'Appointment Request Received',
    successText: 'The clinic will contact you to confirm your appointment.',
  });
}

/**
 * General contact/enquiry form.
 * @returns {string}
 */
export function contactForm() {
  const fields =
    field('text', {
      id: 'contact-name',
      name: 'name',
      label: 'Name',
      required: true,
      autocomplete: 'name',
    }) +
    field('tel', {
      id: 'contact-phone',
      name: 'phone',
      label: 'Phone number',
      required: true,
      autocomplete: 'tel',
    }) +
    field('email', {
      id: 'contact-email',
      name: 'email',
      label: 'Email (optional)',
      autocomplete: 'email',
    }) +
    field('textarea', {
      id: 'contact-message',
      name: 'message',
      label: 'Message',
      required: true,
      rows: 5,
      maxlength: 1000,
      placeholder: 'How can we help you?',
    });

  return formShell({
    id: 'contact-form',
    title: 'Send a message',
    description: 'Ask a question or request a call back from the clinic.',
    fields,
    submitLabel: 'Send Message',
    endpointAttr: endpointAttr(clinic.forms.contactEndpoint),
    successTitle: 'Message Received',
    successText: 'Thank you. The clinic will respond to your enquiry.',
  });
}

/**
 * Single labelled field helper.
 * @param {'text'|'tel'|'email'|'date'|'time'|'textarea'|'select'} type
 * @param {any} p
 * @param {string} [helper] optional helper text shown under the control
 * @returns {string}
 */
function field(type, p, helper) {
  const id = /** @type {string} */ (p.id);
  const label = /** @type {string} */ (p.label);
  const required = !!p.required;
  const reqAttr = required ? ' required' : '';
  const maxAttr = p.maxlength ? ` maxlength="${p.maxlength}"` : '';
  const placeholderAttr = p.placeholder ? ` placeholder="${p.placeholder}"` : '';
  const autocompleteAttr = p.autocomplete ? ` autocomplete="${p.autocomplete}"` : '';
  const ariaReq = required ? ' aria-required="true"' : '';
  const hint = helper || p.helper ? `<p class="field__hint" id="${id}-hint">${helper || p.helper}</p>` : '';
  const name = /** @type {string} */ (p.name);
  let control;
  if (type === 'textarea') {
    control =
      `<textarea id="${id}" name="${name}" rows="${p.rows || 4}"${reqAttr}${maxAttr}${placeholderAttr}${ariaReq}${hint ? ` aria-describedby="${id}-hint"` : ''}></textarea>`;
  } else if (type === 'select') {
    const options = (/** @type {Array<{ value: string; label: string }>} */ (p.options) || [])
      .map((o) => `<option value="${o.value}">${o.label}</option>`)
      .join('');
    control = `<select id="${id}" name="${name}"${reqAttr}${hint ? ` aria-describedby="${id}-hint"` : ''}>${options}</select>`;
  } else {
    control =
      `<input type="${type}" id="${id}" name="${name}"${reqAttr}${maxAttr}${placeholderAttr}${autocompleteAttr}${ariaReq}${hint ? ` aria-describedby="${id}-hint"` : ''} />`;
  }

  return (
    `<div class="field">` +
    `<label class="field__label" for="${id}">${label}${required ? ' <span class="field__req" aria-hidden="true">*</span>' : ''}${required ? `<span class="visually-hidden"> (required)</span>` : ''}</label>` +
    control +
    `<span class="field__error" data-field-error id="${id}-error"></span>` +
    hint +
    `</div>`
  );
}