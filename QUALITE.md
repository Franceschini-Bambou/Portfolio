# QUALITÉ — Canal BF (portfolio de Bambou Franceschini)

Site contrôlé : **https://portfolio.bambou-franceschini.fr** (site statique Astro, contenu lu au build dans PocketBase sur https://api.bambou-franceschini.fr, hébergé sur le VPS de l'IUT).
Contrôle réalisé le **12 novembre 2026** sur le build local, puis **revérifié sur le site en ligne le 16 novembre 2026** après déploiement des corrections (voir la section 5).

## Ce qui rend ce site particulier (et donc ce qu'il faut contrôler)

Les critères ci-dessous ne sont pas une liste générique : ils viennent des choix propres à Canal BF.

| Particularité du site | Risque | Domaine |
|---|---|---|
| Univers « télé rétro » : écran de chargement, zapping, scanlines, bande défilante, textes en aberration chromatique | mouvements gênants, contraste des textes décoratifs, contenu qui bouge sans arrêt | Accessibilité |
| Polices d'affichage (Bungee, VT323) + Roboto | poids, texte qui « saute » au chargement | Sobriété |
| Projets visuels : affiches, captures de pages web très hautes, vidéo | poids des images, vidéo sans sous-titres | Sobriété, accessibilité |
| Pages projet qui affichent un **prototype Figma** ou un **site en direct** (iframe) | plusieurs Mo chargés sans le vouloir, **cookies tiers** déposés sans consentement | Sobriété, juridique |
| Site **bilingue** FR / EN, contenu dans PocketBase | pages en double pour Google, langue mal déclarée | Référencement |
| Formulaire de contact (nom, e-mail, message stockés dans PocketBase) | données personnelles | Juridique |
| Projets réalisés en binôme ou avec des données publiques | droits d'auteur, licences | Juridique |

## Outils utilisés

| Outil | Pour quoi |
|---|---|
| **axe-core 4** (moteur des extensions axe DevTools / Lighthouse), lancé par script Playwright | erreurs d'accessibilité WCAG 2.2 A/AA, sur 12 pages × 2 largeurs (1440 px et 390 px) |
| **Lighthouse 12** (mobile et desktop) | performance, poids, Core Web Vitals, SEO, bonnes pratiques |
| Calcul des contrastes (formule WCAG) sur les couleurs de la charte | contrastes de la palette |
| Test clavier (Tab / Entrée) automatisé avec Playwright | boutons ajoutés, façade des iframes |
| Lecture du HTML généré (`dist/`) et du code source | balises SEO, sitemap, `lang`, `hreflang`, textes alternatifs |
| Lecture des textes légaux face à la loi (LCEN art. 6, RGPD art. 13) | mentions légales, confidentialité |

> Les mesures ont été faites sur le build du site (`astro build` servi en local), avec la même structure que le site en ligne. Le contenu de test comptait moins d'images que le vrai site : les poids réels des pages avec beaucoup de visuels sont donc plus élevés (voir « À surveiller »).

---

## 1. Accessibilité — le site est-il utilisable par tout le monde ?

