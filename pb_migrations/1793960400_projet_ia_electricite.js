/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION — nouveau projet « Comprendre l'électricité de l'IA »
// (SAÉ 303 en binôme avec Thomas Perruchot, défi Open Data
// University × ADEME, développement web / datavisualisation)
// ----------------------------------------------------------
// 1. Ajoute un champ « notebook » (lien facultatif) : la page
//    projet affiche alors un bouton « Voir le notebook Observable ».
// 2. Crée la fiche FR + EN. Le site en ligne s'affiche dans la
//    télé du haut (champ « link »). Les miniatures sont des
//    captures du site faites par image.thum.io.
// Placé après les autres projets : l'accueil n'en affiche que 3.
// ==========================================================

const SLUG = 'electricite-ia';
const SITE = 'https://sae303-thomas-bambou.netlify.app';
const shot = (path) => `https://image.thum.io/get/width/1400/crop/1000/noanimate/${SITE}${path}`;
const THUMBS = [shot('/requete'), shot('/mesure'), shot('/usage')];

const DATA = {
  title: 'Comprendre l’électricité de l’IA',
  title_en: 'Making Sense of AI’s Electricity Use',
  year: '2026',
  time: '23:45',
  channel: 'CH 09',
  color: '#8CBF6F',
  link: SITE,
  notebook: 'https://observablehq.com/@mmi-montbeliard/sae-303-gr-21/2',
  has_page: true,
  description: 'Un site de datajournalisme réalisé en binôme, qui apprend à lire les chiffres sur la consommation électrique de l’IA à partir de données ouvertes réelles.',
  description_en: 'A data-journalism website made in a pair, which teaches readers how to read the figures on AI’s electricity use, using real open data.',
  tags: ['Observable', 'Observable Plot', 'Astro', 'Tailwind', 'Open data', 'Netlify'],
  tags_en: ['Observable', 'Observable Plot', 'Astro', 'Tailwind', 'Open data', 'Netlify'],
  context: 'SAÉ 303 de 2e année de BUT MMI, en binôme avec Thomas Perruchot. Nous avons relevé un défi de l’Open Data University (association Latitudes) proposé par l’ADEME : « L’impact environnemental de l’IA générative ». Le but : publier un site qui raconte, avec des données ouvertes réelles, une histoire utile à un public précis. Le nôtre : des citoyens qui utilisent l’IA sans aucun ordre de grandeur en tête. Et cette fois, personne ne nous avait préparé la donnée.',
  context_en: 'SAÉ 303 in the second year of my BUT MMI degree, in a pair with Thomas Perruchot. We took on an Open Data University challenge (run by the Latitudes association) set by ADEME, the French environment agency: “The environmental impact of generative AI”. The goal: publish a website that tells a useful story to a specific audience, using real open data. Ours: people who use AI without any sense of scale. And this time, nobody had prepared the data for us.',
  problem: 'Ce que mesure le laboratoire, est-ce ce que consomment nos vraies conversations ?',
  problem_en: 'Is what the lab measures what our real conversations actually consume?',
  steps: [
    'Les données : croiser deux sources qui ne disent pas la même chose. AI Energy Score mesure les modèles en laboratoire (166 mesures retenues), Compar:IA estime la consommation de vraies conversations (18 326 réponses exploitables). Dans le notebook Observable, nous avons répondu aux 5 questions avant de dessiner, documenté le nettoyage et apparié à la main les 9 modèles communs, l’appariement automatique créant de fausses paires.',
    'Les visualisations : quatre graphiques, chacun avec sa question, son dénominateur et son alternative textuelle. Le coût d’une requête selon la tâche, la mesure face à l’estimation, l’effet du raisonnement, et un simulateur où l’on choisit son modèle et son nombre de questions. Pour parler à tout le monde, les wattheures deviennent du temps d’ampoule LED (1 Wh = 6 minutes d’une ampoule de 10 W).',
    'Le site : un récit en quatre temps (contexte, exploration, révélation, conclusion) sur la base Astro du cours, publié sur Netlify. Les trois premiers graphiques sont générés au build, sans JavaScript ; seul le simulateur est calculé chez le lecteur. Une page Méthode détaille les sources, licences, traitements et biais, avec des données préfiltrées à télécharger. Le site est aussi publié comme réutilisation sur data.gouv.fr.',
  ],
  steps_en: [
    'The data: cross-checking two sources that don’t say the same thing. AI Energy Score measures models in the lab (166 measurements kept), while Compar:IA estimates the consumption of real conversations (18,326 usable responses). In the Observable notebook, we answered the 5 questions to ask before drawing, documented the cleaning, and matched the 9 shared models by hand, since automatic matching created false pairs.',
    'The visualisations: four charts, each with its own question, denominator and text alternative. The cost of a request depending on the task, measurement versus estimate, the effect of reasoning, and a simulator where you pick your model and number of questions. To speak to everyone, watt-hours become LED bulb time (1 Wh = 6 minutes of a 10 W bulb).',
    'The website: a four-part story (context, exploration, revelation, conclusion) built on the course’s Astro starter and published on Netlify. The first three charts are generated at build time, with no JavaScript; only the simulator runs in the reader’s browser. A Method page details sources, licences, processing and biases, with pre-filtered data to download. The site is also published as a reuse on data.gouv.fr, the French open data portal.',
  ],
  result: 'Le message central : il n’existe pas de chiffre unique fiable pour dire qu’une requête consomme X Wh. Pour deux modèles de même taille, l’estimation donne le même chiffre quand la mesure trouve un écart de ×14, et d’une tâche à l’autre, on passe de 0,21 seconde à 32 minutes d’ampoule LED. Plutôt qu’un chiffre choc, le site laisse au lecteur trois réflexes : mesuré ou estimé ? Quel modèle ? Quelle tâche ?',
  result_en: 'The key message: there is no single reliable figure for how many Wh a request uses. For two models of the same size, the estimate gives the same number while the measurement finds a ×14 gap, and from one task to another, it ranges from 0.21 seconds to 32 minutes of LED bulb time. Rather than a shock figure, the site leaves readers with three reflexes: measured or estimated? Which model? Which task?',
  role: 'Projet en binôme avec Thomas Perruchot. Comme le demandait la SAÉ, nous avons tous les deux travaillé sur la donnée et sur le site : exploration et nettoyage dans le notebook Observable, visualisations et leurs fiches, récit et intégration dans Astro, page Méthode et publication sur data.gouv.fr.',
  role_en: 'A pair project with Thomas Perruchot. As the brief required, we both worked on the data and on the website: exploring and cleaning the data in the Observable notebook, the visualisations and their spec sheets, the story and its integration in Astro, the Method page and the data.gouv.fr publication.',
};

