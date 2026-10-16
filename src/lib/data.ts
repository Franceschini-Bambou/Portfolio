// ==========================================================
// ACCÈS AUX DONNÉES
// Au moment du build, Astro lit tes contenus dans PocketBase.
// Si PocketBase ne répond pas (ou si PUBLIC_PB_URL est vide),
// on utilise le contenu de secours de src/data/content.mjs.
// ==========================================================
import PocketBase from 'pocketbase';
import type { ImageMetadata } from 'astro';
import * as fallback from '../data/content.mjs';

/** Une image : soit un fichier local importé, soit une URL PocketBase */
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
  context: string;
  problem: string;
  steps: string[];
  result: string;
  role: string;
  hasPage: boolean;
}
export interface Skill { title: string; description: string }
export interface Inspiration { name: string; photos: Media[] }
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
export interface Content { site: Site; projects: Project[]; skills: Skill[]; inspirations: Inspiration[]; tools: Tool[]; source: 'pocketbase' | 'local' }

// --- Images locales (mode secours) ---
const localFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{png,jpg,jpeg,webp}', { eager: true });
const local = (name?: string | null): Media | undefined => {
  if (!name) return undefined;
  const hit = localFiles[`../assets/images/${name}`];
  if (!hit) console.warn(`[canal-bf] image locale introuvable : ${name}`);
  return hit?.default;
};
const pad = (n: number) => String(n).padStart(2, '0');

function fromLocal(): Content {
  const f = fallback as any;
  return {
    source: 'local',
    site: {
      stage: f.site.stage, email: f.site.email,
      linkedin: f.site.linkedin, linkedinLabel: f.site.linkedin_label,
      instagram: f.site.instagram, instagramLabel: f.site.instagram_label,
      behance: f.site.behance, behanceLabel: f.site.behance_label,
      portrait: local(f.site.portrait),
      cv: f.site.cv ?? undefined,
    },
    projects: f.projects.map((p: any, i: number) => ({
      id: p.slug, slug: p.slug, title: p.title, genre: p.genre, year: p.year, time: p.time, channel: p.channel,
      color: p.color, description: p.description, tags: p.tags,
      thumbnails: p.thumbnails.map(local).filter(Boolean),
      hero: local(p.hero), video: p.video ?? undefined, videoPoster: local(p.video_poster),
      gallery: p.gallery.map((g: string, j: number) => ({ src: local(g)!, title: p.gallery_titles[j] ?? '', num: pad(j + 1) })),
      context: p.context, problem: p.problem, steps: p.steps, result: p.result, role: p.role, hasPage: p.has_page,
    })),
    skills: f.skills.map((s: any) => ({ title: s.title, description: s.description })),
    inspirations: f.inspirations.map((s: any) => ({ name: s.name, photos: s.photos.map(local).filter(Boolean) })),
    tools: f.tools.map((t: any) => ({ name: t.name, fileLabel: t.file_label, color: t.color, items: t.items })),
  };
}

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
      stage: s.stage || (fallback as any).site.stage,
      email: s.email, linkedin: s.linkedin, linkedinLabel: s.linkedin_label,
      instagram: s.instagram, instagramLabel: s.instagram_label,
      behance: s.behance, behanceLabel: s.behance_label,
      portrait: file(s, s.portrait) ?? local((fallback as any).site.portrait),
      cv: s.cv ? file(s, s.cv) : undefined,
    },
    projects: projects.map((p: any) => ({
      id: p.id, slug: p.slug, title: p.title, genre: p.genre, year: p.year, time: p.time, channel: p.channel,
      color: p.color || '#DBBCDA', description: p.description, tags: p.tags ?? [],
      thumbnails: (p.thumbnails ?? []).map((n: string) => file(p, n)),
      hero: file(p, p.hero), video: file(p, p.video), videoPoster: file(p, p.video_poster),
      gallery: (p.gallery ?? []).map((n: string, j: number) => ({ src: file(p, n)!, title: p.gallery_titles?.[j] ?? '', num: pad(j + 1) })),
      context: p.context ?? '', problem: p.problem ?? '', steps: p.steps ?? [], result: p.result ?? '', role: p.role ?? '',
      hasPage: !!p.has_page,
    })),
    skills: skills.map((k: any) => ({ title: k.title, description: k.description })),
    inspirations: inspirations.map((r: any) => ({ name: r.name, photos: (r.photos ?? []).map((n: string) => file(r, n)) })),
    tools: tools.map((t: any) => ({ name: t.name, fileLabel: t.file_label, color: t.color, items: t.items ?? [] })),
  };
}

let cache: Promise<Content> | undefined;

/** Renvoie tout le contenu du site (mis en cache pendant le build). */
export function getContent(): Promise<Content> {
  if (cache) return cache;
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
  {
    if (!url) {
      console.info('[canal-bf] PUBLIC_PB_URL vide → contenu local utilisé.');
      return fromLocal();
    }
    try {
      const data = await fromPocketBase(url);
      if (!data.projects.length) throw new Error('aucun projet publié');
      console.info(`[canal-bf] contenu chargé depuis PocketBase (${url}).`);
      return data;
    } catch (err) {
      console.warn(`[canal-bf] PocketBase injoignable (${(err as Error).message}) → contenu local utilisé.`);
      return fromLocal();
    }
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
