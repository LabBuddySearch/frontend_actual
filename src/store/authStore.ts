import { create } from 'zustand';

import type { UserData } from '@/shared/api/auth';
import { displayLoginFromUser } from '@/shared/lib/user-display';

const AUTH_USER_KEY = 'authUser';

function loadStoredUser(): UserData | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

function normalizeUser(userData: UserData): UserData {
  const username =
    userData.username?.trim() ||
    displayLoginFromUser({ ...userData, username: undefined });
  return { ...userData, username: username || undefined };
}

let initialToken = localStorage.getItem('accessToken');
let initialUser = initialToken ? loadStoredUser() : null;
if (initialToken && !initialUser) {
  localStorage.removeItem('accessToken');
  initialToken = null;
}

interface AuthState {
  isAuth: boolean;
  user: UserData | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  updateUser: (partial: Partial<UserData>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuth: !!initialToken && !!initialUser,
  user: initialUser,
  login: (token, userData) => {
    const merged = normalizeUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(merged));
    set({ isAuth: true, user: merged });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem(AUTH_USER_KEY);
    set({ isAuth: false, user: null });
  },
  updateUser: (partial) => {
    const prev = get().user;
    if (!prev) return;
    const next = normalizeUser({ ...prev, ...partial });
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
    set({ user: next });
  },
}));
