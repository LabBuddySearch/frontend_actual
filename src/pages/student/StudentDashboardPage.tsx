import { BarChart3, Play, Trophy } from 'lucide-react';
import { useEffect } from 'react';

/**
 * TODO: из API — есть ли начатое и незавершённое обучение.
 * `false` — блок «Начать изучение»; `true` — как в макете «Продолжить» + «Решать».
 */
const HAS_IN_PROGRESS_LEARNING = false;

const CONTINUE_LESSON = {
  tag: 'Продолжить',
  title: 'Реализация Async/Await',
  meta: 'Тема: Продвинутый JavaScript. Сложность: Middle',
};

export function StudentDashboardPage() {
  useEffect(() => {
    document.title = 'Главный экран | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="rounded-xl border border-border-color bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Прогресс</h2>
              <BarChart3 aria-hidden className="size-5 text-primary" strokeWidth={1.75} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Решено задач</span>
                  <span className="font-medium text-primary">—</span>
                </div>
                <div className="h-2 w-full rounded-full bg-border-color">
                  <div className="h-2 w-0 rounded-full bg-primary" />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Данные появятся после решения задач
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border border-border-color bg-background-dark/50 p-3">
                  <p className="mb-1 text-[10px] tracking-wider text-slate-500 uppercase">
                    Стрик
                  </p>
                  <p className="text-xl font-bold text-slate-500">—</p>
                </div>
                <div className="rounded-lg border border-border-color bg-background-dark/50 p-3">
                  <p className="mb-1 text-[10px] tracking-wider text-slate-500 uppercase">
                    Рейтинг
                  </p>
                  <p className="text-xl font-bold text-slate-500">—</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-color bg-surface p-6">
            {HAS_IN_PROGRESS_LEARNING ? (
              <>
                <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
                  {CONTINUE_LESSON.tag}
                </p>
                <h3 className="mb-1 text-xl font-bold">{CONTINUE_LESSON.title}</h3>
                <p className="mb-6 text-sm text-slate-400">{CONTINUE_LESSON.meta}</p>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-background-dark transition-all hover:bg-primary/90"
                  type="button"
                >
                  <Play aria-hidden className="size-5 fill-current" />
                  Решать
                </button>
              </>
            ) : (
              <>
                <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
                  Начать изучение
                </p>
                <h3 className="mb-1 text-xl font-bold">Пока ничего не начато</h3>
                <p className="mb-6 text-sm text-slate-400">
                  Выберите курс и сделайте первый шаг — здесь появится урок для продолжения.
                </p>
                <button
                  className="w-full rounded-lg bg-primary py-3 font-bold text-background-dark transition-all hover:bg-primary/90"
                  type="button"
                >
                  Начать
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 rounded-xl border border-border-color bg-surface p-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <Trophy aria-hidden className="size-6" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Достижений пока нет</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Здесь появятся награды за успехи в обучении
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex h-full flex-col rounded-xl border border-border-color bg-surface">
            <div className="flex items-center justify-between border-b border-border-color p-6">
              <h2 className="text-xl font-bold">Мои задания</h2>
              <div className="flex gap-2">
                <button
                  className="rounded-md bg-border-color px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-primary/20 hover:text-primary"
                  type="button"
                >
                  Все
                </button>
                <button
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-border-color"
                  type="button"
                >
                  В работе
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="text-xs tracking-wider text-slate-500 uppercase">
                    <th className="px-6 py-4 font-semibold">Статус</th>
                    <th className="px-6 py-4 font-semibold">Название задачи</th>
                    <th className="px-6 py-4 font-semibold">Дедлайн</th>
                    <th className="px-6 py-4 font-semibold" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  <tr>
                    <td className="px-6 py-14 text-center text-sm text-slate-500" colSpan={4}>
                      Заданий пока нет — список заполнится, когда преподаватель назначит работы.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-auto border-t border-border-color p-4 text-center">
              <span className="text-sm text-slate-500">Смотреть все задания</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
