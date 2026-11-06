/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION — « L'Œil du Lion » : le brandboard dans la galerie
// ----------------------------------------------------------
// En haut de la page : le prototype Figma (champ « link »).
// Plus bas, la galerie montre la planche de la charte graphique,
// prise dans pb_seed/oeil-du-lion-brandboard.jpg.
// ==========================================================
migrate((app) => {
  let record;
  try { record = app.findFirstRecordByData('projects', 'slug', 'oeil-du-lion'); } catch (_) { return; }
  const path = $filepath.join(app.dataDir(), '..', 'pb_seed', 'oeil-du-lion-brandboard.jpg');
  let file;
  try { file = $filesystem.fileFromPath(path); } catch (e) { console.log('[oeil-du-lion] brandboard introuvable : ' + path); return; }
  record.set('gallery', [file]);
  record.set('gallery_title', 'La charte graphique');
  record.set('gallery_titles', ['Le brandboard']);
  const has = (n) => !!record.collection().fields.getByName(n);
  if (has('gallery_title_en')) record.set('gallery_title_en', 'The brand guidelines');
  if (has('gallery_titles_en')) record.set('gallery_titles_en', ['The brand board']);
  app.save(record);
}, (app) => {});
