"use client";

import { useRouter } from "next/navigation";
import { Clock, BookOpen, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getDifficultyColor } from "@/lib/utils";
import { Quiz, QuizCategory } from "@/lib/types";

interface QuizCardProps {
  quiz: Quiz;
  category?: QuizCategory;
  index?: number;
}

export function QuizCard({ quiz, category }: QuizCardProps) {
  const router = useRouter();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border-[3px] border-border bg-raised transition-all hover:-translate-x-1 hover:-translate-y-1 hover:border-primary hover:shadow-[6px_6px_0_0_var(--acid)]">
      <div className="h-2 bg-primary" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-meta">{category?.name ?? "General"}</span>
          <span
            className={cn(
              "rounded-md border-2 px-2 py-0.5 text-[10px] font-bold uppercase",
              getDifficultyColor(quiz.difficulty)
            )}
          >
            {quiz.difficulty}
          </span>
        </div>
        <h3 className="font-display text-lg leading-snug text-foreground group-hover:text-primary">
          {quiz.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm font-semibold text-muted-foreground">
          {quiz.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-acid" />
            {quiz.totalQuestions}Q
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-spark" />
            {quiz.timeLimit}m
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-signal" />
            {quiz.rating}
          </span>
        </div>
      </div>
      <div className="border-t-[3px] border-border p-3">
        <Button className="w-full" onClick={() => router.push(`/quiz/${quiz.id}`)}>
          <Play className="mr-2 h-4 w-4" />
          Play
        </Button>
      </div>
    </article>
  );
}
