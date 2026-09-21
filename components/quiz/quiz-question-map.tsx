"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface QuizQuestionMapProps {
  total: number;
  currentIndex: number;
  answeredIds: Set<string>;
  flaggedIds: Set<string>;
  questionIds: string[];
  onGoTo: (index: number) => void;
  onSubmit?: () => void;
  showSubmit?: boolean;
  columns?: number;
}

export function QuizQuestionMap({
  total,
  currentIndex,
  answeredIds,
  flaggedIds,
  questionIds,
  onGoTo,
  onSubmit,
  showSubmit = true,
  columns = 5,
}: QuizQuestionMapProps) {
  const answeredCount = answeredIds.size;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-meta">Board</span>
          <span className="font-mono-score text-sm font-bold tabular-nums text-acid">
            {answeredCount}/{total}
          </span>
        </div>
        <Progress value={progress} className="h-2.5 rounded-md" />
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {questionIds.map((id, index) => {
          const isAnswered = answeredIds.has(id);
          const isFlagged = flaggedIds.has(id);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onGoTo(index)}
              className={cn(
                "relative flex h-10 cursor-pointer items-center justify-center rounded-md font-mono-score text-xs font-bold transition-all",
                isCurrent &&
                  "ring-2 ring-acid ring-offset-2 ring-offset-background shadow-[3px_3px_0_0_var(--primary)]",
                isAnswered
                  ? "border-[2px] border-primary bg-primary text-primary-foreground"
                  : "border-[2px] border-border bg-raised text-muted-foreground hover:border-primary hover:text-primary",
                isFlagged && !isAnswered && "border-signal text-signal bg-signal/15"
              )}
            >
              {index + 1}
              {isFlagged && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-signal shadow-[0_0_6px_var(--signal)]" />
              )}
            </button>
          );
        })}
      </div>

      {showSubmit && onSubmit && (
        <Button className="w-full" size="lg" onClick={onSubmit}>
          <Send className="mr-2 h-4 w-4" />
          Finish round
        </Button>
      )}
    </div>
  );
}
