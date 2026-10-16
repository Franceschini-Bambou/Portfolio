// ==========================================================
// CONTENU DE RÉFÉRENCE DU SITE
// ----------------------------------------------------------
// Ce fichier sert à deux choses :
//  1. remplir PocketBase la première fois (npm run seed) ;
//  2. servir de « secours » si PocketBase n'est pas joignable
//     au moment du build (le site s'affiche quand même).
// Les noms d'images renvoient aux fichiers de src/assets/images/.
// Une fois PocketBase rempli, c'est dans l'admin PocketBase
// que tu modifies tes contenus.
// ==========================================================

export const site = {
  stage: 'du 29 mars au 4 juin 2027',
  email: 'franceschini.bambou22@gmail.com',
  linkedin: 'https://www.linkedin.com/in/Bambou-Franceschini',
  linkedin_label: 'Bambou-Franceschini',
  instagram: 'https://www.instagram.com/bambou.franceschini',
  instagram_label: 'bambou.franceschini',
  behance: 'https://www.behance.net/bamboufrances',
  behance_label: 'bamboufrances',
  portrait: 'portrait.png',
  cv: null, // ton CV en PDF : à ajouter dans PocketBase (collection « site »)
};

export const projects = [
  {
    slug: 'pourquoi-la-danse',
    title: 'Pourquoi la danse ?',
    genre: 'Audiovisuel',
    year: '2024',
    time: '20:30',
    channel: 'CH 02',
    color: '#4F86A6',
    description:
      "Une vidéo où des danseurs répondent à « Qu'est-ce que la danse vous évoque ? » en dansant sur leurs propres mots.",
    tags: ['Capcut', 'Tournage', 'Interview'],
    thumbnails: ['danse.png'],
    hero: 'danse.png',
    video_poster: 'danse-video.png',
    video: null, // ta vidéo .mp4 : à ajouter dans PocketBase
    gallery: [],
    gallery_titles: [],
    context:
      "Projet réalisé pour mon épreuve du baccalauréat en spécialité Arts Plastiques. La vidéo « Pourquoi la danse ? » interroge l'essence du mouvement à travers les témoignages de plusieurs danseurs.",
    problem:
      "« Qu'est-ce que la danse vous évoque ? » : la question posée à chaque danseur, qui y répond avec ses mots, puis avec son corps.",
    steps: [
      'Les danseurs évoluent sur un fond noir absolu, sans aucune musique : le rythme de leurs propres mots guide leurs corps.',
      "Au montage, chaque interprète reçoit un filtre de couleur distinct, à l'exception de la dernière danseuse, qui apparaît en noir et blanc.",
      "Les silhouettes et les voix s'accumulent progressivement à l'écran, jusqu'à se superposer.",
    ],
    result:
      'Cette superposition crée un crescendo visuel et sonore où la parole et le mouvement finissent par se confondre, pour illustrer la force viscérale, intime et libératrice de la danse.',
    role: '',
    has_page: true,
    sort: 1,
  },
  {
    slug: 'evolution-du-temps',
    title: "L'évolution du temps",
    genre: 'Graphisme',
    year: '2026',
    time: '21:15',
    channel: 'CH 05',
    color: '#E2B84A',
    description:
      "Une campagne de trois affiches pour l'Office de Tourisme du Pays de Montbéliard, autour de trois monuments.",
    tags: ['Illustrator', 'Illustration vectorielle', 'Direction artistique'],
    thumbnails: ['chateau.png', 'statue.png', 'peugeot.png'],
    hero: null,
    video_poster: null,
    video: null,
    gallery: ['chateau.png', 'statue.png', 'peugeot.png'],
    gallery_titles: ['Le Rocher aux mille histoires', 'Le Silence des Héros', "L'Écrin du Lion"],
    context:
      "Projet réalisé lors de ma première année de BUT MMI, dans le cadre d'un exercice de production graphique. L'objectif : concevoir une campagne d'affichage pour l'Office de Tourisme du Pays de Montbéliard.",
    problem:
      'Comment raconter plusieurs facettes de Montbéliard en trois affiches, en écartant une vision trop classique de la ville ?',
    steps: [
      "Le choix des monuments : le Château des Ducs de Wurtemberg pour les racines princières, le Monument aux morts de 1870 pour sa verticalité et sa charge émotionnelle, et l'immeuble du Lion Peugeot pour l'histoire industrielle.",
      "Des accroches qui racontent une petite histoire — « Le Silence des Héros », « Le Rocher aux mille histoires », « L'Écrin du Lion » — pour piquer la curiosité des passants.",
      "Une illustration vectorielle épurée sur Adobe Illustrator : simplifier les formes architecturales pour ne garder que l'essentiel de la silhouette, avec seulement trois aplats de couleur par bâtiment.",
    ],
    result:
      "Une série de trois affiches. Pour assurer la logique de série, elles partagent une grille de composition identique et une signature commune placée au même endroit : « L'Esthétique du temps ». Chaque affiche se distingue par une atmosphère colorimétrique spécifique, en accord avec l'esprit élégant attendu par l'Office de Tourisme.",
    role:
      "Projet individuel : j'ai géré l'intégralité du processus créatif — la direction artistique (concept et choix visuels), l'illustration vectorielle des monuments, la mise en page, ainsi que la conception-rédaction (recherche des titres et des slogans).",
    has_page: true,
    sort: 2,
  },
  {
    slug: 'olyvia',
    title: 'OLYVIA!',
    genre: 'Communication',
    year: '2026',
    time: '22:00',
    channel: 'CH 06',
    color: '#8CBF6F',
    description:
      "Maquette et charte graphique d'un site internet pour aider les femmes à traverser la ménopause.",
    tags: ['Figma', 'Illustrator'],
    thumbnails: ['olyvia.png'],
    hero: 'olyvia.png',
    video_poster: null,
    video: null,
    gallery: [],
    gallery_titles: [],
    context: '',
    problem: '',
    steps: [],
    result: '',
    role: '',
    has_page: false, // passe à true dans PocketBase quand la page sera prête
    sort: 3,
  },
];

