# CodeQuest ⚡

> Apprends à coder en t'amusant — plateforme gamifiée d'apprentissage du JavaScript et du Web (HTML/CSS).

CodeQuest est une application web **100% gratuite**, **installable (PWA)** et **fonctionnant hors-ligne** qui transforme l'apprentissage du code en aventure : leçons interactives, éditeur de code intégré, exécution en sandbox, XP, niveaux, rangs et badges.

---

## ✨ Fonctionnalités

- **9 leçons** structurées en 2 modules
  - ⚡ **JavaScript : Les Bases** (6 leçons) — variables, fonctions, conditions, boucles, tableaux, objets
  - 🎨 **Le Web : HTML & CSS** (3 leçons) — structure HTML, style CSS, défi FizzBuzz
- **Éditeur de code** intégré avec exécution en sandbox (`new Function`) et capture de `console.log`
- **Aperçu visuel** du HTML/CSS dans un iframe sécurisé (`sandbox`)
- **Validation automatique** des exercices (regex sur le code saisi)
- **Système de progression** : XP, niveaux (150 XP/niveau), 6 rangs (🌱 Apprenti → 👑 Légende)
- **6 badges** débloquables (premier pas, maître JS, maître Web, à mi-chemin, héros FizzBuzz, achèvement total)
- **Confettis** 🎉 à chaque défi réussi
- **Sauvegarde locale** (localStorage) — ta progression persiste entre les sessions
- **PWA installable** sur desktop et mobile (Chrome, Edge, Opera, Android, iOS Safari)
- **Coloration syntaxique** maison pour JavaScript, HTML et CSS
- **Design glass-morphism** sombre avec accents jaune/rose/violet
- **Responsive** mobile-first et accessible (aria-labels, sémantique HTML)

---

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# → http://localhost:3000

# Build de production
npm run build

# Lancer en production
npm start
```

**Prérequis :** Node.js 18.18+ (recommandé 20+).

---

## 🧭 Routes

| Route | Description |
|-------|-------------|
| `/` | Tableau de bord (stats, badges, modules, liste des leçons) |
| `/lecon/[id]` | Vue d'une leçon (cours + défi + éditeur) |

Exemples : `/lecon/js-variables`, `/lecon/js-functions`, `/lecon/web-html`, `/lecon/web-fizzbuzz`.

---

## 🗂 Structure du projet

```
codequest-app/
├── public/
│   ├── favicon.svg          # Logo dégradé (jaune → rose → violet)
│   ├── manifest.json        # Manifeste PWA
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout racine (métadonnées, polices)
│   │   ├── globals.css      # Theme CSS, animations, glass-morphism
│   │   ├── page.tsx         # Route / → <Dashboard/>
│   │   └── lecon/[id]/
│   │       └── page.tsx     # Route /lecon/[id] → <LessonView/>
│   ├── components/
│   │   ├── app-toolbar.tsx  # Barre flottante (Portfolio/Installer/Fermer)
│   │   ├── dashboard.tsx    # Tableau de bord principal
│   │   ├── lesson-view.tsx  # Vue détaillée d'une leçon + défi
│   │   ├── code-runner.tsx  # Sandbox d'exécution + helpers runJavaScript/buildPreviewDoc
│   │   ├── confetti.tsx     # Animation confettis emoji
│   │   ├── header.tsx       # En-tête CodeQuest réutilisable
│   │   ├── badge-card.tsx   # Carte de badge
│   │   └── lesson-card.tsx  # Ligne de leçon dans le dashboard
│   ├── data/
│   │   └── lessons.ts       # LESSONS, MODULES, BADGES, RANKS, getRank, getLevel
│   ├── hooks/
│   │   └── use-progress.ts  # Hook localStorage (completedLessons, totalXp)
│   └── lib/
│       └── utils.ts         # cn() + highlightCode()
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 🎨 Thème & design

L'app utilise un thème sombre avec des variables CSS définies dans `globals.css` :

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bg` | `#0a0a14` | Fond global |
| `--surface` | `#13131f` | Surfaces de cartes |
| `--surface-2` | `#1c1c2e` | Surfaces secondaires |
| `--border` | `#2a2a3e` | Bordures |
| `--text` | `#f5f5f7` | Texte principal |
| `--text-muted` | `#a1a1aa` | Texte secondaire |
| `--primary` | `#facc15` | Jaune — XP, niveau, accents |
| `--accent` | `#ec4899` | Rose — module Web |
| `--accent-2` | `#8b5cf6` | Violet — module JavaScript |
| `--success` | `#10b981` | Vert — succès |
| `--danger` | `#ef4444` | Rouge — erreurs |

Classes utilitaires : `.codequest-bg`, `.glass`, `.glass-strong`, `.code-block`,
`.animate-fade-in`, `.animate-scale-in`, `.animate-pulse-glow`.

Polices : **Outfit** (titres), **Inter** (texte), **JetBrains Mono** (code).

---

## 🧠 Système de progression

- **XP** : chaque leçon rapporte 20 à 50 XP selon la difficulté.
- **Niveaux** : 1 niveau = 150 XP. La barre de progression affiche `xpInLevel / 150`.
- **Rangs** (6 paliers) :
  - 🌱 Apprenti (0 XP) · 💻 Codeur (50) · 🚀 Développeur (120) · ⚙️ Ingénieur (200) · 🏰 Architecte (280) · 👑 Légende (400)
- **Badges** (6) : débloqués automatiquement selon les leçons terminées.
- **Stockage** : `localStorage` clé `codequest-progress-v1` (voir `use-progress.ts`).

---

## 🔒 Sandbox d'exécution

Le code utilisateur est exécuté via `new Function("console", code)` avec un
objet `console` maison qui capture les `console.log/info/warn/error`. Aucun
accès au `window`, `document` ou au `localStorage` de l'app.

Pour le HTML/CSS, le rendu se fait dans un `<iframe sandbox="allow-scripts">`
avec `srcDoc` — isolé du document parent.

---

## 📱 Installation PWA

CodeQuest est installable comme une application native :

- **Chrome / Edge desktop** : icône `+` à droite de la barre d'adresse.
- **Android (Chrome/Opera)** : menu ⋮ → « Installer l'application ».
- **iOS Safari** : bouton Partager → « Sur l'écran d'accueil ».

La barre d'outils flottante (en haut à droite) guide l'utilisateur selon son
navigateur via une modale d'instructions détaillées.

---

## 🛠 Stack technique

- **Next.js 16.4.5** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **lucide-react** (icônes)
- **clsx + tailwind-merge** (`cn()`)
- Aucune dépendance runtime externe supplémentaire
- Aucun appel API — 100% client-side (localStorage)

---

## 📜 Licence & crédits

Fait avec ❤️ pour les apprenants par **LEGAGNEUR DÉVELOPPEMENT**.

CodeQuest — Apprends à coder en t'amusant. 9 leçons • 100% gratuit.
