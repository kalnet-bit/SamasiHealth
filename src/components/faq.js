// @ts-check
import { clinic } from '../config/clinic.js';
import { icon } from './icons.js';

/**
 * One expandable FAQ item (accessible accordion).
 * @param {{ q: string; a: string }} item
 * @returns {string}
 */
function faqItem(item) {
  return (
    `<details class="faq-item">` +
    `<summary class="faq-item__q"><span>${item.q}</span><span class="faq-item__chevron" aria-hidden="true">${icon('chevron-down', { size: 18 })}</span></summary>` +
    `<div class="faq-item__a"><p>${item.a}</p></div>` +
    `</details>`
  );
}

/**
 * FAQs and quick answers grouped by operational category.
 * @returns {string}
 */
export function faqSection() {
  return clinic.faqCategories
    .map((category) => {
      const items = category.items.map(faqItem).join('\n');
      return (
        `<div class="faq-group">` +
        `<h3 class="faq-group__title">${category.label}</h3>` +
        `<div class="faq-list">${items}</div>` +
        `</div>`
      );
    })
    .join('\n');
}