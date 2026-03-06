import { useEffect, useRef, useCallback } from "react";
import { useQuizStore } from "@/store/quiz-store";

export function useTimer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tick = useQuizStore((state) => state.tick);
  const isTimerRunning = useQuizStore((state) => state.isTimerRunning);
  const timeRemaining = useQuizStore((state) => state.timeRemaining);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      tick();
    }, 1000);
  }, [tick]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      startInterval();
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [isTimerRunning, startInterval, stopInterval]);

  useEffect(() => {
    if (timeRemaining <= 0 && intervalRef.current) {
      stopInterval();
    }
  }, [timeRemaining, stopInterval]);

  return { timeRemaining, isTimerRunning };
}
