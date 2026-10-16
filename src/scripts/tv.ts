// ==========================================================
// INTERACTIONS « TÉLÉ » DU SITE
// Ce script est chargé une seule fois ; grâce au ClientRouter
// d'Astro il continue de tourner quand on change de page.
// On utilise la délégation d'évènements (document.addEventListener)
// pour que tout fonctionne aussi sur les pages chargées ensuite.
// ==========================================================
import { channelOf, pad2 } from '../lib/channels';

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------- 1. Compteur « SP 00:00:26 » ---------- */
let seconds = 26;
const timecode = () =>
  `SP ${pad2(Math.floor(seconds / 3600))}:${pad2(Math.floor(seconds / 60) % 60)}:${pad2(seconds % 60)}`;
function paintTimecode() {
  const tc = timecode();
  document.querySelectorAll<HTMLElement>('[data-tc]').forEach((el) => (el.textContent = tc));
}
setInterval(() => { seconds++; paintTimecode(); }, 1000);

/* ---------- 2. Neige (bruit) dessinée dans un <canvas> ---------- */
const noiseLoops = new WeakMap<HTMLCanvasElement, boolean>();
function startNoise(canvas: HTMLCanvasElement) {
  noiseLoops.set(canvas, true);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const img = ctx.createImageData(canvas.width, canvas.height);
  const d = img.data;
  const tick = () => {
    if (!noiseLoops.get(canvas)) return;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(tick);
  };
  tick();
}
const stopNoise = (canvas: HTMLCanvasElement) => noiseLoops.set(canvas, false);

/** Petite rafale de neige sur un écran : `mid` est appelé au milieu. */
async function burst(screen: HTMLElement, ms: number, mid: () => void) {
  if (screen.dataset.busy) return;
  screen.dataset.busy = '1';
  const canvas = screen.querySelector<HTMLCanvasElement>('canvas[data-noise]');
  if (canvas && !reduceMotion()) { canvas.style.opacity = '1'; startNoise(canvas); }
  await wait(reduceMotion() ? 0 : ms / 2);
  mid();
  await wait(reduceMotion() ? 0 : ms / 2);
  if (canvas) { canvas.style.opacity = '0'; stopNoise(canvas); }
  delete screen.dataset.busy;
}

/* ---------- 3. Zapping entre les pages ---------- */
const ZAP_MS = 750; // durée totale, comme dans la maquette
function snow() { return document.getElementById('snow'); }
function showSnow(to: URL) {
  const s = snow();
  if (!s || reduceMotion()) return;
  const ch = channelOf(to.pathname);
  const label = s.querySelector('[data-snow-ch]');
  if (label) label.textContent = ch ? `CH ${pad2(ch)}` : 'CH --';
  s.style.opacity = '1';
  s.style.pointerEvents = 'auto';
  startNoise(s.querySelector('canvas')!);
}
function hideSnow() {
  const s = snow();
  if (!s) return;
  s.style.opacity = '0';
  s.style.pointerEvents = 'none';
  stopNoise(s.querySelector('canvas')!);
}
document.addEventListener('astro:before-preparation', (e: any) => {
  if (e.from?.pathname === e.to?.pathname) return; // simple ancre / même page
  showSnow(e.to);
  const load = e.loader;
  e.loader = async () => { await Promise.all([load(), wait(reduceMotion() ? 0 : ZAP_MS / 2)]); };
});
document.addEventListener('astro:after-swap', async () => {
  paintTimecode();
  await wait(reduceMotion() ? 0 : ZAP_MS / 2);
  hideSnow();
});
document.addEventListener('astro:page-load', () => {
  paintTimecode();
  // page 404 : neige permanente
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-noise-auto]').forEach((c) => { if (!reduceMotion()) startNoise(c); });
});

/* ---------- 4. Télécommande mobile (menu) ---------- */
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-remote-toggle]');
  const panel = document.getElementById('remote');
  if (!panel) return;
  if (btn) {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    const label = btn.querySelector('[data-remote-label]');
    if (label) label.textContent = open ? 'FERMER' : 'MENU';
    return;
  }
  // clic en dehors → on referme
  if (!panel.hidden && !(e.target as Element).closest('#remote')) {
    panel.hidden = true;
    const t = document.querySelector('[data-remote-toggle]');
    t?.setAttribute('aria-expanded', 'false');
    const label = t?.querySelector('[data-remote-label]');
    if (label) label.textContent = 'MENU';
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const panel = document.getElementById('remote');
  if (panel && !panel.hidden) (document.querySelector('[data-remote-toggle]') as HTMLButtonElement)?.click();
});

