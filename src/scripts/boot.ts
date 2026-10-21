// ==========================================================
// ÉCRAN DE CHARGEMENT « Réglage automatique » (BootScreen.astro)
// ----------------------------------------------------------
// Le pourcentage suit le vrai chargement : polices, images visibles
// en haut de page, puis la fin du chargement de la page. Il dure au
// moins 2,2 s (pour qu'on ait le temps de le voir) et au plus 8 s.
// ==========================================================
const MIN_MS = 2200;
const MAX_MS = 8000;
const messages = [
  "Réglage de l'antenne…",
  'Calibrage des couleurs…',
  'Chargement des émissions…',
  'Préparation du direct…',
];

const boot = document.getElementById('boot');

if (boot && !boot.dataset.done && !boot.hidden) run(boot);

function run(boot: HTMLElement) {
  const $ = <T extends Element = HTMLElement>(s: string) => boot.querySelector<T>(s)!;
  const $$ = (s: string) => Array.from(boot.querySelectorAll<HTMLElement>(s));
  const pct = $('[data-boot-pct]'), freq = $('[data-boot-freq]'), msg = $('[data-boot-msg]');
  const needle = $('[data-boot-needle]'), segs = $$('[data-boot-seg]'), chans = $$('[data-boot-ch]'), bars = $$('[data-boot-bar]');
  const noise = $<HTMLCanvasElement>('[data-boot-noise]');

  /* ---- ce qu'on attend vraiment ---- */
  let total = 0, done = 0;
  const wait = (p: Promise<unknown>) => { total++; p.finally(() => done++); };
  wait(document.fonts?.ready ?? Promise.resolve());
  document.querySelectorAll<HTMLImageElement>('main img').forEach((img) => {
    if (img.getBoundingClientRect().top > innerHeight * 1.2) return; // seulement le haut de page
    if (img.complete) return;
    wait(new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }));
  });
  wait(document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true })));

  /* ---- animation du réglage ---- */
  const t0 = performance.now();
  let shown = 0, finished = false, lastMsg = -1;
  const found = new Set<number>();

  function paint(p: number) {
    pct.textContent = String(Math.round(p)).padStart(3, '0');
    freq.textContent = (471.25 + (p / 100) * 384).toFixed(2); // 471,25 → 855,25 MHz (bande UHF)
    needle.style.left = `${p}%`;
    const on = Math.round((p / 100) * segs.length);
    segs.forEach((s, i) => { s.style.background = i < on ? (i >= segs.length - 4 ? '#8CBF6F' : '#DBBCDA') : ''; });
    bars.forEach((b, i) => { b.style.opacity = p >= ((i + 1) / bars.length) * 100 - 0.5 ? '1' : '.15'; });
    chans.forEach((c, i) => {
      if (found.has(i) || p < ((i + 1) / chans.length) * 100 - 6) return;
      found.add(i);
      c.style.color = '#FBF5EC';
      c.querySelector('[data-boot-state]')!.textContent = '✓ TROUVÉE';
      (c.querySelector('[data-boot-state]') as HTMLElement).style.color = '#8CBF6F';
    });
    const m = Math.min(messages.length - 1, Math.floor((p / 100) * messages.length));
    if (m !== lastMsg) { lastMsg = m; msg.textContent = messages[m]; }
  }

  function tick(now: number) {
    if (finished) return;
    const elapsed = now - t0;
    const real = total ? (done / total) * 100 : 100;
    // le chiffre suit le chargement réel, sans aller plus vite que la durée minimale
    const target = Math.min(elapsed >= MAX_MS ? 100 : real, (elapsed / MIN_MS) * 100);
    shown += (target - shown) * 0.12;
    if (target >= 100 && shown > 99.4) shown = 100;
    paint(shown);
    if (shown >= 100) return finish();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  $('[data-boot-skip]').addEventListener('click', () => { if (!finished) { shown = 100; paint(100); finish(true); } });

  /* ---- fin : signal trouvé → décrochage vers le haut ---- */
  async function finish(fast = false) {
    finished = true;
    msg.textContent = '▶ Début des programmes';
    msg.style.color = '#8CBF6F';
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    if (!fast) await sleep(450);
    boot.classList.add('is-glitch');
    startNoise(noise);
    await sleep(fast ? 120 : 260);
    document.documentElement.classList.remove('booting'); // l'intro de la page démarre
    document.dispatchEvent(new Event('boot:done'));
    boot.classList.add('is-out');
    await sleep(800);
    stopNoise = true;
    boot.hidden = true;
    boot.dataset.done = '1';
    try { sessionStorage.setItem('canalbf-boot', '1'); } catch {}
  }

  let stopNoise = false;
  function startNoise(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.style.opacity = '.55';
    const img = ctx.createImageData(canvas.width, canvas.height);
    const loop = () => {
      if (stopNoise) return;
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(loop);
    };
    loop();
  }
}
