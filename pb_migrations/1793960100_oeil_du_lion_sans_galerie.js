/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION — « L'Œil du Lion » : le prototype Figma remplace
// les captures d'écran
// ----------------------------------------------------------
// La page du projet affiche maintenant le prototype interactif
// (champ « link »). On retire donc les captures de la galerie
// et leurs titres. Les 3 miniatures (« thumbnails ») restent :
// elles illustrent le projet dans la liste des projets.
// ==========================================================
migrate((app) => {
  let record;
  try { record = app.findFirstRecordByData('projects', 'slug', 'oeil-du-lion'); } catch (_) { return; }
  record.set('gallery', []);
  record.set('gallery_titles', []);
  if (record.collection().fields.getByName('gallery_titles_en')) record.set('gallery_titles_en', []);
  app.save(record);
}, (app) => {
  // pas de retour en arrière : les captures sont à remettre à la main si besoin
});
