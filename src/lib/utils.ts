import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TokenType = "keyword" | "string" | "comment" | "number" | "function" | "plain";

interface Token {
  type: TokenType;
  value: string;
}

/**
 * Tokenizer très simple pour JS/HTML/CSS.
 * On parcourt le code une seule fois, caractère par caractère, en extrayant
 * les tokens dans l'ordre de priorité :
 *   1. Commentaires (// ... ou /* ... *​/ ou <!-- ... -->)
 *   2. Strings ("..." '...' `...`)
 *   3. Identifiants (mot-clé ou fonction si suivi de `(`)
 *   4. Nombres
 *   5. Tout le reste (plain)
 *
 * On évite ainsi le bug classique où un regex remplace le contenu d'un span
 * déjà inséré par un autre regex.
 */
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = code.length;
  let buf = "";

  function flush() {
    if (buf) {
      tokens.push({ type: "plain", value: buf });
      buf = "";
    }
  }

  const KEYWORDS = new Set([
    "function", "const", "let", "var", "return", "if", "else", "for", "while",
    "do", "switch", "case", "break", "continue", "new", "class", "extends",
    "super", "this", "typeof", "instanceof", "true", "false", "null",
    "undefined", "in", "of", "try", "catch", "finally", "throw", "async",
    "await", "yield", "import", "export", "default", "from",
  ]);

  while (i < n) {
    const ch = code[i];
    const next = code[i + 1] ?? "";

    // Commentaires // ...
    if (ch === "/" && next === "/") {
      flush();
      let end = code.indexOf("\n", i);
      if (end === -1) end = n;
      tokens.push({ type: "comment", value: code.slice(i, end) });
      i = end;
      continue;
    }
    // Commentaires /* ... */
    if (ch === "/" && next === "*") {
      flush();
      let end = code.indexOf("*/", i + 2);
      end = end === -1 ? n : end + 2;
      tokens.push({ type: "comment", value: code.slice(i, end) });
      i = end;
      continue;
    }
    // Commentaires HTML <!-- ... -->
    if (ch === "<" && next === "!" && code.slice(i, i + 4) === "<!--") {
      flush();
      let end = code.indexOf("-->", i + 4);
      end = end === -1 ? n : end + 3;
      tokens.push({ type: "comment", value: code.slice(i, end) });
      i = end;
      continue;
    }
    // Strings "..." '...' `...`
    if (ch === '"' || ch === "'" || ch === "`") {
      flush();
      const quote = ch;
      let j = i + 1;
      while (j < n) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === quote) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Identifiants
    if (/[a-zA-Z_$]/.test(ch)) {
      flush();
      let j = i + 1;
      while (j < n && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // Vérifie si suivi de `(` (fonction) — en sautant les espaces
      let k = j;
      while (k < n && /\s/.test(code[k])) k++;
      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (code[k] === "(") {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      i = j;
      continue;
    }
    // Nombres
    if (/\d/.test(ch)) {
      flush();
      let j = i + 1;
      while (j < n && /[\d.]/.test(code[j])) j++;
      tokens.push({ type: "number", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Sinon : accumuler
    buf += ch;
    i++;
  }
  flush();
  return tokens;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Colorise du code JavaScript/HTML/CSS pour affichage.
 * Renvoie du HTML avec spans .keyword/.string/.comment/.number/.function.
 */
export function highlightCode(
  code: string,
  _lang: "javascript" | "html" | "css" = "javascript"
): string {
  const tokens = tokenize(code);
  return tokens
    .map((t) => {
      const escaped = escapeHtml(t.value);
      if (t.type === "plain") return escaped;
      return `<span class="${t.type}">${escaped}</span>`;
    })
    .join("");
}
