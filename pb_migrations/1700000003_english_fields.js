/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION 4 — version anglaise du site (/en/)
// ----------------------------------------------------------
// Ajoute un champ « _en » à côté de chaque texte affiché :
//   projects : title_en, description_en, tags_en, context_en,
//              problem_en, steps_en, result_en, role_en,
//              gallery_title_en, gallery_titles_en
//   skills : title_en, description_en
//   inspirations : name_en      tools : name_en
//   site : stage_en, cv_en (CV en anglais, facultatif)
// Puis remplit ces champs avec une première traduction, SEULEMENT
// s'ils sont vides (tes modifications ne sont jamais écrasées).
// Un champ « _en » laissé vide → le site anglais affiche le français.
// ==========================================================

const MB = 1024 * 1024;

// ---------- traductions de départ ----------
const projects = {
  'pourquoi-la-danse': {
    title_en: 'Why Dance?',
    description_en: 'A video in which dancers answer “What does dance mean to you?” by dancing to their own words.',
    tags_en: ['Capcut', 'Filming', 'Interview'],
    context_en: 'A project made for my baccalaureate exam in Visual Arts. The video “Why Dance?” explores the essence of movement through the testimonies of several dancers.',
    problem_en: '“What does dance mean to you?”: the question put to each dancer, who answers first in words, then with their body.',
    steps_en: [
      'The dancers move against a pitch-black background, with no music at all: the rhythm of their own words guides their bodies.',
      'In the edit, each performer gets their own color filter, except for the last dancer, who appears in black and white.',
      'Silhouettes and voices gradually build up on screen, until they overlap.',
    ],
    result_en: 'This layering creates a visual and sonic crescendo in which words and movement end up merging, conveying the visceral, intimate and liberating power of dance.',
  },
  'evolution-du-temps': {
    title_en: 'The Evolution of Time',
    description_en: 'A three-poster campaign for the Pays de Montbéliard Tourist Office, built around three landmarks.',
    tags_en: ['Illustrator', 'Vector illustration', 'Art direction'],
    context_en: 'A project made during the first year of my BUT MMI degree, as part of a graphic production exercise. The goal: design a poster campaign for the Pays de Montbéliard Tourist Office.',
    problem_en: 'How can three posters tell several sides of Montbéliard, while steering clear of an overly traditional image of the town?',
    steps_en: [
      'Choosing the landmarks: the Castle of the Dukes of Württemberg for the town’s princely roots, the 1870 war memorial for its verticality and emotional weight, and the Peugeot Lion building for its industrial history.',
      'Taglines that each tell a little story — “Le Silence des Héros” (The Silence of Heroes), “Le Rocher aux mille histoires” (The Rock of a Thousand Stories), “L’Écrin du Lion” (The Lion’s Jewel Box) — to spark passers-by’s curiosity.',
      'Clean vector illustration in Adobe Illustrator: simplifying the architectural shapes to keep only the essence of each silhouette, with just three flat colors per building.',
    ],
    result_en: 'A series of three posters. To read as a series, they share the same layout grid and a common signature placed in the same spot: “L’Esthétique du temps” (The Aesthetics of Time). Each poster stands out through its own color atmosphere, in keeping with the elegant spirit the Tourist Office was looking for.',
    role_en: 'Solo project: I handled the whole creative process — art direction (concept and visual choices), vector illustration of the landmarks, layout, and copywriting (finding the titles and slogans).',
    gallery_titles_en: ['The Rock of a Thousand Stories', 'The Silence of Heroes', 'The Lion’s Jewel Box'],
  },
  olyvia: {
    description_en: 'The visual identity of Olyvia!, a website that supports women through menopause, gently and without taboos.',
    tags_en: ['Figma', 'Illustrator', 'Brand guidelines', 'Visual identity'],
    context_en: 'A group project made during the first year of my BUT MMI degree, with Laura Bailly and Izya Thiriet. Olyvia! is a website designed to inform and support women going through menopause, a stage of life that is still too often kept quiet.',
    problem_en: 'How can we talk about menopause without presenting it as a decline, and create an identity that feels reassuring, warm and positive?',
    steps_en: [
      'The moodboard: a soft, luminous mood — women together, watercolor flowers, flat areas of orange, purple and pink — to set a caring tone, far from medical imagery.',
      'The symbol: the lotus flower. It grows at the bottom of the water, in the mud, before blooming at the surface: an image of resilience and rebirth that makes menopause a new chapter rather than an ending. Its symmetrical geometry brings calm and balance, and its purple evokes elevation and enlightenment.',
      'The brand guidelines: a logo in vertical, horizontal and icon versions, a purple, orange, pink and yellow palette, and a warm serif typeface for the name, with an exclamation mark full of energy.',
    ],
    result_en: 'A complete, consistent identity, rolled out from the website to social media — like the end screen of the TikTok videos, carried by the line “Menopause is beginning, your life isn’t ending!”. The slogan “Supporting your body, enlightening your mind” sums up Olyvia!’s promise: to inform gently, without taboos.',
    role_en: 'A three-person group project. I designed the brand guidelines and created the identity’s visuals: the logo and its variations (vertical, horizontal and icon versions) as well as the project’s visuals. I also helped write the rights file and the communication file.',
    gallery_title_en: 'The visuals',
    gallery_titles_en: ['The home page', 'Le Mag', 'The practitioners', 'The flyer', 'The Instagram post', 'The Facebook story'],
  },
};