/* ---------- 5. Filtres de la page « Mes projets » ---------- */
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
  if (!btn) return;
  const value = btn.dataset.filter!;
  const guide = document.querySelector<HTMLElement>('[data-guide]');
  const s = snow();
  const apply = () => {
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => {
      const on = b === btn;
      b.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll<HTMLElement>('[data-genre]').forEach((row) => {
      row.hidden = value !== 'Tous' && row.dataset.genre !== value;
    });
  };
  if (!s || reduceMotion()) return apply();
  // courte rafale de neige plein écran, comme dans la maquette
  s.style.opacity = '1';
  startNoise(s.querySelector('canvas')!);
  const label = s.querySelector('[data-snow-ch]');
  if (label) label.textContent = 'CH 02';
  setTimeout(apply, 190);
  setTimeout(() => { hideSnow(); guide?.scrollIntoView({ block: 'nearest' }); }, 380);
});

/* ---------- 6. Carrousels à chaînes (affiches, inspirations) ---------- */
function goTo(root: HTMLElement, index: number) {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const n = slides.length;
  const current = Number(root.dataset.index || 0);
  const next = ((index % n) + n) % n;
  if (next === current) return;
  const screen = root.querySelector<HTMLElement>('[data-screen]') ?? root;
  burst(screen, Number(root.dataset.ms || 460), () => {
    root.dataset.index = String(next);
    slides.forEach((s, i) => (s.hidden = i !== next));
    root.querySelectorAll<HTMLElement>('[data-goto]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.goto) === next)));
    root.querySelectorAll<HTMLElement>('[data-label]').forEach((el) => {
      const values = JSON.parse(el.dataset.label!);
      el.textContent = values[next];
    });
    const live = root.querySelector('[data-live]');
    if (live) live.textContent = `Chaîne ${next + 1} sur ${n}`;
  });
}
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  const root = t.closest<HTMLElement>('[data-carousel]');
  if (!root) return;
  const i = Number(root.dataset.index || 0);
  if (t.closest('[data-prev]')) goTo(root, i - 1);
  else if (t.closest('[data-next]')) goTo(root, i + 1);
  else {
    const g = t.closest<HTMLElement>('[data-goto]');
    if (g) goTo(root, Number(g.dataset.goto));
  }
});
// Swipe sur mobile
let touchX = 0, touchRoot: HTMLElement | null = null;
document.addEventListener('touchstart', (e) => {
  touchRoot = (e.target as Element).closest<HTMLElement>('[data-carousel] [data-screen]')?.closest('[data-carousel]') ?? null;
  touchX = e.touches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (!touchRoot) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 45) goTo(touchRoot, Number(touchRoot.dataset.index || 0) + (dx < 0 ? 1 : -1));
  touchRoot = null;
}, { passive: true });
// Flèches du clavier quand le carrousel a le focus
document.addEventListener('keydown', (e) => {
  const root = (document.activeElement as Element | null)?.closest<HTMLElement>('[data-carousel]');
  if (!root || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
  goTo(root, Number(root.dataset.index || 0) + (e.key === 'ArrowRight' ? 1 : -1));
});

/* ---------- 7. Loupe : affiches, captures et vidéo en grand ---------- */
// Les éléments cliquables ont l'attribut data-zoom (voir Lightbox.astro).
let lbItems: HTMLElement[] = [];
let lbIndex = 0;
const lightbox = () => document.querySelector<HTMLDialogElement>('dialog[data-lightbox]');

function lbShow(i: number) {
  const dlg = lightbox();
  if (!dlg || !lbItems.length) return;
  lbIndex = (i + lbItems.length) % lbItems.length;
  const item = lbItems[lbIndex];
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const video = dlg.querySelector<HTMLVideoElement>('[data-lb-video]')!;
  const isVideo = item.dataset.type === 'video';
  video.pause();
  img.hidden = isVideo;
  video.hidden = !isVideo;
  if (isVideo) {
    img.removeAttribute('src');
    video.poster = item.dataset.poster || '';
    video.src = item.dataset.full!;
    video.play().catch(() => {}); // si le navigateur bloque la lecture auto, les contrôles restent là
  } else {
    video.removeAttribute('src');
    video.load();
    img.src = item.dataset.full!;
    img.alt = item.dataset.caption || '';
  }
  dlg.querySelector('[data-lb-caption]')!.textContent = item.dataset.caption || '';
  const several = lbItems.length > 1;
  dlg.querySelector('[data-lb-counter]')!.textContent = several ? `${pad2(lbIndex + 1)} / ${pad2(lbItems.length)}` : isVideo ? 'LECTURE' : 'ZOOM';
  dlg.querySelectorAll<HTMLElement>('[data-lb-prev],[data-lb-next]').forEach((b) => (b.style.visibility = several ? 'visible' : 'hidden'));
}
function lbOpen(trigger: HTMLElement) {
  const dlg = lightbox();
  if (!dlg || !trigger.dataset.full) return;
  const group = trigger.dataset.zoomGroup;
  // une seule entrée par image (une même affiche peut être à 2 endroits de la page)
  const all = group ? [...document.querySelectorAll<HTMLElement>(`[data-zoom][data-zoom-group="${group}"]`)] : [trigger];
  lbItems = all.filter((el, i) => all.findIndex((o) => o.dataset.full === el.dataset.full) === i);
  lbShow(Math.max(0, lbItems.findIndex((el) => el.dataset.full === trigger.dataset.full)));
  dlg.showModal();
}
function lbClose() { lightbox()?.close(); }

document.addEventListener('click', (e) => {
  const t = e.target as Element;
  const trigger = t.closest<HTMLElement>('[data-zoom]');
  if (trigger) return lbOpen(trigger);
  if (!t.closest('dialog[data-lightbox]')) return;
  if (t.closest('[data-lb-close]')) lbClose();
  else if (t.closest('[data-lb-prev]')) lbShow(lbIndex - 1);
  else if (t.closest('[data-lb-next]')) lbShow(lbIndex + 1);
  else if (t.matches('[data-lb-stage]')) lbClose(); // clic à côté de l'image
});
document.addEventListener('keydown', (e) => {
  const dlg = lightbox();
  if (!dlg?.open) return;
  if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
});
// quand la loupe se ferme (bouton, Échap…), on coupe la vidéo
document.addEventListener('close', (e) => {
  const dlg = e.target as HTMLElement;
  if (!dlg.matches?.('dialog[data-lightbox]')) return;
  const video = dlg.querySelector<HTMLVideoElement>('[data-lb-video]');
  if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
}, true);
// swipe dans la loupe sur mobile
let lbTouchX = 0;
document.addEventListener('touchstart', (e) => {
  if ((e.target as Element).closest('dialog[data-lightbox] [data-lb-stage]')) lbTouchX = e.touches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (!(e.target as Element).closest('dialog[data-lightbox] [data-lb-stage]') || lbItems.length < 2) return;
  const dx = e.changedTouches[0].clientX - lbTouchX;
  if (Math.abs(dx) > 45) lbShow(lbIndex + (dx < 0 ? 1 : -1));
}, { passive: true });
document.addEventListener('astro:before-swap', lbClose);

/* ---------- 8. Formulaire de contact → PocketBase ---------- */
document.addEventListener('submit', async (e) => {
  const form = (e.target as Element).closest<HTMLFormElement>('form[data-contact]');
  if (!form) return;
  e.preventDefault();
  const data = new FormData(form);
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  // champ piège invisible : rempli = robot
  if (data.get('site_web')) return;
  const pbUrl = import.meta.env.PUBLIC_PB_URL as string | undefined;
  const payload = {
    nom: String(data.get('nom') || '').trim(),
    prenom: String(data.get('prenom') || '').trim(),
    email: String(data.get('email') || '').trim(),
    message: String(data.get('message') || '').trim(),
  };
  if (button) { button.disabled = true; button.dataset.label = button.textContent || ''; }
  if (status) { status.hidden = false; status.textContent = 'Transmission en cours…'; }
  try {
    if (!pbUrl) throw new Error('PocketBase non configuré');
    const res = await fetch(`${pbUrl.replace(/\/$/, '')}/api/collections/messages/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    form.querySelector<HTMLElement>('[data-form-fields]')!.hidden = true;
    const ok = form.querySelector<HTMLElement>('[data-form-sent]')!;
    ok.hidden = false;
    ok.focus();
  } catch (err) {
    if (status) status.textContent = 'Signal perdu… Le message n’est pas parti. Réessaie ou écris-moi directement par e-mail.';
    if (button) button.disabled = false;
    console.error(err);
  }
});
