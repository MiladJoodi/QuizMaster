// User types
export type UserRole = 'admin' | 'user' | 'instructor';
export type UserStatus = 'active' | 'inactive' | 'banned';

export interface UserStats {
  quizzesTaken: number;
  averageScore: number;
  totalPoints: number;
  rank: number;
  streak: number;
  bestCategory: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar: string;
  bio: string;
  status: UserStatus;
  stats: UserStats;
  createdAt: string;
  lastLogin: string;
}

// Quiz types
export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuizStatus = 'draft' | 'published' | 'archived';
export type QuestionType = 'multiple-choice' | 'true-false' | 'multi-select';

export interface QuizCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  quizCount: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  categoryId: string;
  type: QuestionType;
  text: string;
  options: QuestionOption[];
  explanation: string;
  difficulty: QuizDifficulty;
  points: number;
  timeLimit?: number; // per-question in seconds
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  coverImage: string;
  questions: string[]; // question IDs
  totalQuestions: number;
  timeLimit: number; // total quiz time in minutes
  passingScore: number; // percentage
  attempts: number;
  rating: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// Quiz attempt types
export type AttemptStatus = 'in-progress' | 'completed' | 'timed-out' | 'abandoned';

export interface QuestionAnswer {
  questionId: string;
  selectedOptions: string[]; // option IDs
  isCorrect: boolean;
  timeTaken: number; // in seconds
  isFlagged: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  status: AttemptStatus;
  answers: QuestionAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeTaken: number; // in seconds
}

// Leaderboard
export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  totalScore: number;
  quizzesTaken: number;
  averageScore: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
}

// Achievements
export type AchievementStatus = 'locked' | 'unlocked' | 'in-progress';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  status: AchievementStatus;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  points: number;
}

// Notifications
export type NotificationType = 'quiz' | 'achievement' | 'system' | 'reminder' | 'social';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalUsers: number;
  averageScore: number;
}
