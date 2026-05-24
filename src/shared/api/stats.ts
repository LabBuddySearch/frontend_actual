import { api } from './auth';

export type StudentTaskStatsDetail = {
  taskId: number;
  taskTitle: string;
  status: 'SOLVED' | 'FAILED' | 'IN_PROGRESS' | 'NOT_STARTED' | string;
  attemptsUsed: number;
  maxAttempts: number;
};

export type StudentStatsRow = {
  studentId: number;
  fullName: string;
  email: string;
  solvedTasksCount: number;
  tasks: StudentTaskStatsDetail[];
};

export type GroupStatsResponse = {
  groupId: number;
  groupName: string;
  students: StudentStatsRow[];
};

export async function getGroupStats(groupId: number) {
  const { data } = await api.get<GroupStatsResponse>(`/api/stats/groups/${groupId}`);
  return data;
}

export type StudentBriefStats = {
  studentId: number;
  fullName: string;
  email: string;
};

export type StudentFailedStats = StudentBriefStats & {
  failureReason: 'DEADLINE_EXCEEDED' | 'ATTEMPTS_EXHAUSTED' | string;
};

export type TaskDashboardStats = {
  taskId: number;
  taskTitle: string;
  solvedStudents: StudentBriefStats[];
  failedStudents: StudentFailedStats[];
};

export type GroupDashboardStats = {
  groupId: number;
  groupName: string;
  tasks: TaskDashboardStats[];
};

export type TeacherDashboardStatsResponse = {
  groups: GroupDashboardStats[];
};

export async function getTeacherDashboardStats() {
  const { data } = await api.get<TeacherDashboardStatsResponse>('/api/stats/teacher/dashboard');
  return data;
}

export function failureReasonLabel(reason: string): string {
  if (reason === 'DEADLINE_EXCEEDED') return 'Просрочен дедлайн';
  if (reason === 'ATTEMPTS_EXHAUSTED') return 'Исчерпаны попытки';
  return reason;
}

export function taskStatsStatusLabel(status: string): string {
  switch (status) {
    case 'SOLVED':
      return 'Решено';
    case 'FAILED':
      return 'Не сдано';
    case 'IN_PROGRESS':
      return 'В процессе';
    default:
      return 'Не начато';
  }
}
