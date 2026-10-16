/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// MIGRATION POCKETBASE — crée toutes les collections du site
// ----------------------------------------------------------
// PocketBase l'exécute tout seul au premier démarrage
// (dossier pb_migrations/ placé à côté de l'exécutable).
//
// Règles d'accès :
//  - "" (chaîne vide)  = tout le monde peut lire
//  - null              = réservé aux admins (superusers)
// Les contenus du portfolio sont lisibles par tous, mais
// modifiables seulement depuis l'admin. Les messages du
// formulaire de contact peuvent être CRÉÉS par tout le monde,
// mais seuls les admins peuvent les LIRE.
// ==========================================================

const IMG = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
const MB = 1024 * 1024;
const dates = [
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
];
const publicRead = { listRule: '', viewRule: '', createRule: null, updateRule: null, deleteRule: null };

migrate((app) => {
  // ---------- Projets (« émissions ») ----------
  app.save(new Collection({
    type: 'base',
    name: 'projects',
    ...publicRead,
    fields: [
      { type: 'text', name: 'slug', required: true, max: 80, pattern: '^[a-z0-9-]+$' },
      { type: 'text', name: 'title', required: true, max: 120 },
      { type: 'select', name: 'genre', required: true, maxSelect: 1, values: ['Audiovisuel', 'Graphisme', 'Communication'] },
      { type: 'text', name: 'year', max: 4 },
      { type: 'text', name: 'time', max: 5, pattern: '^[0-2][0-9]:[0-5][0-9]$' },
      { type: 'text', name: 'channel', max: 10 },
      { type: 'text', name: 'color', max: 7, pattern: '^#[0-9A-Fa-f]{6}$' },
      { type: 'text', name: 'description', max: 400 },
      { type: 'json', name: 'tags', maxSize: 2000 },
      { type: 'file', name: 'thumbnails', maxSelect: 6, maxSize: 15 * MB, mimeTypes: IMG },
      { type: 'file', name: 'hero', maxSelect: 1, maxSize: 15 * MB, mimeTypes: IMG },
      { type: 'file', name: 'video_poster', maxSelect: 1, maxSize: 15 * MB, mimeTypes: IMG },
      { type: 'file', name: 'video', maxSelect: 1, maxSize: 500 * MB, mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'] },
      { type: 'file', name: 'gallery', maxSelect: 12, maxSize: 15 * MB, mimeTypes: IMG },
      { type: 'json', name: 'gallery_titles', maxSize: 4000 },
      { type: 'text', name: 'context', max: 3000 },
      { type: 'text', name: 'problem', max: 1500 },
      { type: 'json', name: 'steps', maxSize: 8000 },
      { type: 'text', name: 'result', max: 3000 },
      { type: 'text', name: 'role', max: 2000 },
      { type: 'bool', name: 'has_page' },
      { type: 'number', name: 'sort', onlyInt: true },
      ...dates,
    ],
    indexes: ['CREATE UNIQUE INDEX idx_projects_slug ON projects (slug)'],
  }));

  // ---------- Compétences ----------
  app.save(new Collection({
    type: 'base',
    name: 'skills',
    ...publicRead,
    fields: [
      { type: 'text', name: 'title', required: true, max: 120 },
      { type: 'text', name: 'description', max: 500 },
      { type: 'number', name: 'sort', onlyInt: true },
      ...dates,
    ],
  }));

  // ---------- Inspirations (carrousel « zapping ») ----------
  app.save(new Collection({
    type: 'base',
    name: 'inspirations',
    ...publicRead,
    fields: [
      { type: 'text', name: 'name', required: true, max: 60 },
      { type: 'file', name: 'photos', maxSelect: 3, maxSize: 15 * MB, mimeTypes: IMG },
      { type: 'number', name: 'sort', onlyInt: true },
      ...dates,
    ],
  }));

  // ---------- Outils & technologies ----------
  app.save(new Collection({
    type: 'base',
    name: 'tools',
    ...publicRead,
    fields: [
      { type: 'text', name: 'name', required: true, max: 60 },
      { type: 'text', name: 'file_label', max: 40 },
      { type: 'text', name: 'color', max: 7, pattern: '^#[0-9A-Fa-f]{6}$' },
      { type: 'json', name: 'items', maxSize: 2000 },
      { type: 'number', name: 'sort', onlyInt: true },
      ...dates,
    ],
  }));

  // ---------- Infos générales (1 seule fiche) ----------
  app.save(new Collection({
    type: 'base',
    name: 'site',
    ...publicRead,
    fields: [
      { type: 'text', name: 'stage', max: 120 },
      { type: 'email', name: 'email' },
      { type: 'url', name: 'linkedin' },
      { type: 'text', name: 'linkedin_label', max: 80 },
      { type: 'url', name: 'instagram' },
      { type: 'text', name: 'instagram_label', max: 80 },
      { type: 'url', name: 'behance' },
      { type: 'text', name: 'behance_label', max: 80 },
      { type: 'file', name: 'portrait', maxSelect: 1, maxSize: 15 * MB, mimeTypes: IMG },
      { type: 'file', name: 'cv', maxSelect: 1, maxSize: 10 * MB, mimeTypes: ['application/pdf'] },
      ...dates,
    ],
  }));

  // ---------- Messages du formulaire de contact ----------
  app.save(new Collection({
    type: 'base',
    name: 'messages',
    listRule: null,   // lecture : admins uniquement
    viewRule: null,
    createRule: '',   // tout le monde peut envoyer un message
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: 'text', name: 'nom', required: true, max: 80 },
      { type: 'text', name: 'prenom', required: true, max: 80 },
      { type: 'email', name: 'email', required: true },
      { type: 'text', name: 'message', required: true, min: 2, max: 5000 },
      { type: 'bool', name: 'lu' },
      ...dates,
    ],
  }));

  // ---------- Anti-spam : limite d'envois par adresse IP ----------
  const settings = app.settings();
  settings.rateLimits.enabled = true;
  settings.rateLimits.rules = [
    ...settings.rateLimits.rules.filter((r) => r.label !== 'messages:create'),
    { label: 'messages:create', audience: '@guest', duration: 600, maxRequests: 5 },
  ];
  app.save(settings);
}, (app) => {
  // retour en arrière : on supprime les collections créées
  for (const name of ['messages', 'site', 'tools', 'inspirations', 'skills', 'projects']) {
    try { app.delete(app.findCollectionByNameOrId(name)); } catch (_) {}
  }
});
