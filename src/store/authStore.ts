import { create } from 'zustand';

interface AuthState {
  isAuth: boolean;
  username: string;
  fullName: string;
  group: string;
  login: (username: string, fullName: string, group?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Временно true, чтобы сразу видеть Layout при разработке
  isAuth: true, 
  username: 'ivan_dev',
  fullName: 'Иван Иванов',
  group: 'Группа 101',
  login: (username, fullName, group) => set({ isAuth: true, username, fullName, group: group || '' }),
  logout: () => set({ isAuth: false, username: '', fullName: '', group: '' }),
}));