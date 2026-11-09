"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  size?: "sm" | "lg";
  showBack?: boolean;
}

/**
 * En-tête CodeQuest réutilisable : logo dégradé + titre + sous-titre.
 * Optionnellement un bouton "Retour" vers le tableau de bord.
 */
export function Header({ size = "lg", showBack = false }: HeaderProps) {
  const logoBox = size === "lg" ? "w-16 h-16 text-3xl" : "w-11 h-11 text-xl";
  const titleClass = size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl";
  const subtitleClass = size === "lg" ? "text-base" : "text-xs";

  return (
    <header className="flex items-center gap-3 sm:gap-4">
      {showBack && (
        <Link
          href="/"
          aria-label="Retour au tableau de bord"
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition text-sm flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour</span>
        </Link>
      )}

      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] shadow-lg flex-shrink-0",
          logoBox
        )}
        style={{ fontFamily: "var(--font-display)" }}
        aria-hidden
      >
        <span className="font-extrabold text-[var(--bg)] leading-none select-none">
          CQ
        </span>
      </div>

      <div className="min-w-0">
        <h1
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent leading-tight",
            titleClass
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          CodeQuest
        </h1>
        <p className={cn("text-[var(--text-muted)]", subtitleClass)}>
          Apprendre à coder
        </p>
      </div>
    </header>
  );
}

export default Header;
