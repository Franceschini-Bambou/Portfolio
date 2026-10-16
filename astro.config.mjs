// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// On lit le fichier .env pour connaître l'adresse de PocketBase
// (les images stockées dans PocketBase sont optimisées au moment du build).
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const pbUrl = env.PUBLIC_PB_URL ? new URL(env.PUBLIC_PB_URL) : null;

export default defineConfig({
  // ⚠️ Remplace par ton vrai nom de domaine quand le site sera en ligne
  site: 'https://portfolio.bambou-franceschini.fr',
  trailingSlash: 'ignore',
  prefetch: { prefetchAll: true },
  image: {
    remotePatterns: pbUrl
      ? [{ protocol: pbUrl.protocol.replace(':', ''), hostname: pbUrl.hostname, ...(pbUrl.port ? { port: pbUrl.port } : {}) }]
      : [],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
