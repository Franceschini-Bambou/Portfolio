// ==========================================================
// VERSION FRANÇAISE / ANGLAISE
// ----------------------------------------------------------
// • Le français reste aux adresses habituelles (/, /projets/…).
// • L'anglais est sous /en/ (/en/, /en/projects/…).
// • Tous les textes « fixes » du site sont ici, dans les deux
//   langues. Les contenus (projets, compétences…) viennent de
//   PocketBase : champs « _en » pour l'anglais.
// ==========================================================
export type Lang = 'fr' | 'en';
export const langs: Lang[] = ['fr', 'en'];

/** Langue d'une adresse : /en/... → 'en', sinon 'fr' */
export const langOf = (pathname: string): Lang => (/^\/en(\/|$)/.test(pathname) ? 'en' : 'fr');

/** Adresses de chaque page dans les deux langues */
export const routes = {
  home: { fr: '/', en: '/en/' },
  projects: { fr: '/projets/', en: '/en/projects/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  legal: { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  privacy: { fr: '/politique-de-confidentialite/', en: '/en/privacy-policy/' },
} as const;
export type Route = keyof typeof routes;

export const projectUrl = (lang: Lang, slug: string) => `${routes.projects[lang]}${slug}/`;

/** La même page dans l'autre langue (/a-propos/ ↔ /en/about/, /projets/x/ ↔ /en/projects/x/) */
export function switchLang(pathname: string, to: Lang): string {
  const from = langOf(pathname);
  if (from === to) return pathname;
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  // on cherche la page la plus précise d'abord (/projets/ avant /)
  const list = Object.values(routes).sort((a, b) => b[from].length - a[from].length);
  for (const r of list) {
    if (p === r[from]) return r[to];
    if (r[from] !== routes.home[from] && p.startsWith(r[from])) return r[to] + p.slice(r[from].length);
  }
  return routes.home[to];
}

export const ogLocale = { fr: 'fr_FR', en: 'en_GB' } as const;

/** Libellé affiché des genres (la valeur enregistrée reste en français) */
export const genreLabels: Record<Lang, Record<string, string>> = {
  fr: { Tous: 'Tous', Audiovisuel: 'Audiovisuel', 'Design UI/UX': 'Design UI/UX', 'Développement web': 'Développement web' },
  en: { Tous: 'All', Audiovisuel: 'Audiovisual', 'Design UI/UX': 'UI/UX design', 'Développement web': 'Web development' },
};

// ----------------------------------------------------------
// Textes de l'interface
// ----------------------------------------------------------
const fr = {
  // général
  'meta.description': 'Canal BF — le portfolio de Bambou Franceschini, designer graphique & audiovisuel, étudiante en BUT MMI à Montbéliard.',
  'meta.homeTitle': 'Canal BF — Bambou Franceschini, designer graphique & audiovisuel',
  'skip': 'Aller au contenu',
  'channel': 'Chaîne',
  'contactMe': 'Me contacter',
  'internship': 'À la recherche d’un stage',
  // chaînes
  'ch.home': 'Accueil', 'ch.projects': 'Projets', 'ch.about': 'À propos', 'ch.contact': 'Contact',
  // en-tête
  'nav.homeAria': 'Canal BF — retour à l’accueil',
  'nav.channel': 'CHAÎNE ▸',
  'nav.main': 'Navigation principale',
  'nav.mainMobile': 'Navigation principale (mobile)',
  'nav.menu': 'MENU', 'nav.close': 'FERMER',
  'nav.remote': 'TÉLÉCOMMANDE · CANAL BF',
  'lang.label': 'LANGUE',
  'lang.switchAria': 'Read this page in English',
  // pied de page
  'footer.end': 'Fin de<br />transmission',
  'footer.homeAria': 'Retour à la page d’accueil',
  'footer.tagline': 'Designer graphique & audiovisuel — en recherche de stage',
  'footer.sitemap': 'Plan du site',
  'footer.legal': 'Mentions légales',
  'footer.privacy': 'Politique de confidentialité',
  'footer.rights': '© 2026 Bambou Franceschini. Tous droits réservés.',
  'marquee': 'Logiciels utilisés',
  // accueil
  'home.title': 'Accueil',
  'home.live': 'EN DIRECT — CANAL BF',
  'home.year': 'Portfolio — 2026',
  'home.tagline': 'J’aime rendre les idées réalité',
  'home.quote': '«&nbsp;Il y a trois réactions possibles à tout design : oui, non, et <strong class="font-display font-normal text-bordeaux chroma-2">WAHOU&nbsp;!</strong> La troisième est celle que je vise.&nbsp;»',
  'home.onAir': 'Projets à l’antenne',
  'home.tonightOn': 'CE SOIR SUR',
  'home.whoEyebrow': '(01) — Présentation',
  'home.whoTitle': 'Qui<br /><span class="whitespace-nowrap">suis-je&nbsp;?</span>',
  'home.whoLead': 'Je suis Bambou, étudiante en 2e année de BUT MMI à Montbéliard, spécialisée en création numérique.',
  'home.whoText': 'Passionnée par la création en général — design graphique, vidéo, art et même la danse — j’aspire à faire marcher mon imagination au service d’idées claires.',
  'home.more': 'En savoir plus',
  'home.portraitAlt': 'Portrait de Bambou Franceschini',
  'home.tvEyebrow': '(02) — Programme TV',
  'home.tvTitle': 'Ce soir<br />sur Canal BF',
  'home.allProjects': 'Tous les projets',
  // guide des programmes
  'guide.time': 'HORAIRE', 'guide.screen': 'À L’ÉCRAN', 'guide.show': 'ÉMISSION',
  'guide.watch': '▶ REGARDER', 'guide.soon': '▶ BIENTÔT',
  'guide.see': 'voir le projet', 'guide.tools': 'Outils',
  // projets
  'projects.title': 'Mes projets',
  'projects.description': 'Les projets de Bambou Franceschini : audiovisuel, design UI/UX et développement web.',
  'projects.eyebrow': 'CH 02 — Guide des programmes',
  'projects.h1': 'Mes<br />projets',
  'projects.lead': 'Trois émissions au programme, entre audiovisuel, design UI/UX et développement web.',
  'projects.filterAria': 'Filtrer les projets',
  'projects.filter': 'FILTRER ▸',
  // page projet
  'project.label': 'Projet',
  'project.back': 'Retour',
  'project.backLong': ' aux projets',
  'project.backFull': 'Retour aux projets',
  'project.onAir': 'EN DIFFUSION',
  'project.type': 'TYPE', 'project.year': 'ANNÉE', 'project.tools': 'OUTILS',
  'project.zoom': '⤢ AGRANDIR',
  'project.zoomAria': 'Agrandir',
  'project.visual': 'visuel',
  'project.prevImg': 'Image précédente', 'project.nextImg': 'Image suivante',
  'project.captureAlt': 'Capture de la vidéo',
  'project.capture': 'Capture',
  'project.zoomCapture': 'Agrandir la capture',
  'project.zoomImageOf': 'Agrandir l’image de',
  'project.context': 'Contexte', 'project.problem': 'Problématique',
  'project.inSteps': 'En {n} étapes', 'project.approach': 'Démarche', 'project.step': 'Étape',
  'project.swipeZap': '◀ GLISSER POUR ZAPPER ▶', 'project.swipe': '◀ GLISSER ▶',
  'project.broadcast': 'Diffusion', 'project.video': 'Vidéo',
  'project.videoTodo': 'VIDÉO À INTÉGRER', 'project.see': '⤢ VOIR',
  'project.playVideo': 'Lire la vidéo {t} en grand',
  'project.series': 'La série',
  'project.result': 'Résultat', 'project.role': 'Mon rôle', 'project.roleFile': 'mon_role.txt',
  'project.others': 'Autres émissions',
  'project.prev': '◀ ÉMISSION PRÉCÉDENTE', 'project.next': 'ÉMISSION SUIVANTE ▶', 'project.soon': 'BIENTÔT',
  'project.stepFile': 'etape_{n}.txt',
  'project.galleryDefault': 'Les affiches',
  'project.link': 'Voir le site en ligne',
  'project.linkFull': 'Ouvrir le prototype en grand',
  'project.prototype': 'Prototype interactif',
  'project.prototypeHint': '▶ CLIQUE DANS L’ÉCRAN POUR NAVIGUER',
  'project.site': 'Site en ligne',
  'project.notebook': 'Voir le notebook Observable',
  'project.siteHint': '▶ EN DIRECT : NAVIGUE DANS LE SITE',
  // loupe
  'lb.aria': 'Agrandissement', 'lb.close': '✕ FERMER',
  'lb.prev': 'Image précédente', 'lb.next': 'Image suivante',
  'lb.play': 'LECTURE', 'lb.zoom': 'ZOOM',
  // à propos
  'about.title': 'À propos',
  'about.description': 'Bambou Franceschini, étudiante en 2e année de BUT MMI à Montbéliard : compétences, inspirations et outils.',
  'about.eyebrow': 'CH 03 — Portrait de l’artiste',
  'about.h1': 'À<br />propos',
  'about.lead': 'Bambou, étudiante en 2e année de BUT MMI à Montbéliard, spécialisée en création numérique.',
  'about.text': 'Apprendre, créer, imaginer me rythme au quotidien. J’aime apporter de l’originalité et de la couleur à mes projets, et je suis toujours partante pour expérimenter et me lancer dans de nouvelles aventures créatives.',
  'about.skillsEyebrow': '(01) — {n} savoir-faire', 'about.skills': 'Compétences',
  'about.zapping': '(02) — Zapping', 'about.inspirations': 'Mes inspirations créatives',
  'about.inspirationsText': 'Qu’il s’agisse de découvertes culturelles, de l’énergie de la danse ou de moments de partage, voici un petit aperçu de tout ce qui nourrit mon imagination et donne vie à ma créativité au quotidien.',
  'about.photo': 'photo',
  'about.prevCh': 'Chaîne précédente', 'about.nextCh': 'Chaîne suivante', 'about.pickCh': 'Choisir une chaîne',
  'about.toolsEyebrow': '(03) — Régie technique', 'about.tools': 'Outils &amp; technologies',
  // contact
  'contact.title': 'Contact',
  'contact.description': 'Contacter Bambou Franceschini : projet, stage {stage}, ou simple échange.',
  'contact.open': 'ANTENNE OUVERTE',
  'contact.lead': 'Un projet en tête, une opportunité de stage, ou simplement envie d’échanger sur le design ou la danse&nbsp;? N’hésitez pas à m’écrire&nbsp;!',
  'contact.cv': 'Mon CV (PDF)', 'contact.cvTodo': 'CV à ajouter dans PocketBase',
  'contact.lastName': 'NOM', 'contact.firstName': 'PRÉNOM', 'contact.email': 'EMAIL', 'contact.message': 'MESSAGE',
  'contact.honeypot': 'Site web',
  'contact.privacy': 'Vos informations servent uniquement à vous répondre.',
  'contact.more': 'En savoir plus',
  'contact.send': 'Envoyer',
  'contact.sent': 'Message transmis',
  'contact.thanks': 'Merci ! Je vous réponds au plus vite.',
  'contact.sending': 'Transmission en cours…',
  'contact.error': 'Signal perdu… Le message n’est pas parti. Réessayez ou écrivez-moi directement par e-mail.',
  // pages légales / 404
  'legal.eyebrow': 'CH 00 — Service public',
  // écran de chargement
  'boot.aria': 'Chargement du site',
  'boot.power': 'MISE SOUS TENSION',
  'boot.title': 'Réglage<br class="sm:hidden" /> automatique',
  'boot.msgs': 'Réglage de l’antenne…|Calibrage des couleurs…|Chargement des émissions…|Préparation du direct…',
  'boot.start': '▶ Début des programmes',
  'boot.searching': 'RECHERCHE', 'boot.found': '✓ TROUVÉE',
  'boot.skip': 'Passer ▶',
  // zapping
  'snow.searching': 'RECHERCHE DU SIGNAL…',
  'carousel': 'carrousel',
  'carousel.live': 'Chaîne {i} sur {n}',
};

type Dict = Record<keyof typeof fr, string>;

const en: Dict = {
  'meta.description': 'Canal BF — the portfolio of Bambou Franceschini, graphic & audiovisual designer and BUT MMI student in Montbéliard, France.',
  'meta.homeTitle': 'Canal BF — Bambou Franceschini, graphic & audiovisual designer',
  'skip': 'Skip to content',
  'channel': 'Channel',
  'contactMe': 'Contact me',
  'internship': 'Looking for an internship',
  'ch.home': 'Home', 'ch.projects': 'Projects', 'ch.about': 'About', 'ch.contact': 'Contact',
  'nav.homeAria': 'Canal BF — back to home',
  'nav.channel': 'CHANNEL ▸',
  'nav.main': 'Main navigation',
  'nav.mainMobile': 'Main navigation (mobile)',
  'nav.menu': 'MENU', 'nav.close': 'CLOSE',
  'nav.remote': 'REMOTE · CANAL BF',
  'lang.label': 'LANGUAGE',
  'lang.switchAria': 'Lire cette page en français',
  'footer.end': 'End of<br />transmission',
  'footer.homeAria': 'Back to the home page',
  'footer.tagline': 'Graphic & audiovisual designer — looking for an internship',
  'footer.sitemap': 'Site map',
  'footer.legal': 'Legal notice',
  'footer.privacy': 'Privacy policy',
  'footer.rights': '© 2026 Bambou Franceschini. All rights reserved.',
  'marquee': 'Software I use',
  'home.title': 'Home',
  'home.live': 'LIVE — CANAL BF',
  'home.year': 'Portfolio — 2026',
  'home.tagline': 'I love bringing ideas to life',
  'home.quote': '“There are three responses to a piece of design — yes, no, and <strong class="font-display font-normal text-bordeaux chroma-2">WOW!</strong> Wow is the one to aim for.”',
  'home.onAir': 'Projects on air',
  'home.tonightOn': 'TONIGHT ON',
  'home.whoEyebrow': '(01) — Introduction',
  'home.whoTitle': 'Who<br /><span class="whitespace-nowrap">am I?</span>',
  'home.whoLead': 'I’m Bambou, a second-year BUT MMI student in Montbéliard (France), specializing in digital design.',
  'home.whoText': 'Passionate about creating in all its forms — graphic design, video, art and even dance — I aim to put my imagination to work for clear ideas.',
  'home.more': 'Learn more',
  'home.portraitAlt': 'Portrait of Bambou Franceschini',
  'home.tvEyebrow': '(02) — TV guide',
  'home.tvTitle': 'Tonight<br />on Canal BF',
  'home.allProjects': 'All projects',
  'guide.time': 'TIME', 'guide.screen': 'ON SCREEN', 'guide.show': 'SHOW',
  'guide.watch': '▶ WATCH', 'guide.soon': '▶ COMING SOON',
  'guide.see': 'see the project', 'guide.tools': 'Tools',
  'projects.title': 'My projects',
  'projects.description': 'Projects by Bambou Franceschini: audiovisual, UI/UX design and web development.',
  'projects.eyebrow': 'CH 02 — TV guide',
  'projects.h1': 'My<br />projects',
  'projects.lead': 'Three shows on tonight’s schedule, across audiovisual, UI/UX design and web development.',
  'projects.filterAria': 'Filter projects',
  'projects.filter': 'FILTER ▸',
  'project.label': 'Project',
  'project.back': 'Back',
  'project.backLong': ' to projects',
  'project.backFull': 'Back to projects',
  'project.onAir': 'ON AIR',
  'project.type': 'TYPE', 'project.year': 'YEAR', 'project.tools': 'TOOLS',
  'project.zoom': '⤢ ENLARGE',
  'project.zoomAria': 'Enlarge',
  'project.visual': 'visual',
  'project.prevImg': 'Previous image', 'project.nextImg': 'Next image',
  'project.captureAlt': 'Still from the video',
  'project.capture': 'Still',
  'project.zoomCapture': 'Enlarge the still',
  'project.zoomImageOf': 'Enlarge the image of',
  'project.context': 'Context', 'project.problem': 'The challenge',
  'project.inSteps': 'In {n} steps', 'project.approach': 'Approach', 'project.step': 'Step',
  'project.swipeZap': '◀ SWIPE TO ZAP ▶', 'project.swipe': '◀ SWIPE ▶',
  'project.broadcast': 'Broadcast', 'project.video': 'Video',
  'project.videoTodo': 'VIDEO COMING SOON', 'project.see': '⤢ VIEW',
  'project.playVideo': 'Play the video {t} full screen',
  'project.series': 'The series',
  'project.result': 'Result', 'project.role': 'My role', 'project.roleFile': 'my_role.txt',
  'project.others': 'Other shows',
  'project.prev': '◀ PREVIOUS SHOW', 'project.next': 'NEXT SHOW ▶', 'project.soon': 'COMING SOON',
  'project.stepFile': 'step_{n}.txt',
  'project.galleryDefault': 'The posters',
  'project.link': 'Visit the live site',
  'project.linkFull': 'Open the prototype full screen',
  'project.prototype': 'Interactive prototype',
  'project.prototypeHint': '▶ CLICK INSIDE THE SCREEN TO NAVIGATE',
  'project.site': 'Live website',
  'project.notebook': 'See the Observable notebook',
  'project.siteHint': '▶ LIVE: BROWSE THE SITE',
  'lb.aria': 'Enlarged view', 'lb.close': '✕ CLOSE',
  'lb.prev': 'Previous image', 'lb.next': 'Next image',
  'lb.play': 'PLAYING', 'lb.zoom': 'ZOOM',
  'about.title': 'About',
  'about.description': 'Bambou Franceschini, second-year BUT MMI student in Montbéliard, France: skills, inspirations and tools.',
  'about.eyebrow': 'CH 03 — Portrait of the artist',
  'about.h1': 'About<br />me',
  'about.lead': 'Bambou, a second-year BUT MMI student in Montbéliard (France), specializing in digital design.',
  'about.text': 'Learning, creating and imagining set the pace of my everyday life. I love bringing originality and color to my projects, and I’m always up for experimenting and setting off on new creative adventures.',
  'about.skillsEyebrow': '(01) — {n} areas of expertise', 'about.skills': 'Skills',
  'about.zapping': '(02) — Channel hopping', 'about.inspirations': 'My creative inspirations',
  'about.inspirationsText': 'From cultural discoveries to the energy of dance and moments shared with others, here is a little glimpse of everything that feeds my imagination and brings my creativity to life every day.',
  'about.photo': 'photo',
  'about.prevCh': 'Previous channel', 'about.nextCh': 'Next channel', 'about.pickCh': 'Choose a channel',
  'about.toolsEyebrow': '(03) — Control room', 'about.tools': 'Tools &amp; technologies',
  'contact.title': 'Contact',
  'contact.description': 'Get in touch with Bambou Franceschini: a project, an internship {stage}, or just a chat.',
  'contact.open': 'LINES ARE OPEN',
  'contact.lead': 'Got a project in mind, an internship opportunity, or simply want to talk about design or dance? Feel free to write to me!',
  'contact.cv': 'My CV (PDF)', 'contact.cvTodo': 'CV to be added in PocketBase',
  'contact.lastName': 'LAST NAME', 'contact.firstName': 'FIRST NAME', 'contact.email': 'EMAIL', 'contact.message': 'MESSAGE',
  'contact.honeypot': 'Website',
  'contact.privacy': 'Your details are only used to reply to you.',
  'contact.more': 'Learn more',
  'contact.send': 'Send',
  'contact.sent': 'Message sent',
  'contact.thanks': 'Thank you! I’ll get back to you as soon as possible.',
  'contact.sending': 'Transmitting…',
  'contact.error': 'Signal lost… Your message wasn’t sent. Please try again or email me directly.',
  'legal.eyebrow': 'CH 00 — Public service',
  'boot.aria': 'Loading the website',
  'boot.power': 'POWER ON',
  'boot.title': 'Auto<br class="sm:hidden" /> tuning',
  'boot.msgs': 'Adjusting the antenna…|Calibrating colors…|Loading the shows…|Getting ready to go live…',
  'boot.start': '▶ Programs starting',
  'boot.searching': 'SEARCHING', 'boot.found': '✓ FOUND',
  'boot.skip': 'Skip ▶',
  'snow.searching': 'SEARCHING FOR SIGNAL…',
  'carousel': 'carousel',
  'carousel.live': 'Channel {i} of {n}',
};

export const ui: Record<Lang, Dict> = { fr, en };
export type UiKey = keyof typeof fr;

/** t('home.title') — avec remplacement : t('project.inSteps', { n: 3 }) */
export function useT(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}) =>
    ui[lang][key].replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)); // {x} sans valeur : laissé tel quel
}
