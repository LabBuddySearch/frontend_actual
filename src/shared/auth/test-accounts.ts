/**
 * Тестовые учётные записи (без бэкенда). Удалить/заменить при подключении API.
 */
export type TestAccountRole = 'student' | 'teacher';

const STUDENT = { username: 'Vikki', password: 'Vika2005' } as const;
const TEACHER = { username: 'Prepod', password: 'Test1234' } as const;

export function mockAuthenticate(
  username: string,
  password: string,
): TestAccountRole | null {
  const u = username.trim();
  if (u === STUDENT.username && password === STUDENT.password) return 'student';
  if (u === TEACHER.username && password === TEACHER.password) return 'teacher';
  return null;
}
