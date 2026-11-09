export interface LessonContent {
  intro: string;
  sections: {
    title: string;
    content: string;
    codeExample?: string;
    codeLanguage?: "javascript" | "html" | "css";
  }[];
  exercise: {
    prompt: string;
    starterCode: string;
    solution: string;
    validate: (code: string) => { success: boolean; message: string };
  };
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  module: "javascript" | "web";
  moduleName: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  xp: number;
  duration: string;
  description: string;
  content: LessonContent;
}

export const MODULES = {
  javascript: {
    name: "JavaScript : Les Bases",
    color: "yellow",
    gradient: "from-yellow-400 to-amber-500",
    icon: "⚡",
    total: 6,
  },
  web: {
    name: "Le Web : HTML & CSS",
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
    icon: "🎨",
    total: 3,
  },
} as const;

export const LESSONS: Lesson[] = [
  {
    id: "js-variables",
    order: 1,
    title: "Variables & Types",
    module: "javascript",
    moduleName: "JavaScript : Les Bases",
    difficulty: "Débutant",
    xp: 20,
    duration: "10 min",
    description: "Découvrez comment stocker des données avec let, const et var, et les types primitifs de JavaScript.",
    content: {
      intro: "En JavaScript, une variable est comme une boîte étiquetée qui contient une valeur. Vous pouvez y stocker des nombres, du texte, des booléens, et bien plus.",
      sections: [
        {
          title: "Déclarer une variable",
          content: "Trois mots-clés existent : `let` (variable modifiable), `const` (constante non réassignable), et `var` (ancienne syntaxe, à éviter). Préférez `const` par défaut, `let` si la valeur doit changer.",
          codeExample: "let age = 25;\nconst nom = 'Alice';\nvar ancien = true; // à éviter",
          codeLanguage: "javascript",
        },
        {
          title: "Les types primitifs",
          content: "JavaScript possède 7 types primitifs : `number` (nombres), `string` (texte), `boolean` (true/false), `null`, `undefined`, `symbol`, et `bigint`. Le mot-clé `typeof` permet de connaître le type d'une valeur.",
          codeExample: "typeof 42;        // 'number'\ntypeof 'hello';   // 'string'\ntypeof true;      // 'boolean'\ntypeof undefined; // 'undefined'",
          codeLanguage: "javascript",
        },
        {
          title: "Conversion de types",
          content: "JavaScript convertit automatiquement les types dans certains contextes (coercion). Utilisez `Number()`, `String()`, `Boolean()` pour les conversions explicites.",
          codeExample: "Number('42');    // 42\nString(42);      // '42'\nBoolean(0);      // false",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Créez une variable `nom` qui contient votre prénom, et une variable `age` qui contient votre âge en nombre.",
        starterCode: "// Déclarez vos variables ici\n\n\n// Ne modifiez pas cette ligne\nconsole.log(nom, age);",
        solution: "const nom = 'Alice';\nlet age = 25;\nconsole.log(nom, age);",
        validate: (code: string) => {
          if (/(?:let|const|var)\s+nom\s*=\s*['"`].+['"`]/.test(code) && /(?:let|const|var)\s+age\s*=\s*\d+/.test(code)) {
            return { success: true, message: "Bravo ! Vous avez correctement déclaré vos variables nom et age." };
          }
          return { success: false, message: "Il faut déclarer une variable `nom` (avec du texte) et une variable `age` (avec un nombre)." };
        },
      },
    },
  },
  {
    id: "js-functions",
    order: 2,
    title: "Les Fonctions",
    module: "javascript",
    moduleName: "JavaScript : Les Bases",
    difficulty: "Débutant",
    xp: 25,
    duration: "12 min",
    description: "Apprenez à créer des fonctions réutilisables avec function, les paramètres, et les arrow functions.",
    content: {
      intro: "Une fonction est un bloc de code réutilisable. Elle permet d'éviter de répéter le même code et d'organiser votre programme.",
      sections: [
        {
          title: "Déclarer une fonction",
          content: "Deux syntaxes principales : `function` classique et arrow function `=>`. Les arrow functions sont plus concises et ont un comportement `this` différent.",
          codeExample: "function add(a, b) {\n  return a + b;\n}\n\nconst multiply = (a, b) => a * b;",
          codeLanguage: "javascript",
        },
        {
          title: "Paramètres et valeurs par défaut",
          content: "Les fonctions peuvent accepter des paramètres. Vous pouvez définir des valeurs par défaut au cas où l'argument n'est pas fourni.",
          codeExample: "function greet(name = 'invité') {\n  return 'Bonjour ' + name;\n}\ngreet();       // 'Bonjour invité'\ngreet('Bob'); // 'Bonjour Bob'",
          codeLanguage: "javascript",
        },
        {
          title: "Return",
          content: "Le mot-clé `return` renvoie une valeur et stoppe la fonction. Sans return, la fonction renvoie `undefined`.",
          codeExample: "function carre(n) {\n  return n * n;\n}\nconst resultat = carre(5); // 25",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Créez une fonction `double` qui prend un nombre en paramètre et renvoie son double (multiplié par 2).",
        starterCode: "// Écrivez votre fonction ici\n\n\n\n// Tests\nconsole.log(double(5));  // doit afficher 10\nconsole.log(double(0));  // doit afficher 0",
        solution: "function double(n) {\n  return n * 2;\n}\nconsole.log(double(5));\nconsole.log(double(0));",
        validate: (code: string) => {
          if (/function\s+double\s*\([^)]*\)\s*\{[\s\S]*return[\s\S]*\*\s*2[\s\S]*\}/.test(code) || /const\s+double\s*=\s*\([^)]*\)\s*=>[\s\S]*\*\s*2/.test(code)) {
            return { success: true, message: "Excellent ! Votre fonction double fonctionne correctement." };
          }
          return { success: false, message: "Votre fonction doit s'appeler `double`, prendre un paramètre, et renvoyer ce paramètre multiplié par 2 (avec return)." };
        },
      },
    },
  },
  {
    id: "js-conditions",
    order: 3,
    title: "Les Conditions",
    module: "javascript",
    moduleName: "JavaScript : Les Bases",
    difficulty: "Débutant",
    xp: 25,
    duration: "12 min",
    description: "Maîtrisez if, else, else if et l'opérateur ternaire pour prendre des décisions dans votre code.",
    content: {
      intro: "Les conditions permettent à votre programme de prendre des décisions : exécuter un bloc de code seulement si une condition est vraie.",
      sections: [
        {
          title: "if / else",
          content: "`if` exécute un bloc si la condition est vraie. `else` exécute un bloc alternatif si elle est fausse. `else if` permet d'enchaîner plusieurs conditions.",
          codeExample: "const age = 18;\nif (age >= 18) {\n  console.log('Majeur');\n} else {\n  console.log('Mineur');\n}",
          codeLanguage: "javascript",
        },
        {
          title: "Opérateurs de comparaison",
          content: "`===` (égalité stricte), `!==` (différent), `<`, `>`, `<=`, `>=`. Préférez toujours `===` plutôt que `==` pour éviter les conversions automatiques.",
          codeExample: "5 === 5;     // true\n5 === '5';   // false\n5 !== 3;     // true\n5 > 3;       // true",
          codeLanguage: "javascript",
        },
        {
          title: "Opérateur ternaire",
          content: "Syntaxe courte pour un if/else : `condition ? valeurSiVrai : valeurSiFaux`.",
          codeExample: "const age = 20;\nconst statut = age >= 18 ? 'Majeur' : 'Mineur';",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Écrivez une fonction `majorite` qui prend un âge en paramètre et renvoie 'Majeur' si l'âge est >= 18, sinon 'Mineur'.",
        starterCode: "// Écrivez votre fonction ici\n\n\n\n// Tests\nconsole.log(majorite(20));  // 'Majeur'\nconsole.log(majorite(15));  // 'Mineur'",
        solution: "function majorite(age) {\n  if (age >= 18) return 'Majeur';\n  return 'Mineur';\n}\nconsole.log(majorite(20));\nconsole.log(majorite(15));",
        validate: (code: string) => {
          if (/function\s+majorite\s*\([^)]*\)\s*\{[\s\S]*return[\s\S]*'Majeur'[\s\S]*'Mineur'[\s\S]*\}/.test(code) || /majorite\s*=\s*\([^)]*\)\s*=>[\s\S]*'Majeur'[\s\S]*'Mineur'/.test(code)) {
            return { success: true, message: "Parfait ! Votre fonction majorite prend les bonnes décisions." };
          }
          return { success: false, message: "Votre fonction doit s'appeler `majorite`, renvoyer 'Majeur' si âge >= 18, sinon 'Mineur'." };
        },
      },
    },
  },
  {
    id: "js-loops",
    order: 4,
    title: "Les Boucles",
    module: "javascript",
    moduleName: "JavaScript : Les Bases",
    difficulty: "Intermédiaire",
    xp: 30,
    duration: "15 min",
    description: "Répétez des actions avec for, while, et do...while. Comprenez quand utiliser chaque type de boucle.",
    content: {
      intro: "Les boucles permettent de répéter un bloc de code plusieurs fois, par exemple pour parcourir un tableau ou répéter une action.",
      sections: [
        {
          title: "La boucle for",
          content: "Idéale quand vous connaissez le nombre d'itérations. Syntaxe : `for (initialisation; condition; incrément) { ... }`.",
          codeExample: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n// Affiche 0, 1, 2, 3, 4",
          codeLanguage: "javascript",
        },
        {
          title: "La boucle while",
          content: "Répète tant que la condition est vraie. Attention aux boucles infinies si la condition ne devient jamais fausse !",
          codeExample: "let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}",
          codeLanguage: "javascript",
        },
        {
          title: "for...of et for...in",
          content: "`for...of` parcourt les valeurs d'un tableau. `for...in` parcourt les clés d'un objet.",
          codeExample: "const fruits = ['pomme', 'poire'];\nfor (const f of fruits) {\n  console.log(f);\n}\n\nconst obj = { a: 1, b: 2 };\nfor (const key in obj) {\n  console.log(key, obj[key]);\n}",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Utilisez une boucle for pour afficher les nombres de 1 à 5 (inclus) avec console.log.",
        starterCode: "// Écrivez votre boucle ici\n\n\n",
        solution: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
        validate: (code: string) => {
          if (/for\s*\(\s*let\s+i\s*=\s*1[\s\S]*i\s*<=\s*5[\s\S]*i\+\+[\s\S]*console\.log\s*\(\s*i\s*\)/.test(code)) {
            return { success: true, message: "Génial ! Votre boucle affiche bien les nombres de 1 à 5." };
          }
          return { success: false, message: "Utilisez `for (let i = 1; i <= 5; i++)` avec `console.log(i)` à l'intérieur." };
        },
      },
    },
  },
  {
    id: "js-arrays",
    order: 5,
    title: "Les Tableaux",
    module: "javascript",
    moduleName: "JavaScript : Les Bases",
    difficulty: "Intermédiaire",
    xp: 30,
    duration: "15 min",
    description: "Manipulez des listes de données : push, map, filter, reduce, et autres méthodes essentielles.",
    content: {
      intro: "Un tableau (array) est une collection ordonnée de valeurs. C'est l'une des structures de données les plus utilisées en JavaScript.",
      sections: [
        {
          title: "Créer et accéder",
          content: "Les tableaux utilisent des indices commençant à 0. `array.length` donne le nombre d'éléments.",
          codeExample: "const fruits = ['pomme', 'poire', 'cerise'];\nfruits[0];         // 'pomme'\nfruits.length;     // 3\nfruits[fruits.length - 1]; // 'cerise'",
          codeLanguage: "javascript",
        },
        {
          title: "Ajouter / supprimer",
          content: "`push()` ajoute à la fin, `pop()` supprime le dernier, `unshift()` ajoute au début, `shift()` supprime le premier.",
          codeExample: "const arr = [1, 2, 3];\narr.push(4);       // [1, 2, 3, 4]\narr.pop();         // [1, 2, 3]\narr.unshift(0);    // [0, 1, 2, 3]",
          codeLanguage: "javascript",
        },
        {
          title: "map, filter, reduce",
          content: "Ces méthodes fonctionnelles transforment les tableaux sans les modifier. `map` transforme chaque élément, `filter` garde ceux qui passent un test, `reduce` combine tous les éléments en une valeur.",
          codeExample: "const nbs = [1, 2, 3, 4];\nconst doubles = nbs.map(n => n * 2);     // [2, 4, 6, 8]\nconst pairs = nbs.filter(n => n % 2 === 0); // [2, 4]\nconst sum = nbs.reduce((a, b) => a + b, 0);  // 10",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Utilisez .map() pour créer un tableau `doubles` contenant le double de chaque nombre de [1, 2, 3].",
        starterCode: "const nombres = [1, 2, 3];\n\n// Utilisez .map() ici\nconst doubles = \n\n\nconsole.log(doubles); // doit afficher [2, 4, 6]",
        solution: "const nombres = [1, 2, 3];\nconst doubles = nombres.map(n => n * 2);\nconsole.log(doubles);",
        validate: (code: string) => {
          if (/nombres\.map\s*\(\s*n\s*=>\s*n\s*\*\s*2\s*\)/.test(code) || /nombres\.map\s*\(\s*function\s*\(\s*n\s*\)\s*\{[\s\S]*return[\s\S]*n\s*\*\s*2[\s\S]*\}\s*\)/.test(code)) {
            return { success: true, message: "Excellent ! Votre utilisation de .map() est parfaite." };
          }
          return { success: false, message: "Utilisez `nombres.map(n => n * 2)` pour doubler chaque élément." };
        },
      },
    },
  },
  {
    id: "js-objects",
    order: 6,
    title: "Les Objets",
    module: "javascript",
    moduleName: "JavaScript : Les Bases",
    difficulty: "Intermédiaire",
    xp: 30,
    duration: "15 min",
    description: "Structurez vos données avec des objets : propriétés, méthodes, destructuring, et syntaxe courte.",
    content: {
      intro: "Un objet est une collection de paires clé/valeur. C'est la façon la plus courante de représenter des données structurées en JavaScript.",
      sections: [
        {
          title: "Créer un objet",
          content: "Un objet littéral utilise des accolades. On accède aux propriétés avec `.` ou `[]`.",
          codeExample: "const user = {\n  nom: 'Alice',\n  age: 25,\n  email: 'alice@mail.com'\n};\nuser.nom;     // 'Alice'\nuser['age']; // 25",
          codeLanguage: "javascript",
        },
        {
          title: "Méthodes",
          content: "Une fonction dans un objet est une méthode. Le mot-clé `this` fait référence à l'objet lui-même.",
          codeExample: "const user = {\n  nom: 'Alice',\n  greet() {\n    return 'Bonjour, je suis ' + this.nom;\n  }\n};\nuser.greet(); // 'Bonjour, je suis Alice'",
          codeLanguage: "javascript",
        },
        {
          title: "Destructuring",
          content: "Extrayez des propriétés d'un objet en une seule ligne avec la syntaxe `{ propriété } = objet`.",
          codeExample: "const user = { nom: 'Alice', age: 25 };\nconst { nom, age } = user;\nconsole.log(nom); // 'Alice'\nconsole.log(age); // 25",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Créez un objet `personne` avec deux propriétés : `nom` (votre nom) et `age` (votre âge en nombre).",
        starterCode: "// Créez votre objet ici\nconst personne = \n\n\n\nconsole.log(personne.nom);\nconsole.log(personne.age);",
        solution: "const personne = {\n  nom: 'Alice',\n  age: 25\n};\nconsole.log(personne.nom);\nconsole.log(personne.age);",
        validate: (code: string) => {
          if (/personne\s*=\s*\{[\s\S]*nom\s*:[\s\S]*age\s*:\s*\d+[\s\S]*\}/.test(code)) {
            return { success: true, message: "Bravo ! Votre objet personne est bien structuré." };
          }
          return { success: false, message: "Créez un objet `personne` avec une propriété `nom` (texte) et `age` (nombre)." };
        },
      },
    },
  },
  {
    id: "web-html",
    order: 7,
    title: "Structure HTML",
    module: "web",
    moduleName: "Le Web : HTML & CSS",
    difficulty: "Débutant",
    xp: 20,
    duration: "10 min",
    description: "Les balises essentielles : html, head, body, titres, paragraphes, liens, images, listes.",
    content: {
      intro: "HTML (HyperText Markup Language) est le squelette de toute page web. Il structure le contenu avec des balises.",
      sections: [
        {
          title: "Structure de base",
          content: "Toute page HTML commence par `<!DOCTYPE html>`, puis contient `<html>`, `<head>` (métadonnées), et `<body>` (contenu visible).",
          codeExample: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Ma page</title>\n  </head>\n  <body>\n    <h1>Bonjour</h1>\n  </body>\n</html>",
          codeLanguage: "html",
        },
        {
          title: "Titres et textes",
          content: "`<h1>` à `<h6>` pour les titres (du plus grand au plus petit), `<p>` pour les paragraphes, `<strong>` pour le gras, `<em>` pour l'italique.",
          codeExample: "<h1>Titre principal</h1>\n<h2>Sous-titre</h2>\n<p>Un paragraphe avec <strong>du gras</strong> et <em>de l'italique</em>.</p>",
          codeLanguage: "html",
        },
        {
          title: "Liens et images",
          content: "`<a href='url'>` pour les liens, `<img src='url' alt='description'>` pour les images. L'attribut `alt` est crucial pour l'accessibilité.",
          codeExample: '<a href="https://example.com">Visiter</a>\n<img src="photo.jpg" alt="Une photo" />',
          codeLanguage: "html",
        },
      ],
      exercise: {
        prompt: "Créez un titre `<h1>` contenant le texte 'Bonjour'.",
        starterCode: "<!-- Écrivez votre titre HTML ici -->\n",
        solution: "<h1>Bonjour</h1>",
        validate: (code: string) => {
          if (/<h1[^>]*>\s*Bonjour\s*<\/h1>/i.test(code)) {
            return { success: true, message: "Parfait ! Votre titre HTML est correct." };
          }
          return { success: false, message: "Utilisez `<h1>Bonjour</h1>` (sans oublier les balises ouvrante et fermante)." };
        },
      },
    },
  },
  {
    id: "web-css",
    order: 8,
    title: "CSS : Le Style",
    module: "web",
    moduleName: "Le Web : HTML & CSS",
    difficulty: "Débutant",
    xp: 25,
    duration: "12 min",
    description: "Sélecteurs, propriétés essentielles (couleur, taille, marges) et le modèle de boîte CSS.",
    content: {
      intro: "CSS (Cascading Style Sheets) contrôle l'apparence de votre page web : couleurs, tailles, positions, animations.",
      sections: [
        {
          title: "Sélecteurs",
          content: "Ciblez des éléments par balise (`p`), classe (`.ma-classe`), ou id (`#mon-id`). Combinez-les pour être précis.",
          codeExample: "p { color: blue; }\n.titre { font-size: 24px; }\n#header { background: black; }",
          codeLanguage: "css",
        },
        {
          title: "Propriétés essentielles",
          content: "`color` (couleur du texte), `background` (fond), `font-size` (taille), `padding` (espace intérieur), `margin` (espace extérieur), `border` (bordure).",
          codeExample: ".carte {\n  color: white;\n  background: #6366f1;\n  font-size: 16px;\n  padding: 20px;\n  margin: 10px;\n  border-radius: 8px;\n}",
          codeLanguage: "css",
        },
        {
          title: "Le modèle de boîte",
          content: "Chaque élément est une boîte : content → padding → border → margin. Comprendre ce modèle est essentiel pour maîtriser le CSS.",
          codeExample: ".box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n  /* Largeur totale = 200 + 40 (padding) + 4 (border) = 244px */\n}",
          codeLanguage: "css",
        },
      ],
      exercise: {
        prompt: "Écrivez une règle CSS pour la classe `.rouge` qui met la couleur du texte en rouge.",
        starterCode: "/* Écrivez votre règle CSS ici */\n",
        solution: ".rouge {\n  color: red;\n}",
        validate: (code: string) => {
          if (/\.rouge\s*\{[\s\S]*color\s*:\s*red[\s\S]*\}/i.test(code)) {
            return { success: true, message: "Excellent ! Votre règle CSS est correcte." };
          }
          return { success: false, message: "Utilisez `.rouge { color: red; }` pour mettre le texte en rouge." };
        },
      },
    },
  },
  {
    id: "web-fizzbuzz",
    order: 9,
    title: "Défi : FizzBuzz",
    module: "web",
    moduleName: "Le Web : HTML & CSS",
    difficulty: "Avancé",
    xp: 50,
    duration: "20 min",
    description: "Le défi classique : combinez boucles, conditions et modulo pour résoudre FizzBuzz.",
    content: {
      intro: "FizzBuzz est LE défi classique d'entretien d'embauche. Il combine boucles, conditions et opérateur modulo (%) pour tester votre logique.",
      sections: [
        {
          title: "Le problème",
          content: "Pour chaque nombre de 1 à 100 :\n- Si divisible par 3 → afficher 'Fizz'\n- Si divisible par 5 → afficher 'Buzz'\n- Si divisible par 3 ET 5 → afficher 'FizzBuzz'\n- Sinon → afficher le nombre",
        },
        {
          title: "L'opérateur modulo",
          content: "Le modulo `%` renvoie le reste d'une division. `n % 3 === 0` est vrai si n est divisible par 3.",
          codeExample: "10 % 3; // 1 (10 = 3*3 + 1)\n9 % 3;  // 0 (9 divisible par 3)\n15 % 5; // 0 (15 divisible par 5)",
          codeLanguage: "javascript",
        },
        {
          title: "Stratégie",
          content: "1. Boucle de 1 à 100\n2. Testez d'abord la condition la plus spécifique (divisible par 3 ET 5)\n3. Puis les conditions individuelles\n4. Sinon, affichez le nombre",
          codeExample: "for (let i = 1; i <= 100; i++) {\n  if (i % 3 === 0 && i % 5 === 0) console.log('FizzBuzz');\n  else if (i % 3 === 0) console.log('Fizz');\n  else if (i % 5 === 0) console.log('Buzz');\n  else console.log(i);\n}",
          codeLanguage: "javascript",
        },
      ],
      exercise: {
        prompt: "Pour les nombres de 1 à 15, affichez 'Fizz' si divisible par 3, 'Buzz' si divisible par 5, 'FizzBuzz' si divisible par les deux, sinon le nombre.",
        starterCode: "// Écrivez votre solution FizzBuzz ici\nfor (let i = 1; i <= 15; i++) {\n  \n\n\n}\n",
        solution: "for (let i = 1; i <= 15; i++) {\n  if (i % 3 === 0 && i % 5 === 0) console.log('FizzBuzz');\n  else if (i % 3 === 0) console.log('Fizz');\n  else if (i % 5 === 0) console.log('Buzz');\n  else console.log(i);\n}",
        validate: (code: string) => {
          if (/i\s*%\s*3\s*===\s*0[\s\S]*i\s*%\s*5\s*===\s*0[\s\S]*FizzBuzz[\s\S]*Fizz[\s\S]*Buzz/.test(code) && /for\s*\(/.test(code)) {
            return { success: true, message: "Incroyable ! Vous avez résolu FizzBuzz, le défi classique des entretiens techniques ! 🎉" };
          }
          return { success: false, message: "Utilisez une boucle for de 1 à 15, et testez : i%3===0 && i%5===0 → 'FizzBuzz', i%3===0 → 'Fizz', i%5===0 → 'Buzz', sinon le nombre." };
        },
      },
    },
  },
];

export const BADGES = [
  { id: "first-lesson", icon: "🎯", title: "Premier pas", description: "Terminez votre première leçon", condition: (completedCount: number) => completedCount >= 1 },
  { id: "js-master", icon: "⚡", title: "Maître JavaScript", description: "Terminez toutes les leçons JavaScript", condition: (completedLessons: string[]) => completedLessons.filter(id => id.startsWith("js-")).length >= 6 },
  { id: "web-master", icon: "🎨", title: "Maître du Web", description: "Terminez toutes les leçons HTML/CSS", condition: (completedLessons: string[]) => completedLessons.filter(id => id.startsWith("web-")).length >= 3 },
  { id: "halfway", icon: "🌟", title: "À mi-chemin", description: "Terminez 5 leçons", condition: (completedCount: number) => completedCount >= 5 },
  { id: "fizzbuzz-hero", icon: "🏆", title: "Héros FizzBuzz", description: "Réussissez le défi FizzBuzz", condition: (completedLessons: string[]) => completedLessons.includes("web-fizzbuzz") },
  { id: "completionist", icon: "👑", title: "Achèvement total", description: "Terminez les 9 leçons", condition: (completedCount: number) => completedCount >= 9 },
];

export const RANKS = [
  { min: 0, name: "Apprenti", icon: "🌱" },
  { min: 50, name: "Codeur", icon: "💻" },
  { min: 120, name: "Développeur", icon: "🚀" },
  { min: 200, name: "Ingénieur", icon: "⚙️" },
  { min: 280, name: "Architecte", icon: "🏰" },
  { min: 400, name: "Légende", icon: "👑" },
];

export function getRank(xp: number) {
  let current = RANKS[0];
  let next = RANKS[1] ?? null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    } else break;
  }
  return { current, next };
}

export function getLevel(xp: number) {
  // Chaque niveau = 150 XP
  const level = Math.floor(xp / 150) + 1;
  const xpInLevel = xp % 150;
  return { level, xpInLevel, xpForNext: 150 };
}