| Critère | Vérifié comment | Résultat avant | Correction |
|---|---|---|---|
| **Langue de la page** déclarée (`lang`) et passages dans l'autre langue (WCAG 3.1.1 / 3.1.2) | HTML généré | ✅ `lang="fr"` ou `"en"` selon l'adresse ; le lien de langue a `lang` + `hreflang` ; la page 404 bilingue marque la phrase anglaise `lang="en"` | — |
| **Nom accessible = texte visible** (WCAG 2.5.3) | axe-core | ❌ sur **toutes les pages** : le logo (« Canal BF — retour à l'accueil » alors qu'on lit « CANAL BF Bambou Franceschini ») et le bouton de langue (« Read this page in English » alors qu'on lit « FR EN ») | Logo : `alt` qui reprend le texte affiché. Bouton de langue : texte visible + précision en `sr-only`. Cartes projet : suppression de l'`aria-label` qui remplaçait tout le texte de la carte |
| **Liens repérables sans la couleur** (WCAG 1.4.1) | axe-core | ❌ mentions légales, confidentialité, formulaire : liens bordeaux dans du texte presque noir (écart de contraste 1,55:1) | Liens **soulignés** dans les pages légales et sous le formulaire |
| **Ordre des titres** h1 → h2 → h3 | axe-core + liste des titres du HTML | ❌ page « Mes projets » : h1 puis directement les h3 des cartes | Ajout d'un h2 « Liste des projets » (masqué visuellement, lu par les lecteurs d'écran) |
| **Zone qui défile accessible au clavier** (WCAG 2.1.1) | axe-core (390 px) | ❌ sur mobile, la liste horizontale des étapes d'un projet ne pouvait pas être atteinte au clavier | `tabindex="0"` + `aria-label` « Les étapes du projet (faire défiler) » |
| **Contenu qui bouge sans arrêt** (WCAG 2.2.2 : pouvoir mettre en pause) | lecture du code + test clavier | ❌ la bande des logiciels défile à l'infini et ne s'arrête qu'au survol de la souris (impossible au clavier ou au doigt) | **Bouton pause / lecture** (`aria-pressed`), testé au clavier : l'animation passe bien à `paused` |
| **Animations réduites** (`prefers-reduced-motion`) | lecture du CSS et des scripts | ✅ écran de chargement sauté, zapping, bruit et apparitions coupés, défilement doux (Lenis) désactivé | — |
| **Contrastes de la charte** (WCAG 1.4.3, 4,5:1) | calcul sur les couleurs | ✅ crème/encre 17,5:1 · rose/encre 11:1 · bordeaux/crème 11,3:1 · encre sur pastilles jaune 10,1 / vert 8,9 / bleu 4,8:1 | — |
| **Focus visible** (WCAG 2.4.7) | CSS + navigation au clavier | ✅ contour magenta 3 px sur tous les éléments | — |
| **Lien d'évitement** « Aller au contenu » | HTML | ✅ premier élément de la page, visible au focus | — |
| **Formulaire** : étiquettes, `autocomplete`, champs obligatoires | HTML | ✅ `label` autour de chaque champ, `autocomplete` (family-name, given-name, email), champ piège anti-robot masqué aux lecteurs d'écran | — |
| **Textes alternatifs** | HTML | ✅ affiches et visuels décrits par leur titre ; miniatures décoratives en `alt=""` (le titre du projet est juste à côté) | — |
| **Iframes nommées** | HTML | ✅ chaque iframe a un `title` (« Prototype interactif — L'Œil du Lion ») | — |
| **Vidéo sous-titrée** (WCAG 1.2.2) | lecture du code | ❌ la vidéo « Pourquoi la danse ? » contient des paroles (interviews) sans sous-titres | Le site sait maintenant afficher des sous-titres (piste `<track>`, champ `video_captions` ajouté dans PocketBase). **Reste à faire** : créer le fichier `.vtt` (export des sous-titres automatiques de CapCut, relus) et le déposer dans PocketBase |

| **Contraste des numéros d'étapes** (01, 02, 03… sur les pages projet) | axe-core sur le site en ligne (16/11) | ⚠️ signalé par axe à 1440 px : chiffres remplis de la couleur du type de projet (vert `#8CBF6F` = 1,97:1, jaune `#E2B84A` sur crème) | **Exception justifiée, non corrigée** : ces chiffres font 72 px, sont **entourés d'un contour encre de 2 px** (`-webkit-text-stroke`, encre/crème 17,5:1) qui dessine la forme du chiffre, et sont `aria-hidden` car l'ordre est déjà donné par la liste `<ol>`. axe ne sait pas prendre en compte le contour : c'est un faux positif de l'outil, vérifié à l'œil |

**Résultat après corrections : axe-core 0 erreur sur les 12 pages contrôlées au build, à 1440 px comme à 390 px. Sur le site en ligne (14 pages, dont les 6 pages projet), 0 erreur hors l'exception justifiée ci-dessus. Lighthouse Accessibilité : 100 sur les 4 pages mesurées.**

## 2. Sobriété et performance — que coûte le site à charger, et pourquoi ?

| Critère | Vérifié comment | Résultat | Correction |
|---|---|---|---|
| **Iframes tierces** chargées sans le vouloir | requêtes réseau relevées avec Playwright sur une page projet | ❌ le prototype Figma ou le site en direct se chargeait dès l'arrivée sur la page (plusieurs Mo, des dizaines de requêtes vers d'autres serveurs) | **Façade** : on affiche la capture du projet et un bouton « ▶ Lancer le site / le prototype » ; l'iframe n'est créée qu'au clic. Vérifié : **0 requête externe avant le clic**, l'iframe apparaît après Entrée |
| **Poids d'une page** | Lighthouse | ✅ 255 à 270 Ko (accueil, projets, page projet, contact) avec le contenu de test : 17 requêtes, dont 97 Ko de polices, 60 Ko de CSS, 60 Ko de JS | — |
| **Images** | code (`astro:assets`) + Lighthouse | ✅ redimensionnées au build à la taille d'affichage, converties en **WebP** (qualité 82), `loading="lazy"` sauf l'image du haut, `width`/`height` fixés | — |
| **Vidéo** (19 Mo) | code | ✅ jamais chargée tant qu'on n'a pas cliqué sur « ▶ PLAY » (`preload="metadata"` dans la loupe) ; à la place, une affiche | — |
| **Polices** | code + Lighthouse | ✅ hébergées sur le site (pas de Google Fonts), **sous-ensemble latin** seulement, 5 fichiers WOFF2 | — |
| **Stabilité visuelle (CLS)** | Lighthouse mobile | ⚠️ 0,103 sur l'accueil : le titre et les numéros de chaîne changent de taille quand les polices arrivent | **Préchargement** des 2 polices d'affichage (`<link rel="preload">`) → **CLS 0** |
| **Compression** des fichiers texte | Lighthouse (« Enable text compression ») | ⚠️ ~125 Ko économisables si le serveur ne compresse pas | Règle **gzip** (`mod_deflate`) ajoutée dans `.htaccess` pour HTML, CSS, JS, SVG, XML |
| **Cache** | `.htaccess` | ✅ fichiers versionnés par Astro (nom qui change à chaque modif) gardés 1 an ; HTML toujours revérifié | — |
| **JavaScript** | Lighthouse | ✅ Total Blocking Time 0 ms ; aucun script tiers, aucun outil de statistiques | — |
| **Site statique** | architecture | ✅ pages générées une fois au build : le serveur ne calcule rien à chaque visite ; PocketBase n'est appelé que par le formulaire | — |

