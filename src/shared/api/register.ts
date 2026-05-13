import axios from 'axios';

export type StudentRegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  groupCode: string;
};

export type TeacherRegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

export async function postStudentRegister(body: StudentRegisterPayload) {
  const { data } = await client.post<{ ok: boolean; message?: string }>(
    '/api/auth/register/student',
    body,
  );
  return data;
}

export async function postTeacherRegister(body: TeacherRegisterPayload) {
  const { data } = await client.post<{ ok: boolean; message?: string }>(
    '/api/auth/register/teacher',
    body,
  );
  return data;
}

export async function verifyEmailToken(token: string) {
  const { data } = await client.get<{ ok: boolean; message?: string; error?: string }>(
    '/api/auth/verify-email',
    { params: { token } },
  );
  if (!data.ok) {
    throw new Error(data.message ?? data.error ?? 'Не удалось подтвердить email.');
  }
  return data;
}
