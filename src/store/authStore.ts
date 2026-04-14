import { create } from 'zustand';
import type { UserData } from '@/shared/api/auth';

interface AuthState {
  isAuth: boolean;
  user: UserData | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: !!localStorage.getItem('accessToken'),
  user: null,
  login: (token, userData) => {
    localStorage.setItem('accessToken', token);
    set({ isAuth: true, user: userData });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isAuth: false, user: null });
  },
}));