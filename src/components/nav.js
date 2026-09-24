// @ts-check

/** @typedef {{ href: string; label: string; key: string }} NavLink */

/** @type {NavLink[]} */
export const NAV_LINKS = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/services', label: 'Services', key: 'services' },
  { href: '/patients', label: 'Patients', key: 'patients' },
  { href: '/reviews', label: 'Reviews', key: 'reviews' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

/**
 * Build a nav <ul> for a given active page key.
 * @param {string} active
 * @returns {string}
 */
export function navList(active) {
  const items = NAV_LINKS.map(
    (l) =>
      `<li class="nav__item"><a class="nav__link${l.key === active ? ' is-active' : ''}" href="${l.href}"` +
      `${l.key === active ? ' aria-current="page"' : ''}>${l.label}</a></li>`,
  ).join('\n');
  return `<ul class="nav__list">\n${items}\n</ul>`;
}