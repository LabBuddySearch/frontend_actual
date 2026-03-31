import { Link } from 'react-router-dom';

type ComingSoonPageProps = {
  title: string;
};

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
      <p className="font-display text-slate-600 dark:text-text-secondary">{title} — скоро</p>
      <Link
        className="mt-4 text-sm font-medium text-primary hover:underline"
        to="/login"
      >
        На страницу входа
      </Link>
    </div>
  );
}
