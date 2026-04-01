import { useEffect } from 'react';

import { Profile, type ProfileVariant } from '@/pages/Profile';

const TITLES: Record<ProfileVariant, string> = {
  student: 'Профиль | EduCode',
  teacher: 'Профиль преподавателя | EduCode',
  admin: 'Профиль администратора | EduCode',
};

export function RoleProfilePage({ variant }: { variant: ProfileVariant }) {
  useEffect(() => {
    document.title = TITLES[variant];
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, [variant]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Profile variant={variant} />
    </main>
  );
}
