// ==========================================================
// REMPLISSAGE DE POCKETBASE  →  npm run seed
// ----------------------------------------------------------
// Copie dans PocketBase tous les textes de src/data/content.mjs
// et les images de src/assets/images/.
// ⚠️ Le script REMPLACE les contenus existants (projets,
// compétences, inspirations, outils, fiche site). Les messages
// reçus via le formulaire ne sont jamais touchés.
//
// Il lit dans le fichier .env :
//   PUBLIC_PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD
// (le mot de passe ne sert qu'ici, il n'est jamais envoyé au site)
// ==========================================================
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import PocketBase from 'pocketbase';
import * as content from '../src/data/content.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
if (existsSync(path.join(root, '.env'))) process.loadEnvFile(path.join(root, '.env'));

const { PUBLIC_PB_URL: url, PB_ADMIN_EMAIL: email, PB_ADMIN_PASSWORD: password } = process.env;
if (!url || !email || !password) {
  console.error('❌ Il manque PUBLIC_PB_URL, PB_ADMIN_EMAIL ou PB_ADMIN_PASSWORD dans le fichier .env');
  process.exit(1);
}

const pb = new PocketBase(url);
pb.autoCancellation(false);

/** Charge une image de src/assets/images en File (ou rien si absente) */
async function file(name) {
  if (!name) return undefined;
  const p = path.join(root, 'src/assets/images', name);
  if (!existsSync(p)) { console.warn(`  ⚠️ image introuvable : ${name}`); return undefined; }
  const type = name.endsWith('.png') ? 'image/png' : name.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  return new File([await readFile(p)], name, { type });
}
const files = async (names = []) => (await Promise.all(names.map(file))).filter(Boolean);

/** Vide une collection puis crée les nouvelles fiches */
async function replace(collection, rows) {
  const old = await pb.collection(collection).getFullList({ fields: 'id' });
  for (const r of old) await pb.collection(collection).delete(r.id);
  for (const row of rows) await pb.collection(collection).create(row);
  console.log(`  ✓ ${collection} : ${rows.length} fiche(s)`);
}

try {
  await pb.collection('_superusers').authWithPassword(email, password);
  console.log(`📡 Connectée à ${url}`);

  const { portrait, cv, ...siteText } = content.site;
  await replace('site', [{ ...siteText, portrait: await file(portrait) }]);

  const projects = [];
  for (const p of content.projects) {
    projects.push({
      slug: p.slug, title: p.title, genre: p.genre, year: p.year, time: p.time, channel: p.channel,
      color: p.color, description: p.description,
      tags: JSON.stringify(p.tags), steps: JSON.stringify(p.steps), gallery_titles: JSON.stringify(p.gallery_titles),
      context: p.context, problem: p.problem, result: p.result, role: p.role,
      has_page: p.has_page, sort: p.sort,
      thumbnails: await files(p.thumbnails),
      hero: await file(p.hero),
      video_poster: await file(p.video_poster),
      gallery: await files(p.gallery),
    });
  }
  await replace('projects', projects);

  await replace('skills', content.skills.map((s, i) => ({ ...s, sort: i + 1 })));

  const inspirations = [];
  for (const [i, s] of content.inspirations.entries()) {
    inspirations.push({ name: s.name, photos: await files(s.photos), sort: i + 1 });
  }
  await replace('inspirations', inspirations);

  await replace('tools', content.tools.map((t, i) => ({ ...t, items: JSON.stringify(t.items), sort: i + 1 })));

  console.log('✅ PocketBase est rempli ! Relance « npm run build » pour régénérer le site.');
} catch (err) {
  console.error('❌ Erreur :', err?.response ?? err);
  process.exit(1);
}
