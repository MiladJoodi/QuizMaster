"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  CheckCircle2,
  Send,
  X,
  Grid3X3,
} from "lucide-react";
import { toast } from "sonner";
import { useQuizStore } from "@/store/quiz-store";
import { useAuthStore } from "@/store/auth-store";
import { useTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
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
import { quizzes, categories } from "@/lib/data";
import { QuizStatusBar } from "@/components/quiz/quiz-status-bar";
import { QuizAnswerOption } from "@/components/quiz/quiz-answer-option";
import { QuizQuestionMap } from "@/components/quiz/quiz-question-map";

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

  useEffect(() => {
    if (!activeQuiz) {
      startQuiz(quizId);
    }
  }, [quizId, activeQuiz, startQuiz]);

  const handleSubmit = useCallback(() => {
    const attempt = endQuiz();
    if (attempt && user) {
      attempt.userId = user.id;
      router.push(`/quiz/${quizId}/results?attemptId=${attempt.id}`);
    }
    setShowSubmitDialog(false);
  }, [endQuiz, user, router, quizId]);

  useEffect(() => {
    if (timeRemaining <= 0 && activeQuiz) {
      handleSubmit();
    }
  }, [timeRemaining, activeQuiz, handleSubmit]);

  useEffect(() => {
    if (timeRemaining === 60) {
      toast.warning("1 minute remaining", {
        description: "Your quiz will auto-submit when time runs out.",
      });
    }
  }, [timeRemaining]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeQuiz) {
        setTabWarning(true);
        toast.warning("Tab switch detected", {
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

  const answeredIds = useMemo(() => new Set(Object.keys(answers)), [answers]);
  const flaggedIds = useMemo(() => new Set(flaggedQuestions), [flaggedQuestions]);

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

  const handleExit = () => {
    resetQuiz();
    router.push("/quizzes");
  };

  if (!activeQuiz || !currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading quiz…</p>
        </div>
      </div>
    );
  }

  const isFlagged = flaggedQuestions.has(currentQuestion.id);
  const isMulti = currentQuestion.type === "multi-select";

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <QuizStatusBar
        title={activeQuiz.title}
        categoryName={category?.name}
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        timeRemaining={timeRemaining}
        totalSeconds={activeQuiz.timeLimit * 60}
        isTimerRunning={isTimerRunning}
        onPauseToggle={isTimerRunning ? pauseTimer : resumeTimer}
        onExit={() => setShowExitDialog(true)}
      />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="text-meta">
                {currentQuestion.difficulty} · {currentQuestion.points} pts
                {isMulti ? " · Select all that apply" : ""}
              </p>
              <button
                type="button"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                  isFlagged ? "text-signal" : "text-muted-foreground hover:text-signal"
                )}
              >
                <Flag className={cn("h-3.5 w-3.5", isFlagged && "fill-signal")} />
                {isFlagged ? "Flagged" : "Flag"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-question mb-8 text-foreground sm:text-[1.5rem]">
                  {currentQuestion.text}
                </p>

                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id]?.selectedOptions?.includes(option.id);
                    const optionLabel = String.fromCharCode(65 + index);

                    return (
                      <QuizAnswerOption
                        key={option.id}
                        label={optionLabel}
                        text={option.text}
                        selected={!!isSelected}
                        multiSelect={isMulti}
                        onSelect={() => handleSelectOption(option.id)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desktop nav */}
            <div className="mt-8 hidden items-center justify-between lg:flex">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button onClick={() => setShowSubmitDialog(true)}>
                  <Send className="mr-1 h-4 w-4" />
                  Submit quiz
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-3xl border-2 border-border bg-raised p-4">
              <QuizQuestionMap
                total={totalQuestions}
                currentIndex={currentQuestionIndex}
                answeredIds={answeredIds}
                flaggedIds={flaggedIds}
                questionIds={activeQuestions.map((q) => q.id)}
                onGoTo={goToQuestion}
                onSubmit={() => setShowSubmitDialog(true)}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-raised/95 px-3 py-2.5 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-11 flex-1 gap-2"
            onClick={() => setShowQuestionNav(true)}
          >
            <Grid3X3 className="h-4 w-4" />
            {answeredCount}/{totalQuestions}
          </Button>
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button className="h-11 flex-1" onClick={() => setShowSubmitDialog(true)}>
              Submit
            </Button>
          ) : (
            <Button className="h-11 flex-1" onClick={nextQuestion}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile question sheet */}
      <AnimatePresence>
        {showQuestionNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-end bg-foreground/40 lg:hidden"
            onClick={() => setShowQuestionNav(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-full rounded-t-3xl border-t-2 border-border bg-raised p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl font-extrabold">Question board</h3>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setShowQuestionNav(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <QuizQuestionMap
                total={totalQuestions}
                currentIndex={currentQuestionIndex}
                answeredIds={answeredIds}
                flaggedIds={flaggedIds}
                questionIds={activeQuestions.map((q) => q.id)}
                onGoTo={(index) => {
                  goToQuestion(index);
                  setShowQuestionNav(false);
                }}
                showSubmit={false}
                columns={6}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit quiz?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {answeredCount < totalQuestions ? (
                  <span className="flex items-start gap-2 text-signal">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    You have {totalQuestions - answeredCount} unanswered question
                    {totalQuestions - answeredCount !== 1 ? "s" : ""}. They will be marked incorrect.
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    All questions answered. Ready to submit.
                  </span>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {tabWarning && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-16 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 border border-signal bg-raised p-3"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <div className="flex-1">
                <p className="text-sm font-medium">Tab switch detected</p>
                <p className="text-xs text-muted-foreground">Stay on this page during the quiz.</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTabWarning(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