**Lighthouse Performance après corrections : 92 à 94 sur mobile, 98 à 100 sur desktop.**

## 3. Référencement — le site est-il compréhensible par une machine ?

| Critère | Vérifié comment | Résultat | Correction |
|---|---|---|---|
| **`<title>` et meta description** propres à chaque page | HTML généré | ✅ ex. « TiK•TaK — Canal BF · Bambou Franceschini » + la description du projet tirée de PocketBase | — |
| **Version FR / EN** sans contenu dupliqué | HTML | ✅ `hreflang="fr"`, `"en"` et `x-default` sur chaque page, `canonical` vers soi-même | — |
| **Plan du site** | recherche de `/sitemap.xml` | ❌ absent | **`/sitemap.xml` généré au build** (pages fixes + chaque projet publié, dans les 2 langues, avec les liens `hreflang`) et déclaré dans `robots.txt` |
| **Page 404** hors des résultats Google | HTML | ❌ la page « Pas de signal » pouvait être indexée | `<meta name="robots" content="noindex">` |
| **Aperçu au partage** (LinkedIn, Discord…) | balises Open Graph | ⚠️ titre et description présents, mais **aucune image** | Image `og-canal-bf.png` (1200 × 630, aux couleurs du site) + `og:image`, `og:site_name`, `twitter:card` |
| **Structure** : un seul h1, titres hiérarchisés, liens explicites | axe-core + HTML | ✅ après correction de l'ordre des titres (voir Accessibilité) | — |
| **Adresses lisibles** | arborescence | ✅ `/projets/tiktak/`, `/en/projects/tiktak/` | — |
| **`robots.txt`** | fichier | ✅ tout est autorisé + lien vers le sitemap | — |

**Lighthouse SEO : 100 sur les 4 pages.**

## 4. Conformité juridique — que dois-je à mes visiteurs et aux auteurs ?

