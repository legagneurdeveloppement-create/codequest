"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "codequest-progress-v1";

export interface Progress {
  completedLessons: string[];
  totalXp: number;
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  totalXp: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Progress;
        if (parsed && Array.isArray(parsed.completedLessons)) {
          setProgress({
            completedLessons: parsed.completedLessons,
            totalXp: parsed.totalXp || 0,
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress, loaded]);

  const completeLesson = useCallback((lessonId: string, xp: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev; // déjà complété
      }
      return {
        completedLessons: [...prev.completedLessons, lessonId],
        totalXp: prev.totalXp + xp,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const isCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  return {
    progress,
    completeLesson,
    resetProgress,
    isCompleted,
    loaded,
  };
}
