export type AdminUserRole = 'STUDENT' | 'TEACHER';

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  blocked: boolean;
  avatarUrl?: string;
};
