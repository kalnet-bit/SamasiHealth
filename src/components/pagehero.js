// @ts-check

/**
 * Compact page banner used on inner pages.
 * @param {{ eyebrow: string; title: string; lede?: string }} p
 * @returns {string}
 */
export function pageHero(p) {
  return (
    `<section class="page-hero">` +
    `<div class="container page-hero__inner">` +
    `<p class="eyebrow eyebrow--light">${p.eyebrow}</p>` +
    `<h1 class="page-hero__title">${p.title}</h1>` +
    (p.lede ? `<p class="page-hero__lede">${p.lede}</p>` : '') +
    `</div></section>`
  );
}