const skills = {
  'Design graphique & identité visuelle': ['Graphic design & visual identity', 'Logos, brand guidelines and posters designed as consistent systems.'],
  'Direction artistique': ['Art direction', 'Setting a mood, a tone and images that serve the message.'],
  'Réalisation & montage vidéo': ['Video directing & editing', 'From storyboard to color grading, telling a story through rhythm and movement.'],
  'Conception UX & recherche utilisateur': ['UX design & user research', 'Observing, asking and testing before drawing.'],
  "Design d'interface & prototypage": ['Interface design & prototyping', 'Interactive mockups and prototypes in Figma, from wireframe to final design.'],
  'Gestion de projet & travail en équipe': ['Project management & teamwork', 'Planning, sharing out roles and meeting deadlines as a team.'],
};
const inspirations = { 'La mode': 'Fashion', 'Les musées': 'Museums', 'La danse': 'Dance', 'Le BAFA': 'Summer camps' };
const tools = { 'Création': 'Design', 'Vidéo': 'Video', 'Web': 'Web', 'IA': 'AI' };

// ---------- outils ----------
const text = (name, max) => new TextField({ name, max });
const json = (name, maxSize) => new JSONField({ name, maxSize });

function addFields(app, collection, fields) {
  const c = app.findCollectionByNameOrId(collection);
  let changed = false;
  for (const f of fields) {
    if (!c.fields.getByName(f.name)) { c.fields.add(f); changed = true; }
  }
  if (changed) app.save(c);
}

/** Remplit les champs vides d'un enregistrement (sans jamais écraser) */
function fill(app, record, values) {
  let changed = false;
  for (const [k, v] of Object.entries(values)) {
    const raw = record.getString(k).trim(); // champ JSON vide → « null » ou « [] »
    if (raw === '' || raw === 'null' || raw === '[]' || raw === '""') { record.set(k, v); changed = true; }
  }
  if (changed) app.save(record);
}

function each(app, collection, cb) {
  for (const r of app.findAllRecords(collection)) cb(r);
}

migrate((app) => {
  addFields(app, 'projects', [
    text('title_en', 120), text('description_en', 400), json('tags_en', 2000),
    text('context_en', 3000), text('problem_en', 1500), json('steps_en', 8000),
    text('result_en', 3000), text('role_en', 2000),
    text('gallery_title_en', 40), json('gallery_titles_en', 4000),
  ]);
  addFields(app, 'skills', [text('title_en', 120), text('description_en', 500)]);
  addFields(app, 'inspirations', [text('name_en', 60)]);
  addFields(app, 'tools', [text('name_en', 60)]);
  addFields(app, 'site', [
    text('stage_en', 120),
    new FileField({ name: 'cv_en', maxSelect: 1, maxSize: 10 * MB, mimeTypes: ['application/pdf'] }),
  ]);

  each(app, 'projects', (r) => { const t = projects[r.getString('slug')]; if (t) fill(app, r, t); });
  each(app, 'skills', (r) => { const t = skills[r.getString('title')]; if (t) fill(app, r, { title_en: t[0], description_en: t[1] }); });
  each(app, 'inspirations', (r) => { const t = inspirations[r.getString('name')]; if (t) fill(app, r, { name_en: t }); });
  each(app, 'tools', (r) => { const t = tools[r.getString('name')]; if (t) fill(app, r, { name_en: t }); });
  each(app, 'site', (r) => {
    // « du 29 mars au 4 juin 2027 » → « from March 29 to June 4, 2027 »
    if (r.getString('stage') === 'du 29 mars au 4 juin 2027') fill(app, r, { stage_en: 'from March 29 to June 4, 2027' });
  });
}, (app) => {
  const drop = (collection, names) => {
    const c = app.findCollectionByNameOrId(collection);
    names.forEach((n) => c.fields.removeByName(n));
    app.save(c);
  };
  drop('projects', ['title_en', 'description_en', 'tags_en', 'context_en', 'problem_en', 'steps_en', 'result_en', 'role_en', 'gallery_title_en', 'gallery_titles_en']);
  drop('skills', ['title_en', 'description_en']);
  drop('inspirations', ['name_en']);
  drop('tools', ['name_en']);
  drop('site', ['stage_en', 'cv_en']);
});
