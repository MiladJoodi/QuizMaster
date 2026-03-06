import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      register: (name, email, password) => {
        const exists = users.find(u => u.email === email);
        if (exists) return false;
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          password,
          name,
          role: 'user',
          avatar: '',
          bio: '',
          status: 'active',
          stats: { quizzesTaken: 0, averageScore: 0, totalPoints: 0, rank: 0, streak: 0, bestCategory: '' },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        users.push(newUser);
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);
