// ==========================================================
// ACCÈS AUX DONNÉES
// Tout le contenu du site (textes, images, vidéo, CV) vient de
// PocketBase. Si PocketBase ne répond pas, le site affiche une
// erreur claire au lieu de se construire à moitié vide.
// Version anglaise : getContent('en') prend les champs « _en »
// (title_en, description_en…) ; s'ils sont vides, le français.
// ==========================================================
import PocketBase from 'pocketbase';
import type { ImageMetadata } from 'astro';
import { genreLabels, type Lang } from '../i18n/ui';

/** Une image : l'adresse du fichier dans PocketBase */
export type Media = ImageMetadata | string;

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** valeur enregistrée dans PocketBase (en français, sert aux filtres) */
  genre: 'Audiovisuel' | 'Design UI/UX' | 'Développement web' | string;
  /** genre affiché, dans la langue de la page */
  genreLabel: string;
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
  /** lien externe (prototype Figma, site en ligne…), facultatif */
  link?: string;
  /** lien vers un notebook (Observable…), facultatif */
  notebook?: string;
  /** adresse affichée dans la télé du haut (prototype Figma ou site en ligne) */
  embed?: string;
  /** 'figma' = prototype Figma, 'site' = site web en ligne */
  embedKind?: 'figma' | 'site';
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

