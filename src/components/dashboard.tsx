"use client";

import { useMemo } from "react";
import { AppToolbar } from "@/components/app-toolbar";
import { Header } from "@/components/header";
import { BadgeCard } from "@/components/badge-card";
import { LessonCard } from "@/components/lesson-card";
import { useProgress } from "@/hooks/use-progress";
import {
  BADGES,
  LESSONS,
  MODULES,
  getLevel,
  getRank,
  type Lesson,
} from "@/data/lessons";

// Les fonctions `condition` des badges ont des signatures hétérogènes
// (certaines prennent un nombre, d'autres un tableau d'ids). On dispatche
// selon l'id pour appeler correctement chacune.
const ARRAY_BADGE_IDS = new Set(["js-master", "web-master", "fizzbuzz-hero"]);

type AnyBadge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: (arg: number | string[]) => boolean;
};

function isBadgeEarned(
  badge: AnyBadge,
  count: number,
  ids: string[]
): boolean {
  return ARRAY_BADGE_IDS.has(badge.id)
    ? badge.condition(ids)
    : badge.condition(count);
}

type ModuleKey = keyof typeof MODULES;

export function Dashboard() {
  const { progress, loaded } = useProgress();

  const { totalXp, completedLessons } = progress;
  const completedCount = completedLessons.length;

  const { level, xpInLevel, xpForNext } = getLevel(totalXp);
  const { current: rank, next: nextRank } = getRank(totalXp);

  const modules: ModuleKey[] = ["javascript", "web"];

  const moduleStats = useMemo(() => {
    const stats: Record<ModuleKey, { lessons: Lesson[]; completed: number }> =
      {
        javascript: { lessons: [], completed: 0 },
        web: { lessons: [], completed: 0 },
      };
    for (const m of modules) {
      const lessons = LESSONS.filter((l) => l.module === m).sort(
        (a, b) => a.order - b.order
      );
      const completed = lessons.filter((l) =>
        completedLessons.includes(l.id)
      ).length;
      stats[m] = { lessons, completed };
    }
    return stats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedLessons]);

  return (
    <div className="min-h-screen">
      <AppToolbar />
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <Header size="lg" />

        {/* Barre de stats */}
        <section
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
          aria-label="Statistiques du joueur"
        >
          {/* Niveau */}
          <div className="glass rounded-2xl border border-[var(--border)] p-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Niveau
              </span>
              <span aria-hidden>⭐</span>
            </div>
            <div
              className="text-4xl font-bold mt-2 text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {level}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Niveau {level}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
                <span>{xpInLevel} XP</span>
                <span>{xpForNext} XP</span>
              </div>
              <div
                className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={xpInLevel}
                aria-valuemin={0}
                aria-valuemax={xpForNext}
                aria-label="Progression vers le niveau suivant"
              >
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (xpInLevel / xpForNext) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* XP total */}
          <div className="glass rounded-2xl border border-[var(--border)] p-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                XP total
              </span>
              <span aria-hidden>⚡</span>
            </div>
            <div
              className="text-4xl font-bold mt-2 text-[var(--primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {totalXp}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Points XP
            </div>
            <div className="text-[11px] text-[var(--text-muted)]/70 mt-3">
              {completedCount} / {LESSONS.length} leçons terminées
            </div>
          </div>

          {/* Rang */}
          <div className="glass rounded-2xl border border-[var(--border)] p-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Rang
              </span>
              <span aria-hidden>🏆</span>
            </div>
            <div
              className="text-2xl font-bold mt-2 text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="mr-1.5" aria-hidden>
                {rank.icon}
              </span>
              {rank.name}
            </div>
            {nextRank ? (
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Prochain : {nextRank.icon} {nextRank.name}{" "}
                <span className="text-[var(--primary)]">
                  ({nextRank.min - totalXp} XP restants)
                </span>
              </div>
            ) : (
              <div className="text-xs text-[var(--primary)] mt-1">
                Rang maximal atteint !
              </div>
            )}
          </div>
        </section>

        {/* Badges */}
        <section className="mt-10" aria-labelledby="badges-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="badges-heading"
              className="text-xl font-bold text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              🏅 Badges
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              {BADGES.filter((b) =>
                isBadgeEarned(
                  b as unknown as AnyBadge,
                  completedCount,
                  completedLessons
                )
              ).length}{" "}
              / {BADGES.length} débloqués
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BADGES.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={isBadgeEarned(
                  badge as unknown as AnyBadge,
                  completedCount,
                  completedLessons
                )}
              />
            ))}
          </div>
        </section>

        {/* Modules / Tableau de bord */}
        <section className="mt-10" aria-labelledby="modules-heading">
          <h2
            id="modules-heading"
            className="text-xl font-bold text-[var(--text)] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tableau de bord
          </h2>
          <div className="space-y-6">
            {modules.map((m) => (
              <ModuleCard
                key={m}
                moduleKey={m}
                lessons={moduleStats[m].lessons}
                completed={moduleStats[m].completed}
                completedLessons={completedLessons}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)] space-y-1">
          <p className="font-medium text-[var(--text)]">
            CodeQuest — Apprends à coder en t&apos;amusant
          </p>
          <p>{LESSONS.length} leçons • 100% gratuit</p>
          <p>
            Fait avec <span className="text-[var(--accent)]">❤</span> pour les
            apprenants
          </p>
        </footer>
      </main>

      {/* Discret indicateur de chargement (évite le flash visuel) */}
      {!loaded && (
        <div className="sr-only" aria-live="polite">
          Chargement de votre progression…
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  moduleKey,
  lessons,
  completed,
  completedLessons,
}: {
  moduleKey: ModuleKey;
  lessons: Lesson[];
  completed: number;
  completedLessons: string[];
}) {
  const module = MODULES[moduleKey];
  const accentColor =
    moduleKey === "javascript" ? "var(--accent-2)" : "var(--accent)";
  const total = module.total;

  return (
    <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in">
      {/* En-tête dégradé */}
      <div
        className={`bg-gradient-to-r ${module.gradient} p-5 flex items-center gap-4`}
      >
        <div className="text-4xl flex-shrink-0" aria-hidden>
          {module.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg sm:text-xl font-bold text-white truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {module.name}
          </h3>
          <p className="text-white/85 text-sm">
            {completed} / {total} leçons
          </p>
        </div>
        <div
          className="text-2xl font-bold text-white/90"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden
        >
          {Math.round((completed / total) * 100)}%
        </div>
      </div>

      {/* Barre de progression */}
      <div className="px-5 pt-4">
        <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(completed / total) * 100}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* Liste des leçons */}
      <div className="p-3 space-y-0.5">
        {lessons.map((lesson, i) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const prev = lessons[i - 1];
          const locked = !!prev && !completedLessons.includes(prev.id);
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={isCompleted}
              index={i}
              locked={locked}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
