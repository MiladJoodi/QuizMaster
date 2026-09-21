"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizAnswerOptionProps {
  label: string;
  text: string;
  selected: boolean;
  multiSelect?: boolean;
  onSelect: () => void;
}

export function QuizAnswerOption({
  label,
  text,
  selected,
  multiSelect,
  onSelect,
}: QuizAnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full min-h-[4.5rem] cursor-pointer items-center gap-4 rounded-lg border-[3px] px-4 py-4 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-acid bg-primary text-primary-foreground shadow-[6px_6px_0_0_var(--acid),0_0_28px_color-mix(in_srgb,var(--primary)_45%,transparent)] -translate-x-0.5 -translate-y-0.5"
          : "border-border bg-raised hover:border-primary hover:shadow-[4px_4px_0_0_var(--primary)] active:translate-x-[2px] active:translate-y-[2px]"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-display text-lg transition-colors",
          selected
            ? "bg-acid text-accent-foreground shadow-[0_0_16px_color-mix(in_srgb,var(--acid)_55%,transparent)]"
            : "border-[3px] border-border bg-inset text-acid"
        )}
      >
        {multiSelect && selected ? <Check className="h-6 w-6" /> : label}
      </span>
      <span className="flex-1 text-base font-bold leading-snug">{text}</span>
    </button>
  );
}