migrate((app) => {
  const c = app.findCollectionByNameOrId('projects');
  if (!c.fields.getByName('notebook')) {
    c.fields.add(new URLField({ name: 'notebook' }));
    app.save(c);
  }
  try { app.findFirstRecordByData('projects', 'slug', SLUG); return; } catch (_) {}

  const values = c.fields.getByName('genre').values || [];
  const genre = values.find((v) => /web|d[ée]v/i.test(v)) || values.find((v) => /^comm/i.test(v)) || values[0];

  let last = 0;
  app.findAllRecords('projects').forEach((r) => { last = Math.max(last, r.getInt('sort')); });

  const download = (url) => {
    try { return $filesystem.fileFromURL(url, 90); } catch (e) { console.log('[electricite-ia] capture non téléchargée : ' + url); return null; }
  };

  const record = new Record(c);
  record.set('slug', SLUG);
  record.set('genre', genre);
  record.set('sort', last + 1);
  for (const [key, value] of Object.entries(DATA)) {
    if (c.fields.getByName(key)) record.set(key, value);
  }
  record.set('thumbnails', THUMBS.map(download).filter(Boolean));
  app.save(record);
}, (app) => {
  try { app.delete(app.findFirstRecordByData('projects', 'slug', SLUG)); } catch (_) {}
  const c = app.findCollectionByNameOrId('projects');
  if (c.fields.getByName('notebook')) { c.fields.removeByName('notebook'); app.save(c); }
});
