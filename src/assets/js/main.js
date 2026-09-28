// @ts-check
/**
 * Runtime behaviour for the Samasi Rangitatu Polyclinic site.
 * Menu, scroll reveals, and form handling with honest loading/success/error states.
 */

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Accessible mobile menu toggle.
 */
function initMenu() {
  const toggle = /** @type {HTMLElement | null} */ (document.querySelector('[data-menu-toggle]'));
  const menu = /** @type {HTMLElement | null} */ (document.querySelector('[data-mobile-menu]'));
  const icon = /** @type {HTMLElement | null} */ (document.querySelector('[data-menu-icon]'));
  if (!toggle || !menu || !icon) return;

  /**
   * @param {boolean} open
   */
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) menu.hidden = false;
    menu.hidden = !open;
    icon.innerHTML = open ? iconsClose() : iconsMenu();
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  menu.addEventListener('click', (e) => {
    if (/** @type {HTMLElement} */ (e.target).closest('a')) setOpen(false);
  });
}

/**
 * Soft section reveal — honours prefers-reduced-motion.
 */
function initReveal() {
  if (reducedMotion()) return;
  const targets = document.querySelectorAll(
    '.section > .container, .hero__copy, .quick-actions__grid, .services-grid, .values-grid, .reviews-grid, .faq-list, .patient-info, .contact-layout, .appointment-layout',
  );
  if (!('IntersectionObserver' in window)) return;
  targets.forEach((t) => t.classList.add('reveal'));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  targets.forEach((t) => io.observe(t));
}

/**
 * Form handling: validation, honeypot, and submit states
 * (loading / success / error / not-connected).
 */
function initForms() {
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formEl = /** @type {HTMLFormElement} */ (form);
      const statusEl = /** @type {HTMLElement | null} */ (formEl.querySelector('[data-form-status]'));
      const submitBtn = /** @type {HTMLButtonElement | null} */ (formEl.querySelector('[data-form-submit]'));
      if (!statusEl || !submitBtn) return;
      const status = statusEl;

      clearErrors(formEl);

      // Honeypot: bots fill the hidden "company" field. Silently pretend-ok.
      const hp = /** @type {HTMLInputElement | null} */ (formEl.querySelector('input[name="company"]'));
      if (hp && hp.value) {
        renderStatus(status, 'ok', 'Thank you. Your request has been received.');
        formEl.reset();
        return;
      }

      const valid = validate(formEl);
      if (!valid) {
        renderStatus(
          status,
          'error',
          'Please review the highlighted fields and try again.',
        );
        const firstInvalid = formEl.querySelector('.is-invalid');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      const endpoint = formEl.getAttribute('data-endpoint');

      // Not connected yet — honest state, never a fake "confirmed".
      if (!endpoint || endpoint === 'off') {
        renderStatus(
          status,
          'unavailable',
          `Online submission is not connected yet. Please call <a href="tel:+255716324331">0716 324 331</a> to book an appointment or ask a question.`,
        );
        if (status instanceof HTMLElement) status.focus();
        return;
      }

      submitBtn.setAttribute('aria-busy', 'true');
      setButtonLoading(submitBtn, true);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload(formEl)),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        })
        .then((data) => {
          setButtonLoading(submitBtn, false);
          formEl.reset();
          const title = formEl.getAttribute('data-success-title') || 'Request Received';
          const text = formEl.getAttribute('data-success-text') || 'The clinic will contact you to confirm.';
          const reference =
            data && typeof data.reference === 'string' ? `<br/><span class="status__ref">Your reference: ${data.reference}</span>` : '';
          renderStatus(status, 'ok', `<strong>${title}</strong><br/>${text}${reference}`);
          if (status instanceof HTMLElement) status.focus();
        })
        .catch(() => {
          setButtonLoading(submitBtn, false);
          renderStatus(
            status,
            'error',
            `We couldn't send your request. Please try again or call <a href="tel:+255716324331">0716 324 331</a>.`,
          );
          if (status instanceof HTMLElement) status.focus();
        });
    });

    form.querySelectorAll('input, textarea, select').forEach((el) => {
      el.addEventListener('input', () => {
        const t = /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */ (el);
        if (t.classList.contains('is-invalid')) {
          t.classList.remove('is-invalid');
          const err = t.getAttribute('aria-describedby');
          if (err) {
            const errEl = document.getElementById(err);
            if (errEl) errEl.textContent = '';
          }
        }
      });
    });
  });
}

