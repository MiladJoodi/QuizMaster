"use client";

import { Clock, Pause, Play, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatTimer } from "@/lib/utils";

interface QuizStatusBarProps {
  title: string;
  categoryName?: string;
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  timeRemaining: number;
  totalSeconds: number;
  isTimerRunning: boolean;
  onPauseToggle: () => void;
  onExit: () => void;
}

export function QuizStatusBar({
  title,
  categoryName,
  currentIndex,
  totalQuestions,
  answeredCount,
  timeRemaining,
  totalSeconds,
  isTimerRunning,
  onPauseToggle,
  onExit,
}: QuizStatusBarProps) {
  const pct = totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 0;
  const urgent = pct <= 25;
  const warning = pct <= 50 && pct > 25;

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-raised">
      <div className="h-1.5 hazard-stripe" />
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={onExit}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-sm text-primary sm:text-base">
            {title}
          </h1>
          <p className="text-meta mt-0.5 !text-spark">
            {categoryName ? `${categoryName} · ` : ""}
            Q{currentIndex + 1}/{totalQuestions} · {answeredCount} LOCKED
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-md border-[3px] px-3 py-1.5 font-mono-score text-xl font-bold tabular-nums",
            urgent &&
              "border-destructive bg-destructive text-destructive-foreground animate-pulse",
            warning &&
              !urgent &&
              "border-signal bg-signal text-signal-foreground",
            !warning &&
              !urgent &&
              "border-acid bg-inset text-acid shadow-[3px_3px_0_0_var(--primary)]"
          )}
        >
          {urgent ? <Flame className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          {formatTimer(timeRemaining)}
        </div>

        <Button variant="outline" size="icon" className="h-11 w-11" onClick={onPauseToggle}>
          {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="h-2 w-full bg-inset">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            urgent ? "bg-destructive" : warning ? "bg-signal" : "bg-acid"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
}
