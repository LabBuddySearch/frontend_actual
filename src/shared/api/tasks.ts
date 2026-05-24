import axios from 'axios';

import { api } from './auth';

export type TestCaseRequest = {
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
};

export type NewTaskRequest = {
  title: string;
  description: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  deadlineAt: string;
  maxAttempts: number;
  category: TaskCategoryApi;
  testCases: TestCaseRequest[];
  assignedGroupId?: number | null;
  assignedStudentId?: number | null;
  assignToAllTeacherGroups?: boolean;
};

export type EditTaskRequest = {
  id: number;
  description?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  deadlineAt?: string;
  maxAttempts?: number;
  category?: TaskCategoryApi;
  testCases?: TestCaseRequest[];
  assignedGroupId?: number | null;
  assignedStudentId?: number | null;
  assignToAllTeacherGroups?: boolean;
  clearAssignment?: boolean;
};

export type TestCaseResponse = {
  id: number;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
};

export type SubmissionSummaryResponse = {
  id: number;
  status: string;
  createdAt?: string;
};

export type StudentTaskProgressResponse = {
  attemptsUsed: number;
  attemptsRemaining: number;
  maxAttempts: number;
  deadlineExpired: boolean;
  canSubmit: boolean;
  solved: boolean;
  recentSubmissions?: SubmissionSummaryResponse[];
};

export type TaskResponse = {
  id: number;
  author?: string;
  title: string;
  description: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  deadlineAt?: string;
  maxAttempts?: number;
  category?: TaskCategoryApi;
  testCases?: TestCaseResponse[];
  assignedGroupId?: number | null;
  assignedStudentId?: number | null;
  assignToAllTeacherGroups?: boolean;
  studentProgress?: StudentTaskProgressResponse;
};

export type TaskCategoryApi = 'ALGORITHMS' | 'TEXT' | 'LOGICAL';

export type StudentTaskStatusApi = 'SOLVED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'FAILED';

export type ShortTaskResponse = {
  id: number;
  title: string;
  author?: string;
  category?: TaskCategoryApi;
  studentStatus?: StudentTaskStatusApi;
};

export type ListTasksResponse = {
  tasks: ShortTaskResponse[];
};

export type ErrorResponse = {
  errorCode?: string;
  message?: string;
  timestamp?: string;
};

export async function getTasks() {
  const { data } = await api.get<ListTasksResponse>('/api/tasks');
  return data;
}

export async function getTeacherTaskById(id: number) {
  const { data } = await api.get<TaskResponse>(`/api/tasks/${id}/teacher`);
  return data;
}

export async function getStudentTaskById(id: number) {
  const { data } = await api.get<TaskResponse>(`/api/tasks/${id}`);
  return data;
}

export async function createTask(payload: NewTaskRequest) {
  await api.post('/api/tasks/create', payload);
}

export async function updateTask(id: number, payload: EditTaskRequest) {
  await api.put(`/api/tasks/${id}`, { ...payload, id });
}

export async function deleteTask(id: number) {
  await api.delete(`/api/tasks/${id}`);
}

export function getTaskApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as ErrorResponse;
    return data.message ?? fallback;
  }
  return fallback;
}
