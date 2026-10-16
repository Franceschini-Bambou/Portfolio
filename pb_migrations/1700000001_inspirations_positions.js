/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION 2 — ajoute le champ « positions » aux inspirations
// ----------------------------------------------------------
// C'est le cadrage de chaque photo dans le carrousel, dans le même
// ordre que les photos, au format CSS object-position. Exemples :
//   ["50% 50%", "100% 50%", "50% 50%"]
//   "50% 50%" = centrée, "0% 50%" = calée à gauche,
//   "100% 50%" = calée à droite, "50% 0%" = calée en haut.
// Laisse vide pour tout centrer.
// ==========================================================
migrate((app) => {
  const c = app.findCollectionByNameOrId('inspirations');
  if (!c.fields.getByName('positions')) {
    c.fields.add(new JSONField({ name: 'positions', maxSize: 2000 }));
    app.save(c);
  }
}, (app) => {
  const c = app.findCollectionByNameOrId('inspirations');
  c.fields.removeByName('positions');
  app.save(c);
});
