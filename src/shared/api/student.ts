import axios from 'axios';

import { api } from './auth';

export type StudentContextResponse = {
  groupName?: string;
  teacherName?: string;
  teacherEmail?: string;
};

export async function getStudentContext() {
  const { data } = await api.get<StudentContextResponse>('/api/student/context');
  return data;
}

export type StudentProgressResponse = {
  totalTasks: number;
  solvedTasks: number;
  progressPercent: number;
};

export async function getStudentProgress() {
  const { data } = await api.get<StudentProgressResponse>('/api/student/progress');
  return data;
}

export type StudentSubmissionHistoryItem = {
  submissionId: number;
  taskId: number;
  taskTitle: string;
  status: string;
  language: string;
  createdAt?: string;
};

export async function getStudentSubmissionHistory() {
  const { data } = await api.get<StudentSubmissionHistoryItem[]>('/api/student/submissions/history');
  return data;
}

export function formatSubmissionStatus(status: string): { label: string; ok: boolean } {
  if (status === 'ACCEPTED') return { label: 'OK', ok: true };
  if (status === 'WRONG') return { label: 'ERROR', ok: false };
  if (status === 'PENDING') return { label: 'PENDING', ok: false };
  return { label: status, ok: false };
}

export function formatSubmissionLanguage(language: string): string {
  if (!language) return '—';
  const lower = language.toLowerCase();
  if (lower === 'java') return 'Java';
  if (lower === 'javascript') return 'JavaScript';
  if (lower === 'python') return 'Python';
  return language;
}

export type SubmitTaskRequest = {
  language: string;
  sourceCode: string;
};

export type SubmissionResponse = {
  id: number;
  status: string;
  language?: string;
  executionTimeMs?: number;
  stdout?: string;
  stderr?: string;
  message?: string;
  passed?: boolean;
  syntaxError?: boolean;
  failedTestIndex?: number;
  attemptsUsed?: number;
  attemptsRemaining?: number;
};

export type SubmissionSummaryResponse = {
  id: number;
  status: string;
  createdAt?: string;
};

/** Бэкенд MVP поддерживает только JAVA в ExecutorFactory. */
export function mapUiLanguageToApi(language: string): string {
  if (language.toUpperCase() === 'JAVA') return 'JAVA';
  return language.toUpperCase();
}

export async function submitTaskSolution(taskId: number, payload: SubmitTaskRequest) {
  const { data } = await api.post<SubmissionResponse>(`/api/tasks/${taskId}/submit`, payload);
  return data;
}

export async function getTaskSubmissions(taskId: number) {
  const { data } = await api.get<SubmissionSummaryResponse[]>(`/api/tasks/${taskId}/submissions`);
  return data;
}

export function getSubmitApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'Слишком много отправок. Подождите и попробуйте снова.';
    }
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as { message?: string };
      return data.message ?? fallback;
    }
  }
  return fallback;
}
