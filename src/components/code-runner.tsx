"use client";

import { useState } from "react";
import { Play, Terminal } from "lucide-react";

/**
 * Exécute du code JavaScript en sandbox en capturant les appels console.*.
 * Utilisé par CodeRunner ET par LessonView (pour le défi).
 */
export function runJavaScript(code: string): {
  output: string;
  error: string | null;
} {
  const lines: string[] = [];

  const sandboxConsole = {
    log: (...args: unknown[]) => lines.push(args.map(formatArg).join(" ")),
    info: (...args: unknown[]) => lines.push(args.map(formatArg).join(" ")),
    warn: (...args: unknown[]) =>
      lines.push("[attention] " + args.map(formatArg).join(" ")),
    error: (...args: unknown[]) =>
      lines.push("[erreur] " + args.map(formatArg).join(" ")),
    debug: (...args: unknown[]) => lines.push(args.map(formatArg).join(" ")),
  };

  try {
    // Sandbox : on passe notre console maison au code utilisateur.
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code);
    fn(sandboxConsole);
    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return {
      output: lines.join("\n"),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function formatArg(arg: unknown): string {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "string") return arg;
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}

/**
 * Construit un document HTML complet pour l'aperçu iframe (HTML ou CSS).
 */
export function buildPreviewDoc(
  code: string,
  language: "html" | "css"
): string {
  if (language === "html") {
    if (/<html/i.test(code)) return code;
    return (
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>" +
      "body{font-family:system-ui,-apple-system,sans-serif;padding:16px;margin:0;background:#fff;color:#111}" +
      "</style></head><body>" +
      code +
      "</body></html>"
    );
  }
  // CSS : on enveloppe dans un mini document avec des éléments de démo.
  return (
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>" +
    code +
    "</style></head><body style=\"font-family:system-ui,sans-serif;padding:16px;margin:0;background:#fff;color:#111\">" +
    "<h1 class=\"rouge\" style=\"font-size:24px;margin:0 0 8px\">Titre de démonstration</h1>" +
    "<p class=\"rouge\">Paragraphe d'exemple.</p>" +
    "<div>Bloc normal.</div>" +
    "</body></html>"
  );
}

interface CodeRunnerProps {
  code: string;
  onOutput?: (output: string) => void;
  onError?: (error: string) => void;
  language?: "javascript" | "html" | "css";
}

/**
 * Bac à sable d'exécution : bouton "Exécuter le code" + affichage console
 * (JS) ou aperçu iframe (HTML/CSS). Utilisé pour les exemples de sections.
 */
export function CodeRunner({
  code,
  onOutput,
  onError,
  language = "javascript",
}: CodeRunnerProps) {
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [ran, setRan] = useState(false);

  const handleRun = () => {
    setRan(true);
    if (language === "javascript") {
      const { output: out, error: err } = runJavaScript(code);
      setOutput(out);
      setError(err);
      onOutput?.(out);
      if (err) onError?.(err);
    } else {
      // HTML/CSS : l'iframe se met à jour automatiquement via srcDoc.
      setOutput("");
      setError(null);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleRun}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] text-xs font-semibold border border-[var(--primary)]/30 hover:bg-[var(--primary)]/25 transition"
        aria-label="Exécuter le code"
      >
        <Play className="w-3.5 h-3.5" /> Exécuter le code
      </button>

      {ran && language === "javascript" && (
        <div className="mt-2 rounded-lg border border-[var(--border)] bg-[#0d0d18] p-2.5 font-mono text-xs whitespace-pre-wrap min-h-[40px]">
          <div className="flex items-center gap-1 text-[var(--text-muted)]/70 text-[10px] uppercase tracking-wider mb-1">
            <Terminal className="w-3 h-3" /> Console
          </div>
          {output && <div className="text-[#a1a1aa]">{output}</div>}
          {error && <div className="text-[var(--danger)]">Erreur : {error}</div>}
          {!output && !error && (
            <span className="text-[var(--text-muted)] italic">
              (aucune sortie)
            </span>
          )}
        </div>
      )}

      {ran && language !== "javascript" && (
        <iframe
          title="Aperçu du rendu"
          sandbox="allow-scripts"
          srcDoc={buildPreviewDoc(code, language)}
          className="mt-2 w-full h-40 rounded-lg border border-[var(--border)] bg-white"
        />
      )}
    </div>
  );
}

export default CodeRunner;
