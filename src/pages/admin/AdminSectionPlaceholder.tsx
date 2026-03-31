import { Link } from 'react-router-dom';

type AdminSectionPlaceholderProps = {
  title: string;
};

export function AdminSectionPlaceholder({ title }: AdminSectionPlaceholderProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10">
      <p className="text-center text-sm text-slate-400">{title} — раздел в разработке</p>
      <Link
        className="mt-6 block text-center text-sm font-medium text-primary hover:underline"
        to="/admin"
      >
        На дашборд
      </Link>
    </main>
  );
}
