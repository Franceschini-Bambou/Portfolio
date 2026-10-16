// Outils pour les images (PocketBase ou locales).
import { getImage, inferRemoteSize } from 'astro:assets';
import type { Media } from './data';

/** Vraie taille d'une image PocketBase (mise en cache : on ne la lit qu'une fois) */
const sizes = new Map<string, Promise<{ width: number; height: number }>>();
const sizeOf = (src: string) => {
  if (!sizes.has(src)) sizes.set(src, inferRemoteSize(src).then(({ width, height }) => ({ width, height })));
  return sizes.get(src)!;
};

/**
 * Dimensions à générer pour une image, sans jamais la déformer ni l'agrandir :
 * la hauteur est calculée à partir de la largeur, en gardant les proportions.
 * (Astro, avec une image distante, garderait sinon la hauteur d'origine.)
 */
export async function fit(src: Media, maxWidth = Infinity) {
  const { width, height } = typeof src === 'string' ? await sizeOf(src) : src;
  const w = Math.min(maxWidth, width);
  return { width: Math.round(w), height: Math.round((w * height) / width) };
}

/** URL optimisée d'une image, pour du CSS (background-image) ou un attribut (poster…). */
export async function mediaUrl(src: Media | undefined, width = 1400): Promise<string | undefined> {
  if (!src) return undefined;
  const size = await fit(src, width);
  const img = await getImage({ src: src as any, ...size, format: 'webp', quality: 82 });
  return img.src;
}

/**
 * Version « plein écran » d'une image pour la loupe : taille d'origine
 * (limitée à 2560 px de large) et qualité maximale, pour qu'elle soit nette.
 */
export async function fullUrl(src: Media | undefined): Promise<string | undefined> {
  if (!src) return undefined;
  const size = await fit(src, 2560);
  const img = await getImage({ src: src as any, ...size, format: 'webp', quality: 92 });
  return img.src;
}
