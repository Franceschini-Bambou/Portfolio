// URL optimisée d'une image, pour l'utiliser en CSS (background-image)
// ou dans un attribut (poster d'une vidéo, srcset…).
import { getImage } from 'astro:assets';
import type { Media } from './data';

export async function mediaUrl(src: Media | undefined, width = 1400): Promise<string | undefined> {
  if (!src) return undefined;
  const img =
    typeof src === 'string'
      ? await getImage({ src, inferSize: true, width, format: 'webp', quality: 82 })
      : await getImage({ src, width: Math.min(width, src.width), format: 'webp', quality: 82 });
  return img.src;
}

/**
 * Version « plein écran » d'une image pour la loupe : on garde sa taille
 * d'origine (aucune réduction) et une qualité maximale, pour qu'elle soit nette.
 */
export async function fullUrl(src: Media | undefined): Promise<string | undefined> {
  if (!src) return undefined;
  const img =
    typeof src === 'string'
      ? await getImage({ src, inferSize: true, format: 'webp', quality: 95 })
      : await getImage({ src, width: src.width, format: 'webp', quality: 95 });
  return img.src;
}
