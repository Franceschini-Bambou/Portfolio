// Les « chaînes » du site : chaque page a son numéro (utilisé dans
// le menu, le grand numéro en haut des pages et l'écran de zapping).
export const channels = [
  { n: 1, label: 'Accueil', href: '/' },
  { n: 2, label: 'Projets', href: '/projets/' },
  { n: 3, label: 'À propos', href: '/a-propos/' },
  { n: 4, label: 'Contact', href: '/contact/' },
] as const;

/** Numéro de chaîne d'une adresse : /projets/... → 2 */
export function channelOf(pathname: string): number {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return 1;
  if (p.startsWith('/projets')) return 2;
  if (p.startsWith('/a-propos')) return 3;
  if (p.startsWith('/contact')) return 4;
  return 0;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
