/** Только для разработки: фиксированные тестовые пользователи */
export type TestRole = 'student' | 'teacher' | 'admin';

export const TEST_ACCOUNTS: ReadonlyArray<{
  username: string;
  password: string;
  role: TestRole;
  fullName: string;
  group?: string;
}> = [
  {
    username: 'Vikki',
    password: 'Vika2005',
    role: 'student',
    fullName: 'Vikki',
    group: '',
  },
  {
    username: 'Prepod',
    password: 'Test1234',
    role: 'teacher',
    fullName: 'Преподаватель',
  },
  {
    username: 'Admin',
    password: 'Admin1234',
    role: 'admin',
    fullName: 'Администратор',
  },
];

export function matchTestAccount(
  username: string,
  password: string,
): (typeof TEST_ACCOUNTS)[number] | undefined {
  const u = username.trim();
  const p = password;
  return TEST_ACCOUNTS.find((a) => a.username === u && a.password === p);
}
