// @ts-check
/**
 * Inline SVG icon set. Stroke-based, inherits currentColor, no external deps.
 */

/** @typedef {'phone'|'map-pin'|'clock'|'calendar'|'check'|'star'|'menu'|'close'|'arrow-right'|'chevron-down'|'heart'|'cross'|'chat'|'user'|'shield'|'shield-check'|'info'|'alert'|'send'|'stethoscope'|'droplet'|'flask'|'scan'|'users'|'tooth'|'syringe'|'leaf'} IconName */

const PATHS = /** @type {Record<IconName, string>} */ ({
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'map-pin':
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock:
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  star:
    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'arrow-right':
    '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
  heart:
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  cross: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  chat:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user:
    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  shield:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'shield-check':
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  stethoscope:
    '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  flask:
    '<path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/>',
  scan: '<path d="M3 3v18h18V3z"/><path d="M3 9V3h6"/><path d="M9 21H3v-6"/>',
  users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  tooth:
    '<path d="M6 4c-1.8 0-3 1.9-3 4 0 1.3.5 2.7 1.3 4.4.7 1.5 1.2 3.3 1.2 5.1 0 1.8 1.3 2.2 2.2 2.2 1.1 0 1.7-.7 2-1.7.3-1 .5-2.4.5-3.5h4c0 1.1.2 2.5.5 3.5.3 1 .9 1.7 2 1.7.9 0 2.2-.4 2.2-2.2 0-1.8.5-3.6 1.2-5.1C20.5 10.7 21 9.3 21 8c0-2.1-1.2-4-3-4-2.1 0-3.2 1.6-6 1.6S8.1 4 6 4z"/>',
  syringe:
    '<path d="m18 2 4 4"/><path d="m18 6 2-2"/><path d="M6 15 15 6c.8-.8 2-.8 2.8 0l.2.2c.8.8.8 2 0 2.8L9 18"/><path d="m9 18-7 3 3-7"/><circle cx="6" cy="18" r="3"/>',
  leaf:
    '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  info:
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  alert:
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
});

/**
 * Render an inline SVG icon.
 * @param {IconName} name
 * @param {{ size?: number; className?: string; 'aria-hidden'?: string }} [opts]
 * @returns {string} SVG markup
 */
export function icon(name, opts = {}) {
  const { size = 24, className = '' } = opts;
  const cls = className ? ` class="${className}"` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"` +
    ` fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"` +
    ` aria-hidden="true"${cls}>` +
    PATHS[name] +
    `</svg>`
  );
}

/**
 * Brand mark: a soft rounded square with an abstract cross pulse.
 * Clearly website branding — replaced by the official logo when available.
 * @param {{ size?: number; className?: string }} [opts]
 * @returns {string}
 */
export function brandMark(opts = {}) {
  const { size = 40, className = '' } = opts;
  const cls = className ? ` class="${className}"` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"${cls}>` +
    `<rect x="4" y="4" width="40" height="40" rx="12" fill="#0b4f6c"/>` +
    `<circle cx="33" cy="15" r="6" fill="none" stroke="#78c7cd" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>` +
    `<g stroke="none" fill="#ffffff" fill-rule="evenodd">` +
    `<path d="M24 17 L24 31 M17 24 L31 24" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>` +
    `</g></svg>`
  );
}