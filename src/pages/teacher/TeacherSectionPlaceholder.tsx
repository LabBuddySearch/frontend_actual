import { Link } from 'react-router-dom';

type TeacherSectionPlaceholderProps = {
  title: string;
};

export function TeacherSectionPlaceholder({ title }: TeacherSectionPlaceholderProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-center text-slate-500 dark:text-slate-400">{title} — скоро будут</p>
      <Link
        className="mt-6 text-sm font-medium text-primary hover:underline"
        to="/teacher"
      >
        На главный экран
      </Link>
    </main>
  );
}
