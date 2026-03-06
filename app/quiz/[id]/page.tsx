"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  CheckCircle2,
  Send,
  Pause,
  Play,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useQuizStore } from "@/store/quiz-store";
import { useAuthStore } from "@/store/auth-store";
import { useTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { formatTimer, getDifficultyColor } from "@/lib/utils";
import { quizzes, categories } from "@/lib/data";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const {
    activeQuiz,
    activeQuestions,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    startQuiz,
    endQuiz,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    selectAnswer,
    toggleFlag,
    resetQuiz,
    pauseTimer,
    resumeTimer,
  } = useQuizStore();

  const { timeRemaining, isTimerRunning } = useTimer();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);

  // Initialize quiz
  useEffect(() => {
    if (!activeQuiz) {
      startQuiz(quizId);
    }
  }, [quizId, activeQuiz, startQuiz]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 && activeQuiz) {
      handleSubmit();
    }
  }, [timeRemaining, activeQuiz]);

  // Timer warning at 1 minute
  useEffect(() => {
    if (timeRemaining === 60) {
      toast.warning("1 minute remaining!", {
        description: "Your quiz will be auto-submitted when time runs out.",
      });
    }
  }, [timeRemaining]);

  // Anti-cheat: blur detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeQuiz) {
        setTabWarning(true);
        toast.warning("Tab switch detected!", {
          description: "Please stay on the quiz page during the exam.",
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [activeQuiz]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = activeQuestions.length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  const quiz = quizzes.find((q) => q.id === quizId);
  const category = quiz ? categories.find((c) => c.id === quiz.categoryId) : null;

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === "multi-select") {
      const currentAnswer = answers[currentQuestion.id];
      const currentSelected = currentAnswer?.selectedOptions ?? [];
      const newSelected = currentSelected.includes(optionId)
        ? currentSelected.filter((id) => id !== optionId)
        : [...currentSelected, optionId];
      selectAnswer(currentQuestion.id, newSelected);
    } else {
      selectAnswer(currentQuestion.id, [optionId]);
    }
  };

  const handleSubmit = useCallback(() => {
    const attempt = endQuiz();
    if (attempt && user) {
      attempt.userId = user.id;
      router.push(`/quiz/${quizId}/results?attemptId=${attempt.id}`);
    }
    setShowSubmitDialog(false);
  }, [endQuiz, user, router, quizId]);

  const handleExit = () => {
    resetQuiz();
    router.push("/quizzes");
  };

  // Timer color based on remaining time
  const timerColor = useMemo(() => {
    if (!activeQuiz) return "text-foreground";
    const totalSeconds = activeQuiz.timeLimit * 60;
    const percentage = (timeRemaining / totalSeconds) * 100;
    if (percentage > 50) return "text-emerald-500";
    if (percentage > 25) return "text-yellow-500";
    return "text-red-500";
  }, [timeRemaining, activeQuiz]);

  const timerBarColor = useMemo(() => {
    if (!activeQuiz) return "bg-primary";
    const totalSeconds = activeQuiz.timeLimit * 60;
    const percentage = (timeRemaining / totalSeconds) * 100;
    if (percentage > 50) return "bg-emerald-500";
    if (percentage > 25) return "bg-yellow-500";
    return "bg-red-500";
  }, [timeRemaining, activeQuiz]);

  if (!activeQuiz || !currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar - Timer & Progress */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-none">{activeQuiz.title}</h1>
              <p className="text-xs text-muted-foreground">{category?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={cn("flex items-center gap-1.5 font-mono text-lg font-bold", timerColor)}>
              <Clock className="h-4 w-4" />
              {formatTimer(timeRemaining)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={isTimerRunning ? pauseTimer : resumeTimer}
              className="h-8 w-8"
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="h-1 w-full bg-muted">
          <motion.div
            className={cn("h-full", timerBarColor)}
            initial={{ width: "100%" }}
            animate={{
              width: `${activeQuiz ? (timeRemaining / (activeQuiz.timeLimit * 60)) * 100 : 0}%`,
            }}
            transition={{ duration: 1, ease: "linear" as const }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Question Area */}
          <div>
            {/* Question Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.points} pts</Badge>
              </div>
              <Button
                variant={flaggedQuestions.has(currentQuestion.id) ? "default" : "ghost"}
                size="sm"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={cn(
                  flaggedQuestions.has(currentQuestion.id) && "bg-orange-500 hover:bg-orange-600"
                )}
              >
                <Flag className="mr-1 h-3.5 w-3.5" />
                {flaggedQuestions.has(currentQuestion.id) ? "Flagged" : "Flag"}
              </Button>
            </div>

            {/* Question Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" as const }}
              >
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <p className="text-lg font-medium leading-relaxed">
                      {currentQuestion.text}
                    </p>
                    {currentQuestion.type === "multi-select" && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select all that apply
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id]?.selectedOptions?.includes(option.id);
                    const optionLabel = String.fromCharCode(65 + index);

                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectOption(option.id)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-semibold text-sm transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {currentQuestion.type === "multi-select" ? (
                            isSelected ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              optionLabel
                            )
                          ) : (
                            optionLabel
                          )}
                        </div>
                        <span className="flex-1 text-sm font-medium">{option.text}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={() => setShowQuestionNav(!showQuestionNav)}
              >
                {answeredCount}/{totalQuestions} answered
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button onClick={() => setShowSubmitDialog(true)}>
                  <Send className="mr-1 h-4 w-4" />
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigation Panel (desktop) */}
          <div className="hidden lg:block">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{answeredCount}/{totalQuestions}</span>
                  </div>
                  <Progress value={progressPercentage} className="mt-2" />
                </div>

                <div className="mb-4 grid grid-cols-5 gap-2">
                  {activeQuestions.map((q, index) => {
                    const isAnswered = !!answers[q.id];
                    const isFlagged = flaggedQuestions.has(q.id);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "relative flex h-9 w-full items-center justify-center rounded-lg text-xs font-medium transition-all",
                          isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                          isAnswered
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80",
                          isFlagged && !isAnswered && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        )}
                      >
                        {index + 1}
                        {isFlagged && (
                          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-primary" />
                    <span className="text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-muted" />
                    <span className="text-muted-foreground">Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-orange-400" />
                    <span className="text-muted-foreground">Flagged</span>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Question Nav Overlay */}
      <AnimatePresence>
        {showQuestionNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" as const }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden"
            onClick={() => setShowQuestionNav(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              className="w-full max-w-lg rounded-t-2xl bg-background p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Questions</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowQuestionNav(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {activeQuestions.map((q, index) => {
                  const isAnswered = !!answers[q.id];
                  const isFlagged = flaggedQuestions.has(q.id);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        goToQuestion(index);
                        setShowQuestionNav(false);
                      }}
                      className={cn(
                        "relative flex h-10 items-center justify-center rounded-lg text-sm font-medium",
                        isCurrent && "ring-2 ring-primary",
                        isAnswered
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                        isFlagged && !isAnswered && "bg-orange-100 text-orange-700 dark:bg-orange-900/30"
                      )}
                    >
                      {index + 1}
                      {isFlagged && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {answeredCount < totalQuestions ? (
                <span className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  You have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount !== 1 ? "s" : ""}.
                  Unanswered questions will be marked as incorrect.
                </span>
              ) : (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  All questions answered! Ready to submit.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={handleExit} className="bg-destructive hover:bg-destructive/90">
              Exit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tab Warning */}
      <AnimatePresence>
        {tabWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
          >
            <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Tab switch detected</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">Please stay on this page during the quiz</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setTabWarning(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
