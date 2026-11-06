/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION — nouveau projet « L'Œil du Lion »
// (configurateur de lunettes, TP de design interactif R303)
// ----------------------------------------------------------
// 1. Ajoute à la collection projects un champ « link » (lien
//    externe facultatif : ici, le prototype Figma). Le site
//    affiche alors un bouton « Tester le prototype ».
// 2. Crée la fiche du projet, en français et en anglais, avec
//    ses images téléchargées directement depuis Figma.
//
// Le projet est placé APRÈS les autres (sort = dernier + 1) :
// l'accueil n'affiche que les 3 premiers, il ne change donc pas.
//
// Si la fiche existe déjà (même slug), rien n'est modifié.
// Si une image ne se télécharge pas (lien Figma expiré), la
// fiche est quand même créée : ajoute l'image à la main dans
// l'admin (export PNG du cadre depuis Figma).
// ==========================================================

const SLUG = 'oeil-du-lion';
const PROTOTYPE = 'https://www.figma.com/proto/5zynsw0orSstOb2QjiTZAF/maquetteLunettes_Bambou-Franceschini?node-id=18-15&page-id=18%3A14&starting-point-node-id=18%3A15';

// Captures des écrans de la maquette Figma (liens temporaires)
const THUMBS = [
  'https://www.figma.com/api/mcp/asset/2c819649-ef72-4b7d-b752-7e297435e16d.png', // accueil (haut de page)
  'https://www.figma.com/api/mcp/asset/553eaa98-da28-454d-8e98-5910aa3005b6.png', // configurateur
  'https://www.figma.com/api/mcp/asset/b686ffea-a54f-4fdc-b73d-189521168fac.png', // cartes des modèles
];
const GALLERY = [
  ['https://www.figma.com/api/mcp/asset/b8feded8-958d-4512-9798-90609a5b505b.png', 'L’accueil', 'The home page'],
  ['https://www.figma.com/api/mcp/asset/553eaa98-da28-454d-8e98-5910aa3005b6.png', 'Le configurateur', 'The configurator'],
  ['https://www.figma.com/api/mcp/asset/edeff57b-4e8d-4303-a83b-58c0b1b3f72b.png', 'Le panier', 'The cart'],
  ['https://www.figma.com/api/mcp/asset/5af54132-116b-48df-bf46-9730cbbd472a.png', 'Nos modèles', 'Our frames'],
  ['https://www.figma.com/api/mcp/asset/d4159a14-4fa1-4ac8-b3ee-1187fb088b67.png', 'La boutique à Belfort', 'The Belfort shop'],
  ['https://www.figma.com/api/mcp/asset/4bc75e6b-b2be-4f22-b9ab-c3026a93c1df.png', 'La charte graphique', 'The brand board'],
  ['https://www.figma.com/api/mcp/asset/82ccd419-9169-4539-b7b5-a95cb2796718.png', 'Les tests utilisateurs', 'The user tests'],
];

