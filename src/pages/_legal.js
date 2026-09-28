// @ts-check
import { renderPage } from '../layout/page.js';
import { pageHero } from '../components/pagehero.js';
import { openSection, closeSection } from '../components/section.js';
import { clinic } from '../config/clinic.js';

/**
 * Shared renderer for simple legal/prose pages.
 * @param {{ path: string; title: string; description: string; active: string; eyebrow: string; sections: { h: string; p: string[] }[] }} p
 * @returns {string}
 */
export function renderLegal(p) {
  const sections = p.sections
    .map(
      (s) =>
        `<section class="legal-block"><h2>${s.h}</h2>` +
        s.p.map((para) => `<p>${para}</p>`).join('\n') +
        `</section>`,
    )
    .join('\n');

  const body =
    pageHero({ eyebrow: p.eyebrow, title: p.title }) +
    openSection() +
    `<div class="container container--narrow">` +
    `<article class="prose">${sections}</article>` +
    `<p class="text-note">Last reviewed at the time the website was prepared.</p>` +
    `<p class="text-note">Questions about this page? Contact the clinic at <a href="${clinic.phone.telHref}">${clinic.phone.display}</a>.</p>` +
    `</div>` +
    closeSection();

  return renderPage({
    path: p.path,
    title: p.title,
    description: p.description,
    active: p.active,
    body,
  });
}