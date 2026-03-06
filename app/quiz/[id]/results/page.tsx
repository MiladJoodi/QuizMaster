"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  Trophy,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatTimer, formatDuration, getGrade, getDifficultyColor } from "@/lib/utils";
import { quizzes, questions as allQuestions, quizAttempts, categories } from "@/lib/data";

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

  // Animated score counter
  useEffect(() => {
    if (!attempt) return;
    const duration = 1500;
    const steps = 60;
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

  // Show confetti for passed quizzes
  useEffect(() => {
    if (attempt?.passed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [attempt]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  if (!quiz || !attempt) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold">Results not found</p>
          <p className="mt-1 text-sm text-muted-foreground">This quiz attempt could not be found.</p>
          <Button className="mt-4" onClick={() => router.push("/quizzes")}>
            Browse Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const grade = getGrade(attempt.percentage);
  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const incorrectCount = attempt.answers.filter((a) => !a.isCorrect && a.selectedOptions.length > 0).length;
  const skippedCount = attempt.answers.filter((a) => a.selectedOptions.length === 0).length;

  const pieData = [
    { name: "Correct", value: correctCount, fill: "#10b981" },
    { name: "Incorrect", value: incorrectCount, fill: "#ef4444" },
    { name: "Skipped", value: skippedCount, fill: "#94a3b8" },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        {/* Score Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2">
            <Badge variant="outline">{category?.name}</Badge>
            <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
          </div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{quiz.title}</h1>

          {/* Score Circle */}
          <div className="relative mx-auto my-8 flex h-40 w-40 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={attempt.passed ? "#10b981" : "#ef4444"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - attempt.percentage / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" as const }}
              />
            </svg>
            <div className="text-center">
              <span className={cn("text-4xl font-bold", grade.color)}>{animatedScore}%</span>
              <p className="text-sm text-muted-foreground">{grade.label}</p>
            </div>
          </div>

          {/* Pass/Fail Badge */}
          <div className="flex items-center justify-center gap-2">
            {attempt.passed ? (
              <Badge className="bg-emerald-500 px-4 py-1 text-sm hover:bg-emerald-600">
                <Trophy className="mr-1 h-4 w-4" />
                Passed
              </Badge>
            ) : (
              <Badge variant="destructive" className="px-4 py-1 text-sm">
                <XCircle className="mr-1 h-4 w-4" />
                Failed
              </Badge>
            )}
            <Badge variant="outline" className="px-4 py-1 text-sm">
              Grade: {grade.grade}
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
              <p className="text-2xl font-bold">{correctCount}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="mx-auto mb-1 h-5 w-5 text-red-500" />
              <p className="text-2xl font-bold">{incorrectCount}</p>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MinusCircle className="mx-auto mb-1 h-5 w-5 text-slate-400" />
              <p className="text-2xl font-bold">{skippedCount}</p>
              <p className="text-xs text-muted-foreground">Skipped</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="mx-auto mb-1 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{formatDuration(attempt.timeTaken)}</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Question Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Question Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((question, index) => {
                  const answer = attempt.answers.find((a) => a.questionId === question.id);
                  const isExpanded = expandedQuestions.has(question.id);
                  const isCorrect = answer?.isCorrect ?? false;
                  const isSkipped = !answer || answer.selectedOptions.length === 0;

                  return (
                    <div key={question.id} className="rounded-lg border border-border">
                      <button
                        onClick={() => toggleQuestion(question.id)}
                        className="flex w-full items-center gap-3 p-3 text-left"
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          isCorrect && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                          !isCorrect && !isSkipped && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                          isSkipped && "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                          {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : isSkipped ? <MinusCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            Q{index + 1}. {question.text}
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border px-3 pb-3 pt-2">
                          <p className="mb-3 text-sm">{question.text}</p>
                          <div className="space-y-2">
                            {question.options.map((option) => {
                              const wasSelected = answer?.selectedOptions.includes(option.id) ?? false;
                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "rounded-lg border p-2.5 text-sm",
                                    option.isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                                    wasSelected && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-900/20",
                                    !option.isCorrect && !wasSelected && "border-border"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    {option.isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                                    {wasSelected && !option.isCorrect && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                                    <span>{option.text}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {question.explanation && (
                            <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                              <p className="font-medium">Explanation:</p>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar - Chart + Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" as const }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => { router.push(`/quiz/${quizId}`); }}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/quizzes")}>
                <Home className="mr-2 h-4 w-4" />
                Browse Quizzes
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/results")}>
                <Award className="mr-2 h-4 w-4" />
                View All Results
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
