import type { UserData } from '@/shared/api/auth';

/** Логин для отображения: явный username или локальная часть email */
export function displayLoginFromUser(user: UserData | null): string {
  if (!user) return '';
  const u = user.username?.trim();
  if (u) return u;
  const email = user.email?.trim() ?? '';
  const at = email.indexOf('@');
  return at > 0 ? email.slice(0, at) : email;
}
