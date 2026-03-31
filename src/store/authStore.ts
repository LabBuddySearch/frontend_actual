import { create } from 'zustand';

import type { TestRole } from '@/config/testAccounts';

interface AuthState {
  isAuth: boolean;
  username: string;
  fullName: string;
  group: string;
  role: TestRole | null;
  login: (username: string, fullName: string, role: TestRole, group?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  username: '',
  fullName: '',
  group: '',
  role: null,
  login: (username, fullName, role, group) =>
    set({ isAuth: true, username, fullName, group: group ?? '', role }),
  logout: () => set({ isAuth: false, username: '', fullName: '', group: '', role: null }),
}));