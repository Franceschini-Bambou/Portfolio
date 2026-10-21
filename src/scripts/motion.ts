// ==========================================================
// MOUVEMENT : défilement fluide + apparitions au scroll
// ----------------------------------------------------------
// - Lenis rend le défilement à la molette doux et fluide.
// - Les blocs des sections apparaissent quand on arrive dessus,
//   les éléments d'une liste (cartes, étapes, programmes…) l'un
//   après l'autre ; les images s'allument comme un vieil écran.
// Tout est désactivé si la personne a choisi « réduire les
// animations » dans les réglages de son appareil.
// ==========================================================
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. Défilement fluide ---------- */
const lenis = reduce
  ? null
  : new Lenis({
      autoRaf: true, // Lenis gère lui-même son animation
      lerp: 0.1, // douceur : plus petit = plus fluide
      anchors: true, // liens #ancre fluides aussi
      // pas de défilement fluide dans la loupe ni dans les zones qui défilent seules
      prevent: (node) => !!node.closest?.('dialog, [data-lenis-prevent]'),
    });

// écran de chargement : pas de défilement tant qu'il est affiché
if (document.documentElement.classList.contains('booting')) lenis?.stop();
document.addEventListener('boot:done', () => lenis?.start());
// la loupe s'ouvre / se ferme (évènements envoyés par tv.ts) → on met en pause
document.addEventListener('lightbox:open', () => lenis?.stop());
document.addEventListener('lightbox:close', () => lenis?.start());
// nouvelle page (zapping) : Lenis se recale sur la nouvelle hauteur et position
document.addEventListener('astro:page-load', () => {
  lenis?.resize();
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
});

/* ---------- 2. Apparitions au scroll ---------- */
const observer = reduce
  ? null
  : new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('is-in');
          observer!.unobserve(el);
          // une fois arrivé, on rend l'élément à ses propres styles (survols, transitions…)
          const d = parseInt(el.style.getPropertyValue('--d') || '0', 10);
          setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-in'); el.style.removeProperty('--d'); }, 1500 + d);
        }
      },
      { rootMargin: '0px', threshold: 0.12 },
    );

function tag(el: HTMLElement, delay = 0) {
  // déjà visible au chargement : on ne le cache pas (pas de clignotement)
  if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
  if (el.hidden || el.closest('[data-reveal]')) return;
  // une image seule (fenêtre photo, affiche…) → effet « allumage télé »
  const isPicture = !!el.querySelector('img') && !el.querySelector('h2, h3, p, ul, ol') && el.querySelectorAll('img').length <= 2;
  el.dataset.reveal = isPicture ? 'tv' : '';
  if (delay) el.style.setProperty('--d', `${delay}ms`);
  observer!.observe(el);
}

/** Parcourt un bloc : une liste → ses éléments un par un, sinon le bloc entier */
function walk(container: Element, depth = 0) {
  for (const child of Array.from(container.children) as HTMLElement[]) {
    if (child.matches('ul, ol')) {
      // bande qui défile de côté (mobile) : elle apparaît d'un bloc
      if (child.scrollWidth > child.clientWidth + 4) { tag(child); continue; }
      Array.from(child.children).forEach((li, i) => tag(li as HTMLElement, Math.min(i, 6) * 90));
    } else if (depth < 3 && child.querySelector(':scope ul, :scope ol')) {
      walk(child, depth + 1);
    } else {
      tag(child);
    }
  }
}

function setupReveals() {
  if (!observer) return;
  // toutes les sections (et le pied de page) ; dans celle du haut, seul ce qui dépasse de l'écran
  // est concerné (le reste a déjà sa propre intro) — tag() ignore ce qui est déjà visible
  document.querySelectorAll('main > section, body footer').forEach((section) => {
    section.querySelectorAll(':scope > div:not([aria-hidden])').forEach((inner) => walk(inner));
  });
}
document.addEventListener('astro:page-load', setupReveals);
