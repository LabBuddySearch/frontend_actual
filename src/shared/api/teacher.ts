import axios from 'axios';

import { api } from './auth';

export type TeacherGroupStudent = {
  id: number;
  fullName: string;
  email: string;
};

export type TeacherGroup = {
  id: number;
  name: string;
  students: TeacherGroupStudent[];
};

export type TeacherGroupsResponse = {
  groups: TeacherGroup[];
};

export type CreateGroupRequest = {
  name: string;
};

export async function getTeacherGroups() {
  const { data } = await api.get<TeacherGroupsResponse>('/api/groups');
  return data;
}

export async function createTeacherGroup(payload: CreateGroupRequest) {
  const { data } = await api.post<TeacherGroup>('/api/groups', payload);
  return data;
}

export async function detachTeacherGroup(groupId: number) {
  await api.delete(`/api/groups/${groupId}`);
}

export function getTeacherApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as { message?: string };
    return data.message ?? fallback;
  }
  return fallback;
}
