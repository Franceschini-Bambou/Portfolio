// ==========================================================
// PLAN DU SITE pour les moteurs de recherche : /sitemap.xml
// Généré au build à partir des pages fixes et des projets publiés
// dans PocketBase (FR + EN, avec les liens entre les deux langues).
// ==========================================================
import type { APIRoute } from 'astro';
import { getContent } from '../lib/data';
import { routes, projectUrl, langs } from '../i18n/ui';

export const GET: APIRoute = async ({ site }) => {
  const { projects } = await getContent('fr');
  const pages: Record<string, string>[] = [
    ...Object.values(routes).map((r) => ({ ...r })),
    ...projects.filter((p) => p.hasPage).map((p) => Object.fromEntries(langs.map((l) => [l, projectUrl(l, p.slug)]))),
  ];
  const abs = (path: string) => new URL(path, site).href;
  const urls = pages.flatMap((page) =>
    langs.map((l) => `  <url>
    <loc>${abs(page[l])}</loc>
${langs.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${abs(page[alt])}"/>`).join('\n')}
  </url>`),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
