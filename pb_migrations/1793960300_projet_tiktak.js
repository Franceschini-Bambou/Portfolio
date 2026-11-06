/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION — nouveau projet « TiK•TaK »
// (SAE 301, configurateur de montres, développement web)
// ----------------------------------------------------------
// Crée la fiche en français et en anglais, avec le lien du site
// en ligne (bouton « Voir le site en ligne ») et la charte
// graphique dans la galerie (images téléchargées depuis Figma).
// Placé après les autres projets : l'accueil n'en affiche que 3.
// Si la fiche existe déjà (même slug), rien n'est modifié.
// ==========================================================

const SLUG = 'tiktak';

const THUMBS = [
  'https://www.figma.com/api/mcp/asset/55df868b-4642-4051-9d76-344c9c07f3e2.png', // personnalisation
  'https://www.figma.com/api/mcp/asset/1250dbc2-242a-4d21-8bc6-a5d59cc733d9.png', // produit
  'https://www.figma.com/api/mcp/asset/16b94bb4-b64d-4864-b306-f86d650c4763.png', // compte
];
const GALLERY = [
  ['https://www.figma.com/api/mcp/asset/ac0a6809-9660-4b74-b32d-20a06719dd0f.png', 'L’identité visuelle', 'The visual identity'],
  ['https://www.figma.com/api/mcp/asset/b8cf91f2-5cc2-4bbb-9723-acecc94539d5.png', 'La montre et ses déclinaisons', 'The watch and its variations'],
];

const DATA = {
  title: 'TiK•TaK',
  title_en: 'TiK•TaK',
  year: '2026',
  time: '23:15',
  channel: 'CH 08',
  color: '#8CBF6F',
  link: 'https://tiktak.bambou-franceschini.fr',
  has_page: true,
  description: 'Un configurateur de montres en ligne : on compose sa montre, on peut la faire imaginer par une IA, puis on l’enregistre et on la commande.',
  description_en: 'An online watch configurator: you design your own watch, can have an AI come up with one for you, then save it and order it.',
  tags: ['Astro', 'DaisyUI', 'SQLite', 'IA OpenRouter', 'Connexion Google', 'Figma'],
  tags_en: ['Astro', 'DaisyUI', 'SQLite', 'OpenRouter AI', 'Google sign-in', 'Figma'],
  context: 'SAE 301 de 2e année de BUT MMI : « Concevoir et développer une expérience utilisateur ». Le sujet : créer le site configurateur de TiK•TaK, une marque de montres fabriquées en France au style raffiné, minimaliste et épuré, pour une cible unisexe de 25 à 40 ans. Le projet s’est déroulé jour par jour, du story mapping jusqu’à la mise en ligne.',
  context_en: 'SAE 301 in the second year of my BUT MMI degree: “Designing and building a user experience”. The brief: create the configurator website for TiK•TaK, a brand of French-made watches with a refined, minimalist and clean style, for a unisex audience aged 25 to 40. The project ran day by day, from story mapping all the way to going live.',
  problem: 'Comment donner envie de créer sa propre montre, et d’aller jusqu’à la commande, sur un site qui reste aussi sobre et élégant que la marque ?',
  problem_en: 'How do you make people want to design their own watch, and follow through to the order, on a site that stays as understated and elegant as the brand?',
  steps: [
    'L’UX et l’identité : un story mapping du parcours, puis une charte en deux couleurs seulement, ivoire (#FBF5EA) et bordeaux (#6B1F2C), avec Cormorant Garamond pour les titres et Jost pour le texte. Dans le logo, deux aiguilles réglées sur 10 h 10 se glissent entre TiK et TaK. Le site reste sobre : c’est la montre personnalisée qui apporte la couleur.',
    'La maquette et le dossier marketing : quatre écrans sur Figma (accueil, personnalisation, compte, produit) et une montre originale dessinée en SVG. Dans le dossier MKG, un objectif SMART (20 % d’ajouts au panier en 3 mois) et huit nudges placés dans les écrans, comme la montre déjà configurée à l’arrivée, l’ancrage du prix, le prix qui se met à jour en direct ou l’effet IKEA quand on nomme « sa » montre.',
    'Le développement : une base SQLite modélisée (MCD, MPD) et interrogée sous DataGrip, un site en Astro avec DaisyUI, un configurateur qui recolore la montre SVG en direct, une IA (OpenRouter) qui compose une montre à partir d’une simple phrase, la connexion avec Google, l’espace « mes montres » et le panier. Le site est hébergé sur mon VPS en HTTPS et se met à jour tout seul grâce à GitHub Actions.',
  ],
  steps_en: [
    'UX and identity: a story map of the user journey, then brand guidelines with just two colours, ivory (#FBF5EA) and burgundy (#6B1F2C), with Cormorant Garamond for headings and Jost for body text. In the logo, two watch hands set to ten past ten slip in between TiK and TaK. The site stays understated: the customised watch is what brings the colour.',
    'The mockup and the marketing file: four Figma screens (home, customisation, account, product) and an original watch drawn in SVG. In the marketing file, a SMART goal (20% add-to-cart rate within 3 months) and eight nudges built into the screens, such as a watch that is already configured on arrival, price anchoring, a live-updating price, or the IKEA effect when you name “your” watch.',
    'Development: an SQLite database modelled (conceptual and physical data models) and queried in DataGrip, an Astro site with DaisyUI, a configurator that recolours the SVG watch live, an AI (OpenRouter) that builds a watch from a single sentence, Google sign-in, a “my watches” space and a cart. The site is hosted on my VPS over HTTPS and deploys itself through GitHub Actions.',
  ],
  result: 'Un site en ligne, responsive et bilingue (français / anglais), avec en bonus un outil pour graver le bracelet et des apparitions au défilement. Ce que je retiens : un site de marque gagne à s’effacer derrière son produit (deux couleurs, des textes courts), et un nudge réussi aide l’utilisateur à se décider sans jamais le piéger.',
  result_en: 'A live, responsive, bilingual (French / English) website, with a bonus tool to engrave the strap and scroll-triggered animations. What I take away from it: a brand site works best when it steps back behind its product (two colours, short copy), and a good nudge helps users make up their mind without ever tricking them.',
  role: 'Projet individuel : story mapping, identité visuelle, maquette et prototype Figma, dossier marketing (objectif SMART et nudges), base de données, développement du site et déploiement sur VPS (DNS, certificat SSL, Apache).',
  role_en: 'Solo project: story mapping, visual identity, Figma mockup and prototype, marketing file (SMART goal and nudges), database, website development and deployment on a VPS (DNS, SSL certificate, Apache).',
  gallery_title: 'La charte graphique',
  gallery_title_en: 'The brand guidelines',
};

