/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION — sous-titres des vidéos (accessibilité)
// Ajoute à « projects » un champ fichier « video_captions » (.vtt).
// Le site l'ajoute à la vidéo dans la loupe : les personnes sourdes
// ou malentendantes peuvent suivre les paroles (critère WCAG 1.2.2).
// ==========================================================
migrate((app) => {
  const c = app.findCollectionByNameOrId('projects');
  if (c.fields.getByName('video_captions')) return;
  c.fields.add(new FileField({
    name: 'video_captions',
    maxSelect: 1,
    maxSize: 1048576,
    mimeTypes: ['text/vtt', 'text/plain'],
  }));
  app.save(c);
}, (app) => {
  const c = app.findCollectionByNameOrId('projects');
  if (c.fields.getByName('video_captions')) { c.fields.removeByName('video_captions'); app.save(c); }
});