async function fromPocketBase(url: string, lang: Lang): Promise<Content> {
  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  const file = (rec: any, name?: string) => (name ? pb.files.getURL(rec, name) : undefined);
  // texte dans la langue de la page : champ « _en » s'il est rempli, sinon le français
  const tr = (rec: any, field: string): string => {
    const fr = rec[field] ?? '';
    if (lang === 'fr') return fr;
    const en = rec[`${field}_en`];
    return typeof en === 'string' && en.trim() ? en : fr;
  };
  const list = (rec: any, field: string): string[] => {
    const fr = Array.isArray(rec[field]) ? rec[field] : [];
    if (lang === 'fr') return fr;
    const en = rec[`${field}_en`];
    return Array.isArray(en) && en.some((x) => String(x ?? '').trim()) ? en : fr;
  };
  const [projects, skills, inspirations, tools, sites] = await Promise.all([
    pb.collection('projects').getFullList({ sort: 'sort' }),
    pb.collection('skills').getFullList({ sort: 'sort' }),
    pb.collection('inspirations').getFullList({ sort: 'sort' }),
    pb.collection('tools').getFullList({ sort: 'sort' }),
    pb.collection('site').getFullList({ limit: 1 }),
  ]);
  const s: any = sites[0] ?? {};
  const cv = lang === 'en' && s.cv_en ? file(s, s.cv_en) : s.cv ? file(s, s.cv) : undefined;
  return {
    source: 'pocketbase',
    site: {
      stage: tr(s, 'stage'),
      email: s.email, linkedin: s.linkedin, linkedinLabel: s.linkedin_label,
      instagram: s.instagram, instagramLabel: s.instagram_label,
      behance: s.behance, behanceLabel: s.behance_label,
      portrait: file(s, s.portrait),
      cv,
    },
    projects: projects.map((p: any) => {
      const titles = list(p, 'gallery_titles');
      return {
        id: p.id, slug: p.slug, title: tr(p, 'title'), genre: normalizeGenre(p.genre), genreLabel: genreLabels[lang][normalizeGenre(p.genre)] ?? p.genre,
        year: p.year, time: p.time, channel: p.channel,
        color: p.color || '#DBBCDA', description: tr(p, 'description'), tags: list(p, 'tags'),
        thumbnails: (p.thumbnails ?? []).map((n: string) => file(p, n)),
        hero: file(p, p.hero), video: file(p, p.video), videoPoster: file(p, p.video_poster),
        gallery: (p.gallery ?? []).map((n: string, j: number) => ({ src: file(p, n)!, title: titles[j] ?? '', num: pad(j + 1) })),
        galleryTitle: tr(p, 'gallery_title').trim() || (lang === 'en' ? 'The posters' : 'Les affiches'),
        context: tr(p, 'context'), problem: tr(p, 'problem'), steps: list(p, 'steps'), result: tr(p, 'result'), role: tr(p, 'role'),
        hasPage: !!p.has_page,
        link: p.link || undefined,
        notebook: p.notebook || undefined,
        embed: figmaEmbed(p.link) ?? (/^https:\/\//.test(p.link ?? '') ? p.link : undefined),
        embedKind: figmaEmbed(p.link) ? 'figma' : /^https:\/\//.test(p.link ?? '') ? 'site' : undefined,
      };
    }),
    skills: skills.map((k: any) => ({ title: tr(k, 'title'), description: tr(k, 'description') })),
    inspirations: inspirations.map((r: any) => ({ name: tr(r, 'name'), photos: (r.photos ?? []).map((n: string) => file(r, n)), positions: Array.isArray(r.positions) ? r.positions : [] })),
    tools: tools.map((t: any) => ({ name: tr(t, 'name'), fileLabel: t.file_label, color: t.color, items: t.items ?? [] })),
  };
}

const cache = new Map<Lang, Promise<Content>>();

/** Renvoie tout le contenu du site dans une langue (mis en cache pendant le build). */
export function getContent(lang: Lang = 'fr'): Promise<Content> {
  // en production (build) on lit PocketBase une seule fois par langue ; en dev on relit
  // à chaque page, pour voir tout de suite ce que tu modifies dans l'admin
  if (cache.has(lang) && import.meta.env.PROD) return cache.get(lang)!;
  const url = import.meta.env.PUBLIC_PB_URL as string | undefined;
  const p = (async () => typo(await load(url, lang), lang))();
  cache.set(lang, p);
  return p;
}

/** Espace insécable avant « ? ! : ; » pour qu'ils ne restent jamais seuls en début de ligne */
const nbsp = (t: string) => t.replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
function typo(c: Content, lang: Lang): Content {
  if (lang !== 'fr') return c; // règle de typographie française uniquement
  c.projects.forEach((p) => { p.title = nbsp(p.title); p.description = nbsp(p.description); });
  return c;
}

async function load(url: string | undefined, lang: Lang): Promise<Content> {
  if (!url) {
    throw new Error(
      '[canal-bf] PUBLIC_PB_URL est vide : indique l\'adresse de PocketBase dans le fichier .env ' +
      '(ex. PUBLIC_PB_URL=http://127.0.0.1:8090).',
    );
  }
  try {
    const data = await fromPocketBase(url, lang);
    console.info(`[canal-bf] contenu chargé depuis PocketBase (${url}, ${lang}).`);
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
  Tous: '#FBF5EC', 'Design UI/UX': '#E2B84A', Audiovisuel: '#4F86A6', 'Développement web': '#8CBF6F',
};

/**
 * Ramène le genre écrit dans PocketBase à l'un des trois genres du site,
 * quelle que soit l'écriture (accents, majuscules, espaces) :
 * « Developpement Web », « développement web » → « Développement web ».
 * Les anciens noms restent reconnus : Graphisme → Design UI/UX,
 * Communication → Développement web.
 */
export function normalizeGenre(raw: string | undefined): string {
  const key = (raw ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
  if (key.startsWith('audio')) return 'Audiovisuel';
  if (key.includes('ui') || key.includes('ux') || key.startsWith('graphi') || key.startsWith('design')) return 'Design UI/UX';
  if (key.includes('web') || key.startsWith('dev') || key.startsWith('communication')) return 'Développement web';
  return raw ?? '';
}

/**
 * Transforme un lien Figma (prototype ou maquette) en adresse
 * d'intégration (iframe). Renvoie undefined si ce n'est pas Figma.
 * Le fichier doit être partagé « Toute personne disposant du lien
 * peut voir », sinon les visiteurs voient une demande de connexion.
 */
export function figmaEmbed(link: string | undefined): string | undefined {
  if (!link) return undefined;
  try {
    const u = new URL(link);
    if (!/(^|\.)figma\.com$/.test(u.hostname)) return undefined;
    u.hostname = 'embed.figma.com';
    u.searchParams.delete('t');
    u.searchParams.set('embed-host', 'canal-bf');
    if (u.pathname.startsWith('/proto/')) {
      u.searchParams.set('scaling', 'scale-down-width'); // la maquette tient en largeur, on défile en hauteur
      u.searchParams.set('content-scaling', 'fixed');
    }
    return u.toString();
  } catch {
    return undefined;
  }
}
