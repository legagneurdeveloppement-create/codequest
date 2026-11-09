"use client";

import { useEffect, useMemo, useState } from "react";

const EMOJIS = ["🎉", "⭐", "✨", "🏆", "💯"];
const PIECE_COUNT = 50;
const DURATION_MS = 3000;

interface ConfettiProps {
  trigger: boolean;
}

interface Piece {
  id: number;
  emoji: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Animation de confettis (emoji) déclenchée quand `trigger` passe à true.
 * ~50 pièces tombent du haut de l'écran, puis disparaissent après 3s.
 */
export function Confetti({ trigger }: ConfettiProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), DURATION_MS);
    return () => clearTimeout(t);
  }, [trigger]);

  const pieces = useMemo<Piece[]>(() => {
    if (!active) return [];
    return Array.from({ length: PIECE_COUNT }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100,
      size: 14 + Math.random() * 18,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.2,
    }));
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-30px",
            fontSize: `${p.size}px`,
            animation: `confetti ${p.duration}s ease-in ${p.delay}s forwards`,
            willChange: "transform, opacity",
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default Confetti;
