# JOURNAL DE BORD — Canal BF

> ✏️ Brouillon reconstitué à partir de l'historique du projet (commits Git et échanges de travail). **À relire et à compléter avec tes propres mots** : ce qui a coincé pour toi et pourquoi tu as pris chaque décision.

## Semaine 42 — du 12 au 18 octobre
- **Fait :** choix du concept « Canal BF », un portfolio pensé comme une chaîne de télé rétro (chaque page est une chaîne : CH 01 Accueil, CH 02 Projets…). Maquette, puis mise en place du projet Astro + Tailwind. Création des collections PocketBase (site, projets, outils, inspirations, messages) et du hook qui m'envoie un e-mail à chaque message.
- **Décidé :** tout le contenu vient de PocketBase (plus aucun texte en dur), pour pouvoir le modifier sans toucher au code. La base `pb_data` est retirée de Git.
- **Ce qui a coincé :** les images de PocketBase étaient zoomées et coupées ; corrigé pour respecter leurs proportions. Ajout du projet Olyvia!.

## Semaine 43 — du 19 au 25 octobre
- **Fait :** animations (écran de chargement « réglage automatique », zapping entre les pages, apparitions au défilement, défilement doux avec Lenis), version **anglaise** complète du site (`/en/`), CV au style du portfolio exporté en PDF.
- **Décidé :** toutes les animations se coupent si l'utilisateur a demandé à réduire les mouvements. Les textes anglais sont dans des champs `_en` de PocketBase ; s'ils sont vides, le français s'affiche.
- **Ce qui a coincé :** garder des adresses propres dans les deux langues (`/a-propos/` ↔ `/en/about/`) et éviter que Google voie le site en double (balises `hreflang`).

## Semaine 44 — du 26 octobre au 1er novembre
- *(à compléter : vacances / pas de travail sur le portfolio ?)*

## Semaine 45 — du 2 au 8 novembre
- **Fait :** les catégories deviennent **Design UI/UX**, **Audiovisuel** et **Développement web**, chacune avec sa couleur. Ajout de trois projets : **L'Œil du Lion** (configurateur de lunettes, prototype Figma intégré dans la page), **TiK•TaK** (SAÉ 301, le site en direct dans la page) et **Comprendre l'électricité de l'IA** (SAÉ 303 en binôme avec Thomas Perruchot, avec le lien du notebook Observable). Page Projets en cartes 3 par 3 sur ordinateur. **PocketBase mis en ligne** sur mon VPS (`api.bambou-franceschini.fr`, service systemd, Apache, HTTPS avec certbot).
- **Décidé :** afficher le vrai prototype ou le vrai site plutôt que des captures ; l'accueil ne garde que 3 projets ; PocketBase sur le VPS (Netlify ne peut pas faire tourner un serveur en continu).
- **Ce qui a coincé :** la couleur d'Olyvia ne changeait pas (une ancienne version de fichier avait été réenregistrée) ; une page projet faisait 404 en français mais pas en anglais (le serveur de dev gardait l'ancienne liste de projets en mémoire) ; les images de PocketBase en ligne étaient refusées par Astro (adresse à autoriser dans `astro.config.mjs`).

## Semaine 46 — du 9 au 15 novembre
- **Fait :** changement d'ordinateur, réinstallation (Node.js, Git, extensions VS Code, `npm install`, fichier `.env`). **Mise en ligne du site** sur `portfolio.bambou-franceschini.fr` avec un déploiement automatique GitHub Actions (build + envoi en SSH sur le VPS à chaque push). Contrôle qualité (accessibilité, sobriété, référencement, juridique) et corrections : voir `QUALITE.md`.
- **Décidé :** les projets intégrés (Figma, sites) ne se chargent qu'au clic : plus léger, et pas de cookies tiers sans accord. Ajout d'un plan du site, d'une image de partage, d'un bouton pause sur la bande défilante.
- **Ce qui a coincé :** PowerShell bloquait `npm` (règle d'exécution des scripts à changer) ; le premier déploiement semblait ne pas se lancer (je regardais l'ancien lancement, le nouveau était déjà passé au vert).

## Semaine 47 — du 16 au 22 novembre
- **Fait :** vérification du site **en ligne** avant le rendu. Les corrections qualité de la semaine précédente n'avaient jamais été poussées sur GitHub : le site publié n'avait ni sitemap, ni image de partage, ni bouton pause, et les mentions légales étaient périmées. Push des corrections, déploiement automatique, puis nouveau contrôle point par point sur le site publié (sitemap, gzip, 404, mentions, axe-core sur les 14 pages). Ajout de la section 5 dans `QUALITE.md`.
- **Décidé :** les numéros d'étapes colorés signalés par axe restent tels quels (contour encre lisible, chiffres décoratifs `aria-hidden`), et je l'explique dans la grille plutôt que de cacher le problème.
- **Ce qui a coincé :** j'avais contrôlé mon build local en pensant que c'était le site en ligne. Désormais je vérifie toujours après chaque déploiement.
