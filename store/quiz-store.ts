import { create } from 'zustand';
import { Question, QuestionAnswer, Quiz, QuizAttempt } from '@/lib/types';
import { questions as allQuestions, quizzes, quizAttempts } from '@/lib/data';

interface QuizState {
  // Active quiz
  activeQuiz: Quiz | null;
  activeQuestions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, QuestionAnswer>;
  flaggedQuestions: Set<string>;

  // Timer
  timeRemaining: number; // in seconds
  isTimerRunning: boolean;
  startTime: string | null;

  // Quiz actions
  startQuiz: (quizId: string) => void;
  endQuiz: () => QuizAttempt | null;

  // Navigation
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Answer actions
  selectAnswer: (questionId: string, optionIds: string[]) => void;
  toggleFlag: (questionId: string) => void;

  // Timer
  tick: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;

  // Reset
  resetQuiz: () => void;

  // History
  getAttempts: (userId: string) => QuizAttempt[];
  getQuizAttempts: (quizId: string) => QuizAttempt[];
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  activeQuiz: null,
  activeQuestions: [],
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: new Set(),
  timeRemaining: 0,
  isTimerRunning: false,
  startTime: null,

  startQuiz: (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    const questions = quiz.questions
      .map(qId => allQuestions.find(q => q.id === qId))
      .filter((q): q is Question => q !== undefined);
    set({
      activeQuiz: quiz,
      activeQuestions: questions,
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: new Set(),
      timeRemaining: quiz.timeLimit * 60,
      isTimerRunning: true,
      startTime: new Date().toISOString(),
    });
  },

  endQuiz: () => {
    const { activeQuiz, activeQuestions, answers, startTime } = get();
    if (!activeQuiz || !startTime) return null;

    let correctCount = 0;
    const questionAnswers: QuestionAnswer[] = activeQuestions.map(q => {
      const answer = answers[q.id];
      const isCorrect = answer ? answer.isCorrect : false;
      if (isCorrect) correctCount++;
      return answer || {
        questionId: q.id,
        selectedOptions: [],
        isCorrect: false,
        timeTaken: 0,
        isFlagged: false,
      };
    });

    const percentage = Math.round((correctCount / activeQuestions.length) * 100);
    const timeTaken = Math.round((new Date().getTime() - new Date(startTime).getTime()) / 1000);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: activeQuiz.id,
      userId: '',
      status: 'completed',
      answers: questionAnswers,
      score: correctCount * 10,
      percentage,
      passed: percentage >= activeQuiz.passingScore,
      startedAt: startTime,
      completedAt: new Date().toISOString(),
      timeTaken,
    };

    quizAttempts.push(attempt);
    set({ isTimerRunning: false });
    return attempt;
  },

  goToQuestion: (index) => set({ currentQuestionIndex: index }),
  nextQuestion: () => {
    const { currentQuestionIndex, activeQuestions } = get();
    if (currentQuestionIndex < activeQuestions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },
  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  selectAnswer: (questionId, optionIds) => {
    const { activeQuestions } = get();
    const question = activeQuestions.find(q => q.id === questionId);
    if (!question) return;

    const correctOptionIds = question.options
      .filter(o => o.isCorrect)
      .map(o => o.id);

    const isCorrect = optionIds.length === correctOptionIds.length &&
      optionIds.every(id => correctOptionIds.includes(id));

    set(state => ({
      answers: {
        ...state.answers,
        [questionId]: {
          questionId,
          selectedOptions: optionIds,
          isCorrect,
          timeTaken: 0,
          isFlagged: state.flaggedQuestions.has(questionId),
        },
      },
    }));
  },

  toggleFlag: (questionId) => {
    set(state => {
      const newFlagged = new Set(state.flaggedQuestions);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return { flaggedQuestions: newFlagged };
    });
  },

  tick: () => {
    const { timeRemaining, isTimerRunning } = get();
    if (!isTimerRunning) return;
    if (timeRemaining <= 0) {
      set({ isTimerRunning: false });
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },

  pauseTimer: () => set({ isTimerRunning: false }),
  resumeTimer: () => set({ isTimerRunning: true }),

  resetQuiz: () => set({
    activeQuiz: null,
    activeQuestions: [],
    currentQuestionIndex: 0,
    answers: {},
    flaggedQuestions: new Set(),
    timeRemaining: 0,
    isTimerRunning: false,
    startTime: null,
  }),

  getAttempts: (userId) => quizAttempts.filter(a => a.userId === userId),
  getQuizAttempts: (quizId) => quizAttempts.filter(a => a.quizId === quizId),
}));
