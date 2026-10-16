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
