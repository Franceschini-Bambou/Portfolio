/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION 3 — titre de la galerie, réglable par projet
// ----------------------------------------------------------
// Champ « gallery_title » de la collection projects.
// Vide = « Les affiches ». Exemple : « Les visuels ».
// Le site s'adapte tout seul : fenêtre « visuels.tv »,
// numéros « VIS 01, VIS 02… ».
// ==========================================================
migrate((app) => {
  const c = app.findCollectionByNameOrId('projects');
  if (!c.fields.getByName('gallery_title')) {
    c.fields.add(new TextField({ name: 'gallery_title', max: 40 }));
    app.save(c);
  }
}, (app) => {
  const c = app.findCollectionByNameOrId('projects');
  c.fields.removeByName('gallery_title');
  app.save(c);
});
