// ==========================================================
// ACCÈS AUX DONNÉES
// Tout le contenu du site (textes, images, vidéo, CV) vient de
// PocketBase. Si PocketBase ne répond pas, le site affiche une
// erreur claire au lieu de se construire à moitié vide.
// ==========================================================
import PocketBase from 'pocketbase';
import type { ImageMetadata } from 'astro';

/** Une image : l'adresse du fichier dans PocketBase */
export type Media = ImageMetadata | string;

export interface Project {
  id: string;
  slug: string;
  title: string;
  genre: 'Audiovisuel' | 'Graphisme' | 'Communication' | string;
  year: string;
  time: string;
  channel: string;
  color: string;
  description: string;
  tags: string[];
  thumbnails: Media[];
  hero?: Media;
  video?: string;
  videoPoster?: Media;
  gallery: { src: Media; title: string; num: string }[];
  /** titre de la galerie (« Les affiches », « Les visuels »…) */
  galleryTitle: string;
  context: string;
  problem: string;
  steps: string[];
  result: string;
  role: string;
  hasPage: boolean;
}
export interface Skill { title: string; description: string }
export interface Inspiration { name: string; photos: Media[]; /** cadrage de chaque photo (object-position CSS) */ positions: string[] }
export interface Tool { name: string; fileLabel: string; color: string; items: string[] }
export interface Site {
  stage: string;
  email: string;
  linkedin: string; linkedinLabel: string;
  instagram: string; instagramLabel: string;
  behance: string; behanceLabel: string;
  portrait?: Media;
  cv?: string;
}
export interface Content { site: Site; projects: Project[]; skills: Skill[]; inspirations: Inspiration[]; tools: Tool[]; source: 'pocketbase' }

const pad = (n: number) => String(n).padStart(2, '0');

async function fromPocketBase(url: string): Promise<Content> {
  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  const file = (rec: any, name?: string) => (name ? pb.files.getURL(rec, name) : undefined);
  const [projects, skills, inspirations, tools, sites] = await Promise.all([
    pb.collection('projects').getFullList({ sort: 'sort' }),
    pb.collection('skills').getFullList({ sort: 'sort' }),
    pb.collection('inspirations').getFullList({ sort: 'sort' }),
    pb.collection('tools').getFullList({ sort: 'sort' }),
    pb.collection('site').getFullList({ limit: 1 }),
  ]);
  const s: any = sites[0] ?? {};
  return {
    source: 'pocketbase',
    site: {
      stage: s.stage ?? '',
      email: s.email, linkedin: s.linkedin, linkedinLabel: s.linkedin_label,
      instagram: s.instagram, instagramLabel: s.instagram_label,
      behance: s.behance, behanceLabel: s.behance_label,
      portrait: file(s, s.portrait),
      cv: s.cv ? file(s, s.cv) : undefined,
    },
    projects: projects.map((p: any) => ({
      id: p.id, slug: p.slug, title: p.title, genre: p.genre, year: p.year, time: p.time, channel: p.channel,
      color: p.color || '#DBBCDA', description: p.description, tags: p.tags ?? [],
      thumbnails: (p.thumbnails ?? []).map((n: string) => file(p, n)),
      hero: file(p, p.hero), video: file(p, p.video), videoPoster: file(p, p.video_poster),
      gallery: (p.gallery ?? []).map((n: string, j: number) => ({ src: file(p, n)!, title: p.gallery_titles?.[j] ?? '', num: pad(j + 1) })),
      galleryTitle: (p.gallery_title ?? '').trim() || 'Les affiches',
      context: p.context ?? '', problem: p.problem ?? '', steps: p.steps ?? [], result: p.result ?? '', role: p.role ?? '',
      hasPage: !!p.has_page,
    })),
    skills: skills.map((k: any) => ({ title: k.title, description: k.description })),
    inspirations: inspirations.map((r: any) => ({ name: r.name, photos: (r.photos ?? []).map((n: string) => file(r, n)), positions: Array.isArray(r.positions) ? r.positions : [] })),
    tools: tools.map((t: any) => ({ name: t.name, fileLabel: t.file_label, color: t.color, items: t.items ?? [] })),
  };
}

let cache: Promise<Content> | undefined;

/** Renvoie tout le contenu du site (mis en cache pendant le build). */
export function getContent(): Promise<Content> {
  // en production (build) on lit PocketBase une seule fois ; en dev on relit à chaque page,
  // pour voir tout de suite ce que tu modifies dans l'admin
  if (cache && import.meta.env.PROD) return cache;
  const url = import.meta.env.PUBLIC_PB_URL as string | undefined;
  cache = (async () => typo(await load(url)))();
  return cache;
}

/** Espace insécable avant « ? ! : ; » pour qu'ils ne restent jamais seuls en début de ligne */
const nbsp = (t: string) => t.replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
function typo(c: Content): Content {
  c.projects.forEach((p) => { p.title = nbsp(p.title); p.description = nbsp(p.description); });
  return c;
}

async function load(url: string | undefined): Promise<Content> {
  if (!url) {
    throw new Error(
      '[canal-bf] PUBLIC_PB_URL est vide : indique l\'adresse de PocketBase dans le fichier .env ' +
      '(ex. PUBLIC_PB_URL=http://127.0.0.1:8090).',
    );
  }
  try {
    const data = await fromPocketBase(url);
    console.info(`[canal-bf] contenu chargé depuis PocketBase (${url}).`);
    return data;
  } catch (err) {
    throw new Error(
      `[canal-bf] Impossible de lire PocketBase à l'adresse ${url}. ` +
      'Vérifie qu\'il est bien lancé (.\\pocketbase.exe serve) puis recharge la page. ' +
      `Détail : ${(err as Error).message}`,
    );
  }
}

/** Projet précédent / suivant (en boucle, comme dans la maquette) */
export function neighbours(projects: Project[], slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

/** Couleur de chaque genre (pastilles des filtres) */
export const genreColors: Record<string, string> = {
  Tous: '#FBF5EC', Graphisme: '#E2B84A', Audiovisuel: '#4F86A6', Communication: '#8CBF6F',
};