| Critère | Vérifié comment | Résultat | Correction |
|---|---|---|---|
| **Mentions légales** (LCEN art. 6) : éditeur, directeur de publication, **hébergeur** | lecture de la page | ❌ l'hébergeur indiqué était **Infomaniak**, alors que le site a déménagé sur le VPS de l'IUT | Hébergeur mis à jour (VPS de l'IUT Nord Franche-Comté, réseau Moji / Netrix, France) ; Infomaniak reste cité pour le nom de domaine. **À faire confirmer** auprès de l'enseignant qui gère les VPS |
| **Cookies et traceurs** (RGPD + recommandations CNIL) | code + requêtes réseau | ✅ aucun cookie, aucun outil de statistiques ; un indicateur en `sessionStorage` (écran de chargement), strictement technique, expliqué dans la politique | — |
| **Contenus tiers qui déposent des cookies** | requêtes réseau sur les pages projet | ❌ l'iframe Figma se chargeait sans action du visiteur | Chargement **au clic seulement**, avec une phrase d'information à côté du bouton (voir Sobriété) |
| **Politique de confidentialité** (RGPD art. 13) : données, finalité, durée, droits, CNIL | lecture de la page | ⚠️ ne parlait ni des **journaux du serveur** (adresses IP), ni des contenus intégrés ; affirmait « aucun appel à des services tiers » | Ajout des parties « Journaux techniques » et « Contenus intégrés » ; serveur situé en France précisé |
| **Information au moment de la collecte** | formulaire | ✅ phrase sous le formulaire + lien vers la politique de confidentialité (désormais souligné) ; champ piège plutôt qu'un captcha tiers | — |
| **Droits d'auteur des contenus publiés** | relecture projet par projet | ✅ créations personnelles ; projet SAÉ 303 : **Thomas Perruchot crédité** et licences des données (Apache-2.0, Licence Ouverte 2.0) ajoutées dans les mentions ; citation de Milton Glaser en courte citation ; polices sous licence libre (SIL OFL / Apache 2.0) | Ajout du crédit binôme et des licences dans les mentions légales |
| **Droit à l'image** | relecture | ⚠️ la vidéo « Pourquoi la danse ? » montre des danseurs identifiables | **À vérifier** : garder l'accord écrit des personnes filmées (ou le leur demander) |

## 5. Vérification sur le site en ligne — 16 novembre 2026

En relisant le site publié, j'ai constaté que **les corrections du 12 novembre n'avaient pas encore été envoyées sur GitHub** : le site en ligne n'avait ni sitemap, ni image de partage, ni bouton pause, et les mentions légales citaient encore l'ancien hébergeur. Les corrections ont été poussées, le déploiement automatique a reconstruit le site, puis chaque point a été recontrôlé **directement sur https://portfolio.bambou-franceschini.fr** :

| Point contrôlé | Comment | Résultat en ligne |
|---|---|---|
| Plan du site | requête sur `/sitemap.xml` | ✅ 200, **24 adresses** (pages FR/EN + projets) avec `hreflang` |
| `robots.txt` | lecture du fichier | ✅ lien vers le sitemap présent |
| Image de partage | requête sur `/og-canal-bf.png` + balises | ✅ 200, `og:image` et `twitter:card = summary_large_image` |
| Préchargement des polices | balises `<link rel="preload">` | ✅ Bungee et VT323 |
| Compression | en-tête `Content-Encoding` | ✅ **gzip** actif |
| Page 404 | adresse inexistante | ✅ statut 404 + `noindex` |
| Bouton pause de la bande défilante | HTML de l'accueil | ✅ présent |
| Titre de la liste des projets | HTML de `/projets/` | ✅ h2 « Liste des projets » |
| Nom accessible du logo | attribut `alt` | ✅ « Canal BF Bambou Franceschini — retour à l'accueil » |
| Façade des iframes | HTML de la page L'Œil du Lion | ✅ bouton de chargement présent, **0 iframe** dans la page avant le clic |
| Couleur par type de projet | style des pages Olyvia! et L'Œil du Lion | ✅ jaune `#E2B84A` (Design UI/UX) |
| Mentions légales | texte de la page | ✅ hébergement sur le VPS, Infomaniak pour le domaine, crédit de Thomas Perruchot |
| Politique de confidentialité | texte de la page | ✅ parties « Journaux techniques » et « Contenus intégrés » |
| Accessibilité automatique | axe-core 4.10 injecté dans chaque page publiée, à 1440 px et 390 px | ✅ 0 erreur sauf les numéros d'étapes (exception justifiée, section 1) |

**Leçon retenue :** un contrôle qualité ne vaut que sur ce qui est réellement publié. Je revérifie désormais le site en ligne après chaque déploiement, et pas seulement mon build local.

---

## À surveiller (non corrigé, ou à confirmer)

- **Sous-titres de la vidéo** : le site est prêt, il manque le fichier `.vtt`.
- **Hébergeur exact du VPS** : à confirmer avec l'IUT, puis ajuster les mentions légales si besoin.
- **Droit à l'image** des danseurs de « Pourquoi la danse ? ».
- **Poids des pages riches en images** (« L'évolution du temps », « À propos ») : les photos d'origine dans PocketBase font jusqu'à 5 Mo. Le site les redimensionne, mais la **loupe** charge l'image d'origine. Piste : réduire les originaux à 2500 px avant de les déposer.
- **Sous-titres en ligne** : la migration `video_captions` doit aussi être appliquée au PocketBase du VPS (envoyer le fichier de migration sur le serveur puis redémarrer le service) avant de déposer le `.vtt`.
- Refaire **axe + Lighthouse sur le site en ligne** à chaque nouveau projet ajouté dans PocketBase.
