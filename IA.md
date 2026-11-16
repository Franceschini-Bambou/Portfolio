# DÉCLARATION D'USAGE DE L'IA — Canal BF

> ✏️ Brouillon à adapter au format demandé au point 3 du sujet, et à relire : c'est ta déclaration.

## Outil utilisé
**Claude** (Anthropic), en conversation, avec un accès à mon dossier de projet, à Figma, à Canva et à un navigateur.

## Ce qui vient de moi
- Le **concept** « Canal BF » (le portfolio comme une chaîne de télé rétro), la direction artistique, les couleurs, les polices et la maquette.
- Le **choix des projets** présentés, leur ordre et ce que je voulais mettre en avant.
- Les **contenus** de mes projets : visuels, vidéos, maquettes Figma, rendus de SAÉ, bilans de tests utilisateurs.
- Les **décisions** : catégories, couleurs par type de projet, 3 projets sur l'accueil, prototype ou site en direct plutôt que des captures, hébergement sur le VPS.
- Les **corrections demandées** après relecture : design jugé trop chargé, couleurs, titre qui dépassait, barre de défilement…

## Ce que l'IA a fait (et comment je l'ai utilisée)

| Partie | Ce que l'IA a produit | Ce que j'ai vérifié ou corrigé |
|---|---|---|
| **Code du site** (Astro, Tailwind, scripts) | une grande partie du code des composants, des animations et de la version anglaise, à partir de mes consignes et de ma maquette | test de chaque page en local, retours visuels (« le É dépasse », « Olyvia est encore en vert »), demandes de modifications |
| **PocketBase** | migrations (collections, champs anglais, nouveaux projets), hook d'e-mail | vérification des fiches dans l'admin, correction du rôle et des textes |
| **Textes des fiches projet** (FR + EN) | rédaction à partir de mes documents (consignes de TP, bilan des tests, conversation de SAÉ, site de la SAÉ 303) | relecture, vérification des chiffres dans mes propres sources |
| **Déploiement** | commandes pas à pas (VPS, Apache, certbot, GitHub Actions), fichiers de configuration | exécution des commandes moi-même sur le serveur, vérification que tout marche |
| **Contrôle qualité** | tests axe-core et Lighthouse, corrections d'accessibilité, de référencement et des pages légales, rédaction de `QUALITE.md` | relecture des corrections, points à confirmer (hébergeur, droit à l'image, sous-titres) |
| **Journal** | brouillon reconstitué à partir de l'historique | complété et réécrit avec mon vécu |

## Exemples de demandes faites à l'IA
- « Ajoute ce projet dans PocketBase, n'oublie pas que l'accueil ne doit afficher que 3 projets. »
- « Au lieu des photos de la maquette, est-ce possible d'intégrer le lien du prototype ? »
- « Je veux que les projets s'affichent 3 par 3 sur ordinateur (change pas sur téléphone). »
- « Donne-moi étape par étape pour publier PocketBase. »

## Limites rencontrées
- L'IA a parfois fait des suppositions que j'ai dû corriger (un projet déclaré « individuel » sans le savoir, la couleur « jaune » des deux catégories).
- Certaines modifications ont été écrasées par une ancienne version d'un fichier ouverte dans VS Code : il a fallu tout revérifier.
- Les informations juridiques proposées (hébergeur du VPS) doivent être confirmées auprès de l'IUT.
