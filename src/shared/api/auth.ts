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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerUser(payload: any) {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return data;
}