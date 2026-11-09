"use client";

import Link from "next/link";
import { Check, Lock, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/data/lessons";

const difficultyStyles: Record<Lesson["difficulty"], string> = {
  Débutant: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermédiaire:
    "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20",
  Avancé: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
};

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  index: number;
  locked?: boolean;
}

/**
 * Ligne de leçon dans le tableau de bord : numéro/titre/difficulté/XP
 * + coche si complétée, cadenas si la leçon précédente n'est pas faite.
 */
export function LessonCard({
  lesson,
  completed,
  index,
  locked = false,
}: LessonCardProps) {
  const stateLabel = completed
    ? "complétée"
    : locked
      ? "verrouillée"
      : "à faire";

  return (
    <Link
      href={`/lecon/${lesson.id}`}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 border border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-2)] transition"
      aria-label={`Leçon ${index + 1} : ${lesson.title} — ${lesson.difficulty} — ${lesson.xp} XP — ${stateLabel}`}
    >
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm",
          completed
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-[var(--surface-2)] text-[var(--text-muted)]"
        )}
        aria-hidden
      >
        {completed ? <Check className="w-4 h-4" /> : lesson.order}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-[var(--text)] truncate">
          {lesson.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs flex-wrap">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded border",
              difficultyStyles[lesson.difficulty]
            )}
          >
            {lesson.difficulty}
          </span>
          <span className="text-[var(--text-muted)]">⏱ {lesson.duration}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-0.5">
          <Zap className="w-3 h-3" />
          {lesson.xp}
        </span>
        {locked && !completed ? (
          <Lock
            className="w-4 h-4 text-[var(--text-muted)]"
            aria-label="Verrouillée"
          />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text)] transition" />
        )}
      </div>
    </Link>
  );
}

export default LessonCard;