const DATA = {
  title: 'L’Œil du Lion',
  title_en: 'L’Œil du Lion',
  year: '2026',
  time: '22:45',
  channel: 'CH 07',
  color: '#E2B84A',
  description: 'Un configurateur de lunettes pour un opticien de Belfort : on compose sa paire en quelques minutes, de la couleur de la monture à la teinte des verres.',
  description_en: 'A glasses configurator for an optician in Belfort: you design your own pair in a few minutes, from the frame colour to the lens tint.',
  tags: ['Figma', 'Illustrator', 'Prototype cliquable', 'Tests utilisateurs'],
  tags_en: ['Figma', 'Illustrator', 'Clickable prototype', 'User testing'],
  context: 'Projet réalisé en 2e année de BUT MMI, en design d’expérience (ressource R303). La consigne : concevoir un site configurateur de lunettes pour le persona tiré au sort lors de notre travail sur le scénario usager. Le mien, Marie, enseignante de 38 ans, cherche un achat simple et fiable. J’ai donc imaginé L’Œil du Lion, un opticien de Belfort aux montures fabriquées dans le Jura.',
  context_en: 'A project made in the second year of my BUT MMI degree, in experience design (module R303). The brief: design a glasses configurator website for the persona we drew at random during our user-scenario work. Mine, Marie, a 38-year-old teacher, wants a simple and reliable purchase. So I came up with L’Œil du Lion, an optician in Belfort whose frames are made in the nearby Jura.',
  problem: 'Comment permettre à Marie de personnaliser sa paire et d’accéder rapidement aux informations utiles, sans se perdre dans les options ?',
  problem_en: 'How can Marie personalise her glasses and quickly find the information she needs, without getting lost in the options?',
  steps: [
    'La charte graphique : un logo où un œil prend la place du « O » de LION, un vert profond (#043416) et un jaune lumineux (#FFF56B), Urbanist pour les titres et DM Sans pour le texte. Les montures, redessinées en vectoriel sur Illustrator, deviennent les motifs de la marque.',
    'La maquette cliquable sur Figma : accueil, configurateur, panier, catalogue des modèles et page de la boutique à Belfort, avec des fenêtres pour la gravure, l’étui, le partage et la prise de rendez-vous. Dans le configurateur, on choisit séparément la couleur de la monture et des branches, puis les verres et les options.',
    'Les tests utilisateurs : cinq testeurs ont pris en main le prototype et répondu à quatre questions (à quoi sert le site, est-il facile à utiliser, ont-ils envie d’y revenir, qu’évoque son esthétique), avant que j’en tire un bilan.',
  ],
  steps_en: [
    'The brand guidelines: a logo where an eye replaces the “O” in LION, a deep green (#043416) and a bright yellow (#FFF56B), Urbanist for headings and DM Sans for body text. The frames, redrawn as vectors in Illustrator, become the brand’s patterns.',
    'The clickable Figma mockup: home page, configurator, cart, frame catalogue and a page for the Belfort shop, with pop-ups for engraving, the case, sharing and booking an appointment. In the configurator, you pick the frame and temple colours separately, then the lenses and extras.',
    'User testing: five testers tried out the prototype and answered four questions (what is the site for, is it easy to use, would they come back, what does its look evoke), and I wrote up a report from their answers.',
  ],
  result: 'Les cinq testeurs ont compris tout de suite à quoi sert le site, et quatre sur cinq le réutiliseraient. Les mots qui reviennent : « épuré », « minimaliste », « calme », et même « pas un site de scam ». Le principal point à améliorer est le défilement des options dans le configurateur : la piste retenue est de découper la personnalisation en étapes avec un bouton « Suivant », et d’enrichir la collection de nouvelles formes.',
  result_en: 'All five testers understood straight away what the site was for, and four out of five would use it again. The words that kept coming up: “clean”, “minimalist”, “calm” — and even “not a scam site”. The main thing to improve is scrolling through the options in the configurator: the next step would be to split customisation into steps with a “Next” button, and to add new frame shapes to the collection.',
  role: 'Projet individuel : charte graphique, dessin vectoriel des montures, wireframes, maquette et prototype cliquable sur Figma, puis organisation des tests utilisateurs et rédaction du bilan.',
  role_en: 'Solo project: brand guidelines, vector drawings of the frames, wireframes, mockup and clickable prototype in Figma, then running the user tests and writing up the report.',
  gallery_title: 'Les écrans',
  gallery_title_en: 'The screens',
  has_page: true,
  link: PROTOTYPE,
};

migrate((app) => {
  const c = app.findCollectionByNameOrId('projects');

  // 1. champ « link »
  if (!c.fields.getByName('link')) {
    c.fields.add(new URLField({ name: 'link' }));
    app.save(c);
  }

  // 2. la fiche existe déjà ? on n'y touche pas
  try { app.findFirstRecordByData('projects', 'slug', SLUG); return; } catch (_) {}

  // genre : la valeur « Design UI/UX » telle qu'écrite dans ton PocketBase
  const values = c.fields.getByName('genre').values || [];
  const genre = values.find((v) => /ui|ux/i.test(v)) || values.find((v) => /^graph/i.test(v)) || values[0];

  // dernier rang + 1 → hors des 3 projets de l'accueil
  let last = 0;
  app.findAllRecords('projects').forEach((r) => { last = Math.max(last, r.getInt('sort')); });

  const download = (url) => {
    try { return $filesystem.fileFromURL(url, 60); } catch (e) { console.log('[oeil-du-lion] image non téléchargée : ' + url); return null; }
  };

  const record = new Record(c);
  record.set('slug', SLUG);
  record.set('genre', genre);
  record.set('sort', last + 1);
  for (const [key, value] of Object.entries(DATA)) {
    if (c.fields.getByName(key)) record.set(key, value);
  }

  record.set('thumbnails', THUMBS.map(download).filter(Boolean));

  // galerie : on garde chaque titre aligné avec son image
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
  const c = app.findCollectionByNameOrId('projects');
  if (c.fields.getByName('link')) { c.fields.removeByName('link'); app.save(c); }
});