migrate((app) => {
  const c = app.findCollectionByNameOrId('projects');
  try { app.findFirstRecordByData('projects', 'slug', SLUG); return; } catch (_) {}

  // genre : la valeur « Développement web » telle qu'écrite dans ton PocketBase
  const values = c.fields.getByName('genre').values || [];
  const genre = values.find((v) => /web|d[ée]v/i.test(v)) || values.find((v) => /^comm/i.test(v)) || values[0];

  let last = 0;
  app.findAllRecords('projects').forEach((r) => { last = Math.max(last, r.getInt('sort')); });

  const download = (url) => {
    try { return $filesystem.fileFromURL(url, 60); } catch (e) { console.log('[tiktak] image non téléchargée : ' + url); return null; }
  };

  const record = new Record(c);
  record.set('slug', SLUG);
  record.set('genre', genre);
  record.set('sort', last + 1);
  for (const [key, value] of Object.entries(DATA)) {
    if (c.fields.getByName(key)) record.set(key, value);
  }
  record.set('thumbnails', THUMBS.map(download).filter(Boolean));
  const gallery = [], titles = [], titlesEn = [];
  for (const [url, fr, en] of GALLERY) {
    const f = download(url);
    if (f) { gallery.push(f); titles.push(fr); titlesEn.push(en); }
  }
  record.set('gallery', gallery);
  record.set('gallery_titles', titles);
  if (c.fields.getByName('gallery_titles_en')) record.set('gallery_titles_en', titlesEn);
  app.save(record);
}, (app) => {
  try { app.delete(app.findFirstRecordByData('projects', 'slug', SLUG)); } catch (_) {}
});
