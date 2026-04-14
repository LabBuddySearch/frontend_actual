import axios from 'axios';

export const api = axios.create({
  baseURL: '', 
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type UserData = {
  id: number;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  /** Логин с регистрации; если бэкенд не отдаёт — можно задать на клиенте */
  username?: string;
  /** Код группы (студент) */
  studentGroup?: string;
  /** Увлечения и интересы (студент) */
  studentHobbies?: string;
  /** Преподаваемый предмет (преподаватель) */
  teacherSubject?: string;
  /** Доп. информация (администратор) */
  adminNote?: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  user: UserData;
};

export async function loginUser(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  return data;
}

export async function requestPasswordReset(payload: { email: string }) {
  const { data } = await api.post<{ ok?: boolean; message?: string }>(
    '/api/auth/forgot-password',
    payload,
  );
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerUser(payload: any) {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return data;
}