/**
 * Validate a form, painting inline error messages.
 * @param {HTMLFormElement} form
 * @returns {boolean} whether the form is valid
 */
function validate(form) {
  let ok = true;
  form.querySelectorAll('input, textarea, select').forEach((el) => {
    const t = /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */ (el);
    if (t.classList.contains('hp-field')) return;

    const isCheckbox = t instanceof HTMLInputElement && t.type === 'checkbox';
    const value = isCheckbox
      ? (/** @type {HTMLInputElement} */ (t).checked ? 'on' : '')
      : t.value;
    let message = '';

    if (t.required && !value.trim()) {
      message = 'This field is required.';
    } else if (t instanceof HTMLInputElement && t.type === 'tel' && !PHONE_PATTERN.test(value.trim())) {
      message = 'Please enter a valid phone number.';
    } else if (t instanceof HTMLInputElement && t.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = 'Please enter a valid email address.';
    } else if (isCheckbox && t.required && !(/** @type {HTMLInputElement} */ (t).checked)) {
      message = 'Please confirm to continue.';
    } else if ('maxLength' in t && t.maxLength > 0 && t.value.length > t.maxLength) {
      message = `Please keep this under ${t.maxLength} characters.`;
    }

    if (message) {
      ok = false;
      t.classList.add('is-invalid');
      t.setAttribute('aria-invalid', 'true');
      const err = document.getElementById(`${t.id}-error`);
      if (err) err.textContent = message;
      else if (t instanceof HTMLInputElement) t.setCustomValidity(message);
    } else {
      t.removeAttribute('aria-invalid');
      if (t instanceof HTMLInputElement) t.setCustomValidity('');
      if (t instanceof HTMLSelectElement) t.setCustomValidity('');
      if (t instanceof HTMLTextAreaElement) t.setCustomValidity('');
    }
  });
  return ok && form.checkValidity();
}

/**
 * @param {HTMLFormElement} form
 * @returns {Record<string, string | boolean>}
 */
function formPayload(form) {
  const data = /** @type {Record<string, string | boolean>} */ ({});
  form.querySelectorAll('input[name], textarea[name], select[name]').forEach((el) => {
    const t = /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */ (el);
    if (t.classList.contains('hp-field')) return;
    if (t instanceof HTMLInputElement && t.type === 'checkbox') {
      data[t.name] = t.checked;
    } else {
      data[t.name] = t.value.trim();
    }
  });
  return data;
}

/**
 * @param {HTMLButtonElement} btn
 * @param {boolean} loading
 */
function setButtonLoading(btn, loading) {
  const original = btn.textContent || btn.getAttribute('data-label') || 'Submit';
  if (loading) {
    btn.setAttribute('data-label', original);
    btn.textContent = 'Sending\u2026';
    btn.disabled = true;
  } else {
    btn.textContent = btn.getAttribute('data-label') || original;
    btn.disabled = false;
  }
}

/**
 * @param {HTMLElement} status
 * @param {string} kind
 * @param {string} html
 */
function renderStatus(status, kind, html) {
  status.className = `clinic-form__status status--${kind}`;
  status.innerHTML = html;
  status.removeAttribute('hidden');
  status.setAttribute('tabindex', '-1');
}

/**
 * @param {HTMLFormElement} form
 */
function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach((el) => {
    el.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
    const id = el.getAttribute('id');
    if (id) {
      const err = document.getElementById(`${id}-error`);
      if (err) err.textContent = '';
    }
  });
}

function iconsMenu() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
}
function iconsClose() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
}

/** Success/error title+text stored on form for endpoint mode. */
function tagForms() {
  document.querySelectorAll('[data-form]').forEach((form) => {
    const id = form.getAttribute('id');
    if (id === 'appointment-form') {
      form.setAttribute('data-success-title', 'Appointment Request Received');
      form.setAttribute('data-success-text', 'The clinic will contact you to confirm your appointment.');
    }
    if (id === 'contact-form') {
      form.setAttribute('data-success-title', 'Message Received');
      form.setAttribute('data-success-text', 'Thank you. The clinic will respond to your enquiry.');
    }
  });
}

/** Set sensible min date on date inputs (appointment form). */
function initDateMin() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  document.querySelectorAll('input[type="date"]').forEach((el) => {
    if (!el.getAttribute('min')) el.setAttribute('min', iso);
  });
}

function init() {
  initMenu();
  initReveal();
  initForms();
  tagForms();
  initDateMin();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}