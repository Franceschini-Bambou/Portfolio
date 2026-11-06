// Les « chaînes » du site : chaque page a son numéro (utilisé dans
// le menu, le grand numéro en haut des pages et l'écran de zapping).
import { routes, ui, type Lang } from '../i18n/ui';

const list = [
  { n: 1, key: 'ch.home', route: 'home' },
  { n: 2, key: 'ch.projects', route: 'projects' },
  { n: 3, key: 'ch.about', route: 'about' },
  { n: 4, key: 'ch.contact', route: 'contact' },
] as const;

/** Les 4 chaînes, avec leur nom et leur adresse dans la langue demandée */
export const channelsFor = (lang: Lang) =>
  list.map((c) => ({ n: c.n, label: ui[lang][c.key], href: routes[c.route][lang] }));

/** Numéro de chaîne d'une adresse : /projets/... ou /en/projects/... → 2 */
export function channelOf(pathname: string): number {
  const p = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '') || '/';
  if (p === '/') return 1;
  if (p.startsWith('/projets') || p.startsWith('/projects')) return 2;
  if (p.startsWith('/a-propos') || p.startsWith('/about')) return 3;
  if (p.startsWith('/contact')) return 4;
  return 0;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
