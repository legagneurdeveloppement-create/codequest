"use client";

import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: {
    id: string;
    icon: string;
    title: string;
    description: string;
  };
  earned: boolean;
}

/**
 * Carte de badge : colorée et brillante si débloquée,
 * grisée et atténuée si verrouillée.
 */
export function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex flex-col items-center text-center transition",
        earned
          ? "border-[var(--primary)]/40 bg-[var(--primary)]/5 animate-pulse-glow"
          : "border-[var(--border)] bg-[var(--surface)] opacity-50"
      )}
      role="img"
      aria-label={`Badge ${badge.title}${earned ? " — débloqué" : " — verrouillé"}`}
    >
      <div
        className={cn(
          "text-4xl mb-2 leading-none",
          !earned && "grayscale"
        )}
        aria-hidden
      >
        {badge.icon}
      </div>
      <div
        className={cn(
          "text-sm font-semibold leading-tight",
          earned ? "text-[var(--text)]" : "text-[var(--text-muted)]"
        )}
      >
        {badge.title}
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-1 leading-snug">
        {badge.description}
      </div>
      <div
        className={cn(
          "mt-2 text-[10px] uppercase tracking-wider font-bold",
          earned ? "text-[var(--primary)]" : "text-[var(--text-muted)]/60"
        )}
      >
        {earned ? "Débloqué" : "Verrouillé"}
      </div>
    </div>
  );
}

export default BadgeCard;
