"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Code,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { AppToolbar } from "@/components/app-toolbar";
import { Header } from "@/components/header";
import { Confetti } from "@/components/confetti";
import {
  CodeRunner,
  buildPreviewDoc,
  runJavaScript,
} from "@/components/code-runner";
import { useProgress } from "@/hooks/use-progress";
import { LESSONS, type Lesson } from "@/data/lessons";
import { cn, highlightCode } from "@/lib/utils";

function getExerciseLanguage(
  lesson: Lesson
): "javascript" | "html" | "css" {
  if (lesson.id === "web-html") return "html";
  if (lesson.id === "web-css") return "css";
  return "javascript";
}

const difficultyStyles: Record<Lesson["difficulty"], string> = {
  Débutant: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermédiaire:
    "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20",
  Avancé: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
};

/** Rendu inline très simple : **gras** et `code`. */
function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--text)]">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("`") && tok.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--primary)] font-mono text-[0.85em]"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}

/** Rendu du contenu d'une section : paragraphes + listes à puces. */
function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("- ")) {
      return (
        <div key={i} className="ml-3 flex gap-2">
          <span className="text-[var(--primary)] flex-shrink-0">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" aria-hidden />;
    return (
      <p key={i} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });
}

interface LessonViewProps {
  lessonId: string;
}

export function LessonView({ lessonId }: LessonViewProps) {
  const { completeLesson, isCompleted } = useProgress();

  const lesson = useMemo(
    () => LESSONS.find((l) => l.id === lessonId),
    [lessonId]
  );

  const [code, setCode] = useState(
    () => lesson?.content.exercise.starterCode ?? ""
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    { success: boolean; message: string } | null
  >(null);
  const [showSolution, setShowSolution] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Réinitialise l'éditeur quand on change de leçon.
  useEffect(() => {
    const l = LESSONS.find((x) => x.id === lessonId);
    if (l) {
      setCode(l.content.exercise.starterCode);
      setOutput("");
      setError(null);
      setResult(null);
      setShowSolution(false);
      setHasRun(false);
      setShowConfetti(false);
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="min-h-screen">
        <AppToolbar />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1
            className="text-2xl font-bold mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Leçon introuvable
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            Cette leçon n&apos;existe pas ou a été déplacée.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-semibold hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
          </Link>
        </main>
      </div>
    );
  }

  const exerciseLang = getExerciseLanguage(lesson);
  const alreadyCompleted = isCompleted(lesson.id);

  const currentIndex = LESSONS.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const handleRun = () => {
    setHasRun(true);
    setError(null);
    setOutput("");

    if (exerciseLang === "javascript") {
      const { output: out, error: err } = runJavaScript(code);
      setOutput(out);
      if (err) setError(err);
    }

    const validation = lesson.content.exercise.validate(code);
    setResult(validation);

    if (validation.success && !alreadyCompleted) {
      completeLesson(lesson.id, lesson.xp);
      setShowConfetti(true);
    }
  };

  const handleReset = () => {
    setCode(lesson.content.exercise.starterCode);
    setOutput("");
    setError(null);
    setResult(null);
    setHasRun(false);
  };

  return (
    <div className="min-h-screen">
      <AppToolbar />
      <Confetti trigger={showConfetti} />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <Header size="sm" showBack />

        {/* Bannière "déjà complétée" */}
        {alreadyCompleted && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-2 text-emerald-400 animate-fade-in">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">
              Leçon complétée — vous pouvez la refaire ou passer à la suite.
            </span>
          </div>
        )}

        {/* Métadonnées */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full border font-medium",
              difficultyStyles[lesson.difficulty]
            )}
          >
            {lesson.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
            ⏱ {lesson.duration}
          </span>
          <span className="px-2.5 py-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
            ⚡ {lesson.xp} XP
          </span>
          <span className="px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
            {lesson.moduleName}
          </span>
        </div>

        <h1
          className="mt-4 text-3xl sm:text-4xl font-bold text-[var(--text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {lesson.title}
        </h1>
        <p className="mt-3 italic text-[var(--text-muted)] leading-relaxed">
          {lesson.content.intro}
        </p>

        {/* Sections de cours */}
        <div className="mt-8 space-y-4">
          {lesson.content.sections.map((section, i) => (
            <section
              key={i}
              className="glass rounded-2xl border border-[var(--border)] p-5 animate-fade-in"
            >
              <h2
                className="text-lg font-semibold mb-2 flex items-center gap-2 text-[var(--text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <BookOpen className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                {section.title}
              </h2>
              <div className="text-sm text-[var(--text-muted)] space-y-1">
                {renderContent(section.content)}
              </div>
              {section.codeExample && (
                <div className="mt-4">
                  <pre
                    className="code-block"
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(
                        section.codeExample,
                        section.codeLanguage ?? "javascript"
                      ),
                    }}
                  />
                  <CodeRunner
                    code={section.codeExample}
                    language={section.codeLanguage ?? "javascript"}
                  />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Défi */}
        <section
          className="mt-8 rounded-2xl border-2 border-[var(--primary)]/40 bg-[var(--surface)] overflow-hidden animate-fade-in"
          aria-labelledby="exercise-heading"
        >
          <div className="bg-[var(--primary)]/10 p-4 border-b border-[var(--primary)]/20 flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--primary)]" />
            <h2
              id="exercise-heading"
              className="text-lg font-bold text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Défi
            </h2>
            <span className="ml-auto text-xs text-[var(--primary)] font-semibold">
              +{lesson.xp} XP
            </span>
          </div>

          <div className="p-5">
            <p className="text-sm mb-4 leading-relaxed text-[var(--text)]">
              {lesson.content.exercise.prompt}
            </p>

            {/* Éditeur */}
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--surface-2)] border-b border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wide">
                  {exerciseLang}
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 transition"
                  aria-label="Réinitialiser le code de départ"
                >
                  <RotateCcw className="w-3 h-3" /> Réinitialiser
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full min-h-[200px] p-4 bg-[#0d0d18] text-[#e4e4e7] font-mono text-sm leading-relaxed resize-y outline-none"
                aria-label="Éditeur de code"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>

            {/* Boutons d'action */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleRun}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-semibold hover:opacity-90 transition"
                aria-label="Exécuter le code et valider le défi"
              >
                <Play className="w-4 h-4" /> Exécuter
              </button>
              <button
                onClick={() => setShowSolution((s) => !s)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition"
                aria-label="Afficher ou cacher la solution"
              >
                <Lightbulb className="w-4 h-4" />
                {showSolution ? "Cacher la solution" : "Voir la solution"}
              </button>
            </div>

            {/* Sortie console (JS) */}
            {hasRun && exerciseLang === "javascript" && (
              <div className="mt-4">
                <div className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1">
                  <Code className="w-3 h-3" /> Sortie console
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[#0d0d18] p-3 font-mono text-sm min-h-[60px] whitespace-pre-wrap">
                  {output && (
                    <div className="text-[#a1a1aa]">{output}</div>
                  )}
                  {error && (
                    <div className="text-[var(--danger)]">Erreur : {error}</div>
                  )}
                  {!output && !error && (
                    <div className="text-[var(--text-muted)] italic">
                      (aucune sortie)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aperçu (HTML/CSS) */}
            {exerciseLang !== "javascript" && code.trim() && (
              <div className="mt-4">
                <div className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1">
                  <Code className="w-3 h-3" /> Aperçu du rendu
                </div>
                <iframe
                  title="Aperçu du rendu HTML/CSS"
                  sandbox="allow-scripts"
                  srcDoc={buildPreviewDoc(code, exerciseLang)}
                  className="w-full h-52 rounded-xl border border-[var(--border)] bg-white"
                />
              </div>
            )}

            {/* Solution */}
            {showSolution && (
              <div className="mt-4">
                <div className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Solution
                </div>
                <pre
                  className="code-block"
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(
                      lesson.content.exercise.solution,
                      exerciseLang
                    ),
                  }}
                />
              </div>
            )}

            {/* Résultat de validation */}
            {result && (
              <div
                className={cn(
                  "mt-4 rounded-xl border p-3 animate-scale-in",
                  result.success
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]"
                )}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-2 text-sm">
                  {result.success ? (
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="leading-relaxed">{result.message}</span>
                </div>
                {result.success && nextLesson && (
                  <Link
                    href={`/lecon/${nextLesson.id}`}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30 transition"
                  >
                    Leçon suivante <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Navigation bas de page */}
        <nav className="mt-8 flex items-center justify-between gap-3">
          {prevLesson ? (
            <Link
              href={`/lecon/${prevLesson.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition text-sm"
              aria-label={`Leçon précédente : ${prevLesson.title}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Précédent</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition text-sm"
          >
            Tableau de bord
          </Link>

          {nextLesson ? (
            <Link
              href={`/lecon/${nextLesson.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition text-sm"
              aria-label={`Leçon suivante : ${nextLesson.title}`}
            >
              <span className="hidden sm:inline">Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  );
}

export default LessonView;