export const skills = [
  { title: 'Design graphique & identité visuelle', description: 'Logos, chartes et affiches pensés comme des systèmes cohérents.' },
  { title: 'Direction artistique', description: 'Définir une ambiance, un ton et des images qui servent le message.' },
  { title: 'Réalisation & montage vidéo', description: "Du story-board à l'étalonnage, raconter par le rythme et le mouvement." },
  { title: 'Conception UX & recherche utilisateur', description: 'Observer, interroger et tester avant de dessiner.' },
  { title: "Design d'interface & prototypage", description: 'Maquettes et prototypes interactifs sur Figma, du wireframe au rendu final.' },
  { title: 'Gestion de projet & travail en équipe', description: 'Planifier, répartir les rôles et tenir les délais en groupe.' },
].map((s, i) => ({ ...s, sort: i + 1 }));

export const inspirations = [
  { name: 'La mode', photos: ['mode1.png', 'mode2.png'] },
  { name: 'Les musées', photos: ['musee1.png', 'musee2.png'] },
  { name: 'La danse', photos: ['danse1.png', 'danse2.png', 'danse3.png'] },
  { name: 'Le BAFA', photos: ['bafa1.png', 'bafa2.png'] },
].map((s, i) => ({ ...s, sort: i + 1 }));

export const tools = [
  { name: 'Création', file_label: 'creation.app', color: '#E2B84A', items: ['Figma', 'Illustrator', 'Photoshop', 'Procreate'] },
  { name: 'Vidéo', file_label: 'video.app', color: '#4F86A6', items: ['Capcut'] },
  { name: 'Web', file_label: 'web.app', color: '#8CBF6F', items: ['HTML / CSS', 'JavaScript', 'WordPress'] },
  { name: 'IA', file_label: 'ia.app', color: '#DBBCDA', items: ['Claude', 'Gemini', 'Copilot'] },
].map((s, i) => ({ ...s, sort: i + 1 }));

// Bande défilante de l'accueil
export const marquee = ['FIGMA', 'ILLUSTRATOR', 'PHOTOSHOP', 'PROCREATE', 'CAPCUT', 'HTML / CSS', 'JAVASCRIPT', 'WORDPRESS', 'CLAUDE', 'GEMINI', 'COPILOT'];
