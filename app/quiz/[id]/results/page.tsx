"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDuration, getGrade, getDifficultyColor } from "@/lib/utils";
import { quizzes, questions as allQuestions, quizAttempts, categories } from "@/lib/data";
import { chartColors, chartTooltipStyle } from "@/components/chart-theme";

export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = params.id as string;
  const attemptId = searchParams.get("attemptId");

  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [animatedScore, setAnimatedScore] = useState(0);

  const quiz = quizzes.find((q) => q.id === quizId);
  const attempt = quizAttempts.find((a) => a.id === attemptId);
  const category = quiz ? categories.find((c) => c.id === quiz.categoryId) : null;

  const questions = useMemo(() => {
    if (!quiz) return [];
    return quiz.questions
      .map((qId) => allQuestions.find((q) => q.id === qId))
      .filter((q): q is (typeof allQuestions)[number] => q !== undefined);
  }, [quiz]);

  const previousAttempt = useMemo(() => {
    if (!attempt) return null;
    const prior = quizAttempts
      .filter(
        (a) =>
          a.quizId === quizId &&
          a.id !== attempt.id &&
          new Date(a.completedAt).getTime() < new Date(attempt.completedAt).getTime()
      )
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    return prior[0] ?? null;
  }, [attempt, quizId]);

  useEffect(() => {
    if (!attempt) return;
    const duration = 1200;
    const steps = 48;
    const increment = attempt.percentage / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= attempt.percentage) {
        setAnimatedScore(attempt.percentage);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [attempt]);

  useEffect(() => {
    if (attempt?.passed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [attempt]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  if (!quiz || !attempt) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-display text-xl font-medium">Results not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This quiz attempt could not be found.
          </p>
          <Button className="mt-4" onClick={() => router.push("/quizzes")}>
            Browse quizzes
          </Button>
        </div>
      </div>
    );
  }

  const grade = getGrade(attempt.percentage);
  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const incorrectCount = attempt.answers.filter(
    (a) => !a.isCorrect && a.selectedOptions.length > 0
  ).length;
  const skippedCount = attempt.answers.filter(
    (a) => a.selectedOptions.length === 0
  ).length;

  const scoreDelta = previousAttempt
    ? attempt.percentage - previousAttempt.percentage
    : null;

  const pieData = [
    { name: "Correct", value: correctCount, fill: chartColors.success },
    { name: "Incorrect", value: incorrectCount, fill: "var(--destructive)" },
    { name: "Skipped", value: skippedCount, fill: chartColors.muted },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={80}
          colors={["#fb7185", "#22d3ee", "#fbbf24", "#a78bfa", "#34d399"]}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Editorial score */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 border-b-2 border-border pb-10"
        >
          <p className="text-meta mb-2">
            {category?.name}
            <span className="mx-2 text-border">·</span>
            <span className={cn("inline-flex rounded border px-1.5 py-0.5 capitalize", getDifficultyColor(quiz.difficulty))}>
              {quiz.difficulty}
            </span>
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {quiz.title}
          </h1>

          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={cn(
                  "font-display text-7xl font-extrabold tracking-tighter sm:text-8xl",
                  attempt.passed ? "text-success" : "text-destructive"
                )}
              >
                {animatedScore}
                <span className="text-4xl text-muted-foreground">%</span>
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-full bg-primary/15 px-3 py-1 font-display text-lg font-extrabold text-primary">
                  Grade {grade.grade}
                </span>
                <span className="text-sm font-bold text-muted-foreground">{grade.label}</span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-extrabold",
                    attempt.passed
                      ? "bg-success/20 text-success"
                      : "bg-destructive/20 text-destructive"
                  )}
                >
                  {attempt.passed ? "Victory!" : "Try again"}
                </span>
              </div>
              {scoreDelta !== null && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  {scoreDelta >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={scoreDelta >= 0 ? "text-success" : "text-destructive"}>
                    {scoreDelta >= 0 ? "+" : ""}
                    {scoreDelta}%
                  </span>
                  vs previous attempt ({previousAttempt!.percentage}%)
                </p>
              )}
            </div>

            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--inset)"
                  strokeWidth="5"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={attempt.passed ? "var(--success)" : "var(--destructive)"}
                  strokeWidth="5"
                  strokeLinecap="square"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 42 * (1 - attempt.percentage / 100),
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
            </div>
          </div>

          {/* Single summary strip */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t-2 border-border pt-6 text-sm">
            <div>
              <span className="text-meta">Correct</span>
              <p className="font-mono-score text-lg font-semibold text-success">
                {correctCount}
              </p>
            </div>
            <div>
              <span className="text-meta">Incorrect</span>
              <p className="font-mono-score text-lg font-semibold text-destructive">
                {incorrectCount}
              </p>
            </div>
            <div>
              <span className="text-meta">Skipped</span>
              <p className="font-mono-score text-lg font-semibold text-muted-foreground">
                {skippedCount}
              </p>
            </div>
            <div>
              <span className="text-meta">Time</span>
              <p className="font-mono-score text-lg font-semibold">
                {formatDuration(attempt.timeTaken)}
              </p>
            </div>
            <div>
              <span className="text-meta">Passing</span>
              <p className="font-mono-score text-lg font-semibold">
                {quiz.passingScore}%
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
          {/* Review */}
          <section>
            <h2 className="mb-4 font-display text-xl font-extrabold">Round review</h2>
            <div className="divide-y-2 divide-border overflow-hidden rounded-3xl border-2 border-border bg-raised">
              {questions.map((question, index) => {
                const answer = attempt.answers.find((a) => a.questionId === question.id);
                const isExpanded = expandedQuestions.has(question.id);
                const isCorrect = answer?.isCorrect ?? false;
                const isSkipped = !answer || answer.selectedOptions.length === 0;

                return (
                  <div key={question.id}>
                    <button
                      type="button"
                      onClick={() => toggleQuestion(question.id)}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-inset/60"
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center",
                          isCorrect && "bg-success/15 text-success",
                          !isCorrect && !isSkipped && "bg-destructive/15 text-destructive",
                          isSkipped && "bg-inset text-muted-foreground"
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isSkipped ? (
                          <MinusCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        <span className="font-mono-score text-muted-foreground">
                          {index + 1}.
                        </span>{" "}
                        {question.text}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-inset/40 px-4 py-4">
                        <p className="text-question mb-4 text-base">{question.text}</p>
                        <div className="space-y-2">
                          {question.options.map((option) => {
                            const wasSelected =
                              answer?.selectedOptions.includes(option.id) ?? false;
                            return (
                              <div
                                key={option.id}
                                className={cn(
                                  "border px-3 py-2.5 text-sm",
                                  option.isCorrect &&
                                    "border-success bg-success/10 text-foreground",
                                  wasSelected &&
                                    !option.isCorrect &&
                                    "border-destructive bg-destructive/10",
                                  !option.isCorrect && !wasSelected && "border-border bg-raised"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  {option.isCorrect && (
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                                  )}
                                  {wasSelected && !option.isCorrect && (
                                    <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                                  )}
                                  <span>{option.text}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {question.explanation && (
                          <div className="mt-4 border-l-2 border-primary pl-3 text-sm">
                            <p className="text-meta mb-1">Explanation</p>
                            <p className="text-muted-foreground">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border-2 border-border bg-raised p-4">
              <p className="text-meta mb-3">Breakdown</p>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={64}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm">
                {pieData.map((item) => (
                  <li key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="h-2 w-2"
                        style={{ backgroundColor: item.fill }}
                      />
                      {item.name}
                    </span>
                    <span className="font-mono-score font-medium">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => router.push(`/quiz/${quizId}`)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry quiz
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/quizzes")}
              >
                <Home className="mr-2 h-4 w-4" />
                Browse quizzes
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/results")}
              >
                <Award className="mr-2 h-4 w-4" />
                All results
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
