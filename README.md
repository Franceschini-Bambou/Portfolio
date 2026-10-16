# 📺 Canal BF — portfolio de Bambou Franceschini

Portfolio en forme de **chaîne de télé des années 80** : chaque page est une chaîne (CH 01 → CH 04). Entre les pages, on « zappe » avec un effet de neige. Le site reprend la maquette Claude Design *Canal BF*.

| Techno | Rôle dans le projet |
|---|---|
| **Astro 7** | génère les pages HTML (site statique, très rapide) |
| **Tailwind CSS 4** | toute la mise en forme (classes utilitaires, mobile d'abord) |
| **PocketBase** | base de données : projets, textes, images, vidéo, CV et messages du formulaire |
| **Git / GitHub** | versions du code, plus le déploiement automatique (GitHub Actions) |
| **Infomaniak** | hébergement du site (dossier `dist/` envoyé en FTP) |

---

## Sommaire

1. [Installer le projet](#1-installer-le-projet)
2. [Comment le projet est rangé](#2-comment-le-projet-est-rangé)
3. [Le système de design (Tailwind)](#3-le-système-de-design-tailwind)
4. [Les composants communs](#4-les-composants-communs)
5. [Page par page](#5-page-par-page)
6. [Responsive : ce qui change entre mobile et desktop](#6-responsive--ce-qui-change-entre-mobile-et-desktop)
7. [Les animations et l'interactivité](#7-les-animations-et-linteractivité)
8. [PocketBase pas à pas](#8-pocketbase-pas-à-pas)
9. [Git et GitHub](#9-git-et-github)
10. [Mettre en ligne sur Infomaniak](#10-mettre-en-ligne-sur-infomaniak)
11. [À faire avant la mise en ligne](#11-à-faire-avant-la-mise-en-ligne-)

---

## 1. Installer le projet

Il faut **Node.js 22.22 ou plus récent** (`node -v` pour vérifier, sinon télécharge la version LTS sur nodejs.org).

```bash
npm install          # installe Astro, Tailwind, PocketBase SDK…
cp .env.example .env # crée ton fichier de réglages (adresse de PocketBase)
./pocketbase serve   # dans un 1er terminal : lance PocketBase (partie 8)
npm run dev          # dans un 2e terminal : lance le site sur http://localhost:4321
```

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | site en direct, se recharge à chaque sauvegarde |
| `npm run build` | fabrique le site final dans `dist/` |
| `npm run preview` | affiche le contenu de `dist/` pour vérifier avant la mise en ligne |

> ⚠️ **Tout le contenu vient de PocketBase** (textes, images, vidéo, CV). PocketBase doit donc être lancé pour `npm run dev` et `npm run build`. Sinon, le site affiche un message qui explique quoi faire.

---

## 2. Comment le projet est rangé

```
canal-bf/
├─ astro.config.mjs        réglages Astro (Tailwind, images PocketBase, préchargement)
├─ .env.example            modèle du fichier .env (adresse PocketBase, identifiants admin)
├─ public/                 fichiers copiés tels quels : logo, favicon, texture marbre, .htaccess
├─ src/
│  ├─ styles/global.css    ⭐ le design system : couleurs, polices, tailles, effets télé
│  ├─ layouts/Base.astro   squelette commun à toutes les pages (head, en-tête, pied, télé)
│  ├─ components/          morceaux réutilisables (fenêtre rétro, bouton, guide des programmes…)
│  ├─ pages/               1 fichier = 1 page du site (le nom du fichier = l'adresse)
│  ├─ scripts/tv.ts        toute l'interactivité (zapping, menu, filtres, carrousels, formulaire)
│  └─ lib/data.ts          lit tout le contenu dans PocketBase
├─ pb_migrations/          crée les collections PocketBase automatiquement
├─ pb_hooks/               t'envoie un e-mail à chaque nouveau message
└─ .github/workflows/      déploiement automatique sur Infomaniak
```

**Adresses générées :**

| Fichier | Adresse | Chaîne |
|---|---|---|
| `pages/index.astro` | `/` | CH 01 |
| `pages/projets/index.astro` | `/projets/` | CH 02 |
| `pages/projets/[slug].astro` | `/projets/pourquoi-la-danse/`, `/projets/evolution-du-temps/` | CH 02 |
| `pages/a-propos.astro` | `/a-propos/` | CH 03 |
| `pages/contact.astro` | `/contact/` | CH 04 |
| `pages/mentions-legales.astro`, `politique-de-confidentialite.astro` | pages légales | — |
| `pages/404.astro` | page d'erreur « Pas de signal » | — |

---

## 3. Le système de design (Tailwind)

Tout est dans **`src/styles/global.css`**. Avec Tailwind 4, les variables déclarées dans `@theme` deviennent des classes.

**Couleurs** : `bg-ink` (fond bordeaux très foncé `#1D0B0C`), `bg-bordeaux` `#6F080C`, `bg-rose` `#DBBCDA`, `bg-cream` `#FBF5EC`, plus les couleurs des chaînes (`ch-blue`, `ch-green`, `ch-yellow`) et les deux couleurs du décalage chromatique `cyan` / `magenta`.

**Polices** (hébergées sur le site, rien n'est chargé chez Google, donc RGPD ok) :
- `font-display` → **Bungee** (titres)
- `font-vt` → **VT323** (textes « écran télé » : CH 02, horaires, étiquettes)
- `font-sans` → **Roboto** (textes courants)

**Tailles fluides** : les titres utilisent `clamp()`. Ils grandissent avec la largeur de l'écran et s'arrêtent pile à la taille de la maquette en 1440 px. Exemple : `text-giant` pour « BAMBOU », `text-h2` pour les titres de section.

**Effets maison** (`@utility`) :

| Classe | Effet |
|---|---|
| `chroma-3`, `chroma-5`… | ombre cyan / magenta décalée de 3, 5… px (glitch VHS) |
| `glow-green` | lueur verte des numéros de chaîne |
| `scanlines` | lignes horizontales d'écran cathodique |
| `vignette` | coins assombris de l'écran |
| `win-stripes` | rayures des barres de titre des fenêtres |
| `btn-retro` | bouton avec ombre pleine qui se soulève au survol et s'enfonce au clic |

---

## 4. Les composants communs

| Composant | À quoi il sert |
|---|---|
| `Base.astro` (layout) | `<head>` (titre, description, partage), lien « Aller au contenu », en-tête, pied de page, couche télé. Il active aussi le **ClientRouter** d'Astro, qui permet de changer de page sans recharger, d'où le zapping. |
| `Header.astro` | **Desktop** : logo, puis la télécommande (01 Accueil, 02 Projets, 03 À propos), puis le bouton rouge ● REC « Me contacter ». **Mobile** : logo, numéro de chaîne et bouton MENU qui ouvre une télécommande en grille 2×2. |
| `TvLayer.astro` | Ce qui reste par-dessus tout le site : cadre arrondi de la télé, scanlines, bande qui défile, compteur « ▶ PLAY SP 00:00:26 », et l'écran de neige du zapping. Il est gardé d'une page à l'autre (`transition:persist`). |
| `Window.astro` | La fenêtre « ordinateur rétro » (barre rayée et nom de fichier : `citation.txt`, `stage.exe`…). |
| `Btn.astro` | Les boutons (variantes `bordeaux`, `cream`, `ink`, `rose`, `night`, `pill`, `outline`). |
| `ProgramGuide.astro` | Le **guide des programmes** (Horaire / À l'écran / Émission) utilisé sur l'accueil et sur Mes projets. |
| `ChannelNumber.astro` | Le grand « CH 01 » vert lumineux. |
| `HeroBackdrop.astro` | Fond marbre et bandes animées des en-têtes de page. |
| `Marquee.astro` | La bande rouge qui fait défiler les logiciels. |
| `Footer.astro` | Mire de couleurs, puis « Fin de transmission », plan du site et liens légaux. |
| `Img.astro` | Affiche une image de PocketBase, optimisée (.webp, bonne taille). |
| `Lightbox.astro` | La loupe : affiches, captures et vidéo en grand et sans filtre. |

---

## 5. Page par page

### CH 01 — Accueil (`src/pages/index.astro`)
1. **Héros** : « ● EN DIRECT — CANAL BF », le grand **CH 01**, le nom **BAMBOU / FRANCESCHINI** qui tremble (`animate-jit`), puis 3 colonnes : *Design / Com*, la fenêtre `citation.txt` (Milton Glaser) et `stage.exe` avec le bouton « Me contacter ».
2. **Bandeau « Ce soir sur Canal BF »** : les 3 projets avec leur horaire, cliquables. Les données viennent de PocketBase.
3. **Marquee** des logiciels.
4. **Qui suis-je ?** : texte, bouton « CH 03 En savoir plus » et `portrait.jpg` légèrement penché avec l'effet glitch.
5. **Programme TV « Ce soir sur Canal BF »** : le guide des programmes.

### CH 02 — Mes projets (`src/pages/projets/index.astro`)
- Fond rose, titre **Mes projets**, filtres **Tous / Graphisme / Audiovisuel / Communication** avec le nombre de projets.
- Cliquer sur un filtre déclenche une courte rafale de neige (380 ms), puis seuls les projets du genre restent affichés.
- Les filtres et leurs compteurs sont calculés à partir de PocketBase : un nouveau projet y apparaît tout seul.

### CH 02 — Page projet (`src/pages/projets/[slug].astro`)
Un seul fichier fabrique **toutes** les pages projet (une par projet qui a « has_page » coché).
1. **Héros** : « ◀ Retour aux projets », CH 02 et l'horaire, le genre, le titre, la description et la fiche `fiche.txt` (type, année, outils).
   - **Si le projet a des affiches** (L'évolution du temps), elles défilent dans la télé `affiches.tv` : boutons CH − / CH +, swipe sur mobile, flèches du clavier.
   - **Sinon** (Pourquoi la danse ?), la capture apparaît dans la télé `capture.vhs`.
2. **(01) Contexte** et **(02) Problématique** (citation encadrée en rose).
3. **(03) Démarche** : les étapes `etape_01.txt`… en 3 colonnes sur desktop, en carrousel à faire glisser sur mobile.
4. **(04) Vidéo** : lecteur avec bouton ▶ PLAY. Tant qu'aucune vidéo n'est ajoutée dans PocketBase, l'image de couverture s'affiche avec « VIDÉO À INTÉGRER ».
5. **(04) Les affiches** : la série en grand, si elle existe.
6. **(05) Résultat** et **Mon rôle** (`mon_role.txt`).
7. **Émission précédente / suivante** : on passe d'un projet à l'autre, en boucle.

### CH 03 — À propos (`src/pages/a-propos.astro`)
1. **Héros** : « À propos », présentation et `bambou.jpg` en noir et blanc teinté rose.
2. **(01) Compétences** : 6 cartes (1 colonne sur mobile, 2 sur tablette, 3 sur desktop).
3. **(02) Mes inspirations créatives** : carrousel « zapping » à 4 chaînes (La mode, Les musées, La danse, Le BAFA), avec neige entre deux chaînes, boutons CH − / CH + et accès direct aux chaînes.
4. **(03) Outils & technologies** : 4 fenêtres `creation.app`, `video.app`, `web.app` et `ia.app` (Claude, Gemini, Copilot).

### CH 04 — Contact (`src/pages/contact.astro`)
- `infos.txt` : e-mail, LinkedIn, Instagram, Behance, plus le bouton **Mon CV (PDF)**. Le bouton est grisé tant que le CV n'est pas ajouté dans PocketBase.
- `stage.exe` : les dates de stage.
- `message.exe` : le formulaire (nom, prénom, e-mail, message). L'envoi l'enregistre **dans PocketBase**, puis l'écran « ■ STOP — Message transmis » apparaît. Un champ invisible piège les robots, et PocketBase limite à 5 messages par 10 minutes par adresse IP.

### Pages légales et 404
- `mentions-legales.astro` et `politique-de-confidentialite.astro` sont obligatoires en France, surtout avec un formulaire. **À relire** (partie 11).
- `404.astro` : écran de neige « PAS DE SIGNAL ».

---

## 6. Responsive : ce qui change entre mobile et desktop

Tailwind fonctionne **« mobile d'abord »** : une classe sans préfixe s'applique partout, et `md:` (≥ 768 px), `lg:` (≥ 1024 px), `xl:` (≥ 1280 px) et `wide:` (≥ 1400 px) changent le style à partir de cette largeur.

| Élément | 📱 Mobile | 💻 Desktop |
|---|---|---|
| Navigation | bouton **MENU** et télécommande 2×2 qui se déplie | télécommande horizontale et bouton REC |
| Cadre télé | fin (14 px), coins moins arrondis | épais (30 px), comme une vraie télé |
| Nom « BAMBOU FRANCESCHINI » | calculé pour remplir la largeur de l'écran | taille maquette (212 px) |
| Bandeau « Ce soir sur » | liste empilée | une ligne de 4 cases |
| Guide des programmes | cartes empilées avec « ▶ REGARDER » | tableau 3 colonnes Horaire / À l'écran / Émission |
| Filtres | plusieurs lignes | une seule ligne |
| Démarche, affiches | **carrousel à faire glisser** (scroll-snap) | grille de 3 colonnes |
| Carrousels | **swipe** au doigt | boutons et flèches du clavier |
| Inspirations | photos en grille 2×2, boutons sous l'écran | photos côte à côte, boutons sur une ligne |
| Compétences / outils | 1 colonne | 3 / 4 colonnes |
| Pied de page | plan du site en 2 colonnes | tout sur une ligne |

Le site a été vérifié en 360, 390, 768, 1024, 1280 et 1440 px : aucun défilement horizontal.

---

## 7. Les animations et l'interactivité

Tout est dans **`src/scripts/tv.ts`**, avec un commentaire par bloc :

1. **Compteur** « SP 00:00:26 » qui avance chaque seconde, sans repartir de zéro quand on change de page.
2. **Neige** : bruit dessiné en direct dans un `<canvas>`.
3. **Zapping** : entre deux pages, l'écran de neige s'affiche avec le numéro de la chaîne d'arrivée (750 ms en tout, comme la maquette). Astro précharge les pages au survol des liens : le changement est instantané.
4. **Menu mobile** : s'ouvre et se ferme (clic à côté ou touche Échap pour fermer).
5. **Filtres** de la page projets.
6. **Carrousels** (affiches, inspirations) : neige entre deux images, swipe, clavier, annonce pour les lecteurs d'écran.
7. **Lecteur vidéo**.
8. **Formulaire** envoyé à PocketBase.

♿ **Accessibilité** : si la personne a activé « réduire les animations » sur son appareil, le tremblement, la neige et les défilements sont coupés (`prefers-reduced-motion`). Tous les boutons sont utilisables au clavier, avec un contour magenta visible.

---

## 8. PocketBase pas à pas

### 8.1 Télécharger et lancer PocketBase en local
1. Télécharge PocketBase pour ton ordinateur sur **pocketbase.io → Docs → Introduction** (fichier zip).
2. Dézippe l'exécutable `pocketbase` (ou `pocketbase.exe`) **à la racine du projet**. Il est ignoré par Git.
3. Crée ton compte admin, puis lance le serveur :

```bash
./pocketbase superuser upsert ton@email.fr unMotDePasseSolide
./pocketbase serve
```

Au démarrage, PocketBase lit `pb_migrations/` et **crée tout seul les 6 collections**. Il charge aussi `pb_hooks/` (l'e-mail de notification).

- Admin : http://127.0.0.1:8090/_/
- API : http://127.0.0.1:8090/api/

### 8.2 Les collections

| Collection | Contenu | Qui peut lire ? | Qui peut écrire ? |
|---|---|---|---|
| `projects` | les émissions : titre, genre, horaire, couleur, textes, étapes, miniatures, capture, vidéo, affiches… | tout le monde | admin |
| `skills` | les 6 compétences | tout le monde | admin |
| `inspirations` | les 4 chaînes du carrousel (nom et 2 à 3 photos) | tout le monde | admin |
| `tools` | les fenêtres d'outils (nom, couleur, liste) | tout le monde | admin |
| `site` | **1 seule fiche** : dates de stage, e-mail, réseaux, portrait, **CV** | tout le monde | admin |
| `messages` | les messages du formulaire | **admin uniquement** | tout le monde peut *créer* |

Champs utiles à connaître dans `projects` :
- `has_page` (case à cocher) : décochée, le projet s'affiche avec « ▶ BIENTÔT » mais n'a pas de page (Olyvia!).
- `sort` : l'ordre d'affichage (1, 2, 3…).
- `tags`, `steps`, `gallery_titles` : des listes au format JSON, par exemple `["Figma", "Illustrator"]`.
- `color` : la couleur de la chaîne, par exemple `#4F86A6`.

### 8.3 Remplir le contenu
Dans `.env`, mets l'adresse de PocketBase :

```
PUBLIC_PB_URL=http://127.0.0.1:8090
```

Remplis ensuite chaque collection dans l'admin (**+ New record**). Les images et la vidéo s'ajoutent directement dans les champs fichiers. Mets toujours tes **originaux en haute définition** : Astro les optimise tout seul au moment du build.

- Le bandeau qui défile sur l'accueil reprend automatiquement tous les outils de la collection `tools`.
- Dans `inspirations`, le champ `positions` (facultatif) règle la place de chaque photo, par exemple `["50% 50%", "100% 50%"]`.

💾 Ta base est dans le dossier `pb_data/`, qui ne part pas sur GitHub. **Fais des sauvegardes** : admin → Settings → Backups.

### 8.4 Modifier le contenu
1. Dans l'admin, modifie un texte, une image, ajoute la vidéo ou le CV…
2. Relance `npm run build` (ou, une fois en ligne, clique sur **Run workflow** dans GitHub, partie 10).

En dev, chaque page relit PocketBase : recharge simplement la page pour voir tes changements. Le site en ligne est **statique** : il lit PocketBase au moment du build. C'est ce qui le rend très rapide. Le formulaire de contact, lui, écrit dans PocketBase en direct.

### 8.5 Recevoir un e-mail à chaque message
Dans l'admin : **Settings → Mail settings**. Renseigne un serveur SMTP, par exemple celui de ton adresse Infomaniak Mail. Les identifiants se trouvent dans le Manager Infomaniak. Le hook `pb_hooks/messages.pb.js` t'envoie alors chaque message, et « Répondre » répond directement à la personne. Si l'e-mail échoue, le message reste quand même enregistré dans PocketBase.

---

## 9. Git et GitHub

```bash
git init
git add .
git commit -m "Canal BF : première version du portfolio"
```

Sur **github.com → New repository** (nom : `canal-bf`, sans README), puis :

```bash
git remote add origin https://github.com/TON-PSEUDO/canal-bf.git
git branch -M main
git push -u origin main
```

Ensuite, à chaque modification :

```bash
git add .
git commit -m "Ajoute la vidéo de Pourquoi la danse"
git push
```

🔒 Le fichier `.env` (tes mots de passe), `pb_data/` (la base) et l'exécutable PocketBase **ne partent jamais sur GitHub** : ils sont dans `.gitignore`.

---

## 10. Mettre en ligne sur Infomaniak

Le site a deux morceaux :

| Morceau | Où le mettre |
|---|---|
| **Le site** (`dist/`, des fichiers HTML, CSS et images) | ton **Hébergement Web Infomaniak**, dossier `web/` |
| **PocketBase** (un programme qui tourne en continu) | un serveur qui peut faire tourner un programme : **VPS Infomaniak**, **Jelastic Cloud Infomaniak**, ou un hébergeur PocketBase comme **PocketHost** |

Un hébergement web mutualisé ne permet pas de laisser tourner PocketBase en continu. Il lui faut un vrai serveur, idéalement sur un sous-domaine comme `api.bamboufranceschini.fr`.

### 10.1 PocketBase en ligne
1. Sur le serveur, envoie l'exécutable PocketBase (version Linux) ainsi que les dossiers `pb_migrations/` et `pb_hooks/`.
2. Lance-le en limitant les sites autorisés à l'appeler :
   ```bash
   ./pocketbase serve api.bamboufranceschini.fr --origins=https://www.bamboufranceschini.fr
   ```
   Avec un nom de domaine, PocketBase crée tout seul le certificat HTTPS.
3. Crée ton admin (`./pocketbase superuser upsert …`). Ensuite, transfère ton contenu : admin local → Settings → Backups → crée une sauvegarde et télécharge-la, puis restaure-la dans l'admin en ligne.
4. Pense à **sauvegarder** `pb_data/` de temps en temps (admin → Settings → Backups).

### 10.2 Le site
**Méthode simple (à la main) :**
1. `npm run build` (avec `PUBLIC_PB_URL` = l'adresse en ligne de PocketBase).
2. Ouvre FileZilla et connecte-toi en FTP à ton hébergement. Les identifiants se trouvent dans Manager Infomaniak → Hébergement → FTP / SSH.
3. Envoie **le contenu** de `dist/` dans le dossier `web/`. Le fichier `.htaccess` est inclus : il gère la page 404 et le cache.

**Méthode automatique (GitHub Actions)** : le fichier `.github/workflows/deploy.yml` construit et envoie le site à chaque `git push`. Sur GitHub, ouvre **Settings → Secrets and variables → Actions → New repository secret** et ajoute :

| Secret | Valeur |
|---|---|
| `PUBLIC_PB_URL` | `https://api.bamboufranceschini.fr` |
| `FTP_SERVER` | le serveur FTP Infomaniak (ex. `xxxx.ftp.infomaniak.com`) |
| `FTP_USERNAME` / `FTP_PASSWORD` | ton compte FTP |
| `FTP_DIR` | `/web/` (ou le dossier de ton site) |

Après avoir modifié du contenu dans PocketBase : onglet **Actions → Déployer sur Infomaniak → Run workflow**. Le site se met à jour tout seul.

### 10.3 Nom de domaine
Dans `astro.config.mjs`, remplace `site: 'https://www.bamboufranceschini.fr'` par ta vraie adresse. Elle sert aux liens de partage.

---

## 11. À faire avant la mise en ligne ✅

- [ ] **Mettre toutes tes images en haute définition** dans PocketBase (projets, inspirations, portrait).
- [ ] **Ajouter la vidéo** de « Pourquoi la danse ? » : admin → `projects` → champ `video` (.mp4). Pense à la compresser (moins de 50 Mo, c'est mieux).
- [ ] **Ajouter ton CV** : admin → `site` → champ `cv` (PDF). Le bouton du contact s'active alors tout seul.
- [ ] **Relire les mentions légales** : l'adresse de l'hébergeur et tes informations.
- [ ] **Vérifier tes liens** LinkedIn, Instagram et Behance (collection `site`).
- [ ] Mettre la vraie adresse du site dans `astro.config.mjs`.
- [ ] Configurer le SMTP pour recevoir les messages par e-mail (partie 8.5).
