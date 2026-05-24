import axios from 'axios';

import { api } from './auth';

export type PublicGroupOption = {
  id: number;
  code: string;
  teacherFullName: string;
};

export type PublicGroupsResponse = {
  groups: PublicGroupOption[];
};

export async function getAvailableGroups() {
  const { data } = await api.get<PublicGroupsResponse>('/api/groups/available');
  return data;
}

export function formatGroupOptionLabel(group: PublicGroupOption): string {
  const teacher = group.teacherFullName?.trim() || 'Преподаватель не указан';
  return `${group.code} - ${teacher}`;
}

export function getGroupsApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as { message?: string };
    return data.message ?? fallback;
  }
  return fallback;
}
