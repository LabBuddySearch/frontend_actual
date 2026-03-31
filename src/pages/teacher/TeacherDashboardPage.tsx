import { ListPlus } from 'lucide-react';
import { useEffect } from 'react';

export function TeacherDashboardPage() {
  useEffect(() => {
    document.title = 'Преподаватель | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Действия
        </h3>
        <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-border-color bg-surface p-6 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-100">Управление обучением</h4>
            <p className="text-sm text-slate-400">
              Создавайте новые задачи и практические задания для своих студентов
            </p>
          </div>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-background-dark shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 md:w-auto"
            type="button"
          >
            <ListPlus aria-hidden className="size-5" strokeWidth={2} />
            Создать задачу
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-100">Статистика групп</h3>
        <div className="rounded-xl border border-border-color bg-surface px-6 py-16 text-center">
          <p className="text-sm text-slate-400">Пока групп не добавлено</p>
        </div>
      </section>
    </main>
  );
}
