/** Только для разработки: фиксированные тестовые пользователи */
export type TestRole = 'student' | 'teacher' | 'admin';

export const TEST_ACCOUNTS: ReadonlyArray<{
  username: string;
  /** Email для страницы входа через API (см. dev-сервер `server/index.mjs`) */
  email?: string;
  password: string;
  role: TestRole;
  fullName: string;
  group?: string;
}> = [
  {
    username: 'Vikki',
    email: 'vikki@local.test',
    password: 'Vika2005',
    role: 'student',
    fullName: 'Виктория',
    group: '',
  },
  {
    username: 'prepod@prepod.prepod',
    email: 'prepod@prepod.prepod',
    password: 'Test1234',
    role: 'teacher',
    fullName: 'Андрей Борисович',
  },
  {
    username: 'Admin',
    email: 'adm@adm.adm',
    password: 'Admin1234',
    role: 'admin',
    fullName: 'Администратор',
  },
];

export function matchTestAccount(username: string, password: string): (typeof TEST_ACCOUNTS)[number] | undefined {
  const u = username.trim();
  const p = password;
  return TEST_ACCOUNTS.find((a) => a.username === u && a.password === p);
}
