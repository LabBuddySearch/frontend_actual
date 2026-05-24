import { StudentSubmissionHistory } from '@/components/student/StudentSubmissionHistory';
import { getStudentProgress } from '@/shared/api/student';
import { useStudentContext } from '@/shared/hooks/useStudentContext';
import { BarChart3, Loader2, Play, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const studentContext = useStudentContext(true);

  const [progressPercent, setProgressPercent] = useState(0);
  const [solvedTasks, setSolvedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    document.title = 'Главный экран | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  useEffect(() => {
    setProgressLoading(true);
    void getStudentProgress()
      .then((data) => {
        setProgressPercent(data.progressPercent);
        setSolvedTasks(data.solvedTasks);
        setTotalTasks(data.totalTasks);
      })
      .catch(() => {
        setProgressPercent(0);
        setSolvedTasks(0);
        setTotalTasks(0);
      })
      .finally(() => setProgressLoading(false));
  }, []);

  const progressLabel =
    totalTasks === 0
      ? 'Нет назначенных задач'
      : `${solvedTasks} из ${totalTasks}`;

  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-border-color bg-surface p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <User className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">Учебная группа</p>
              <p className="text-base font-bold text-slate-100">
                {studentContext?.groupName?.trim() || 'Группа не указана'}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                Преподаватель:{' '}
                {studentContext?.teacherName?.trim() ||
                  studentContext?.teacherEmail?.trim() ||
                  'не назначен'}
              </p>
            </div>
          </div>
          <Link
            to="/student/tasks"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-background-dark hover:bg-primary/90 transition-all shrink-0"
          >
            Перейти к задачам
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border-color bg-surface p-5 flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">Прогресс</h2>
              <BarChart3 aria-hidden className="size-5 text-primary" strokeWidth={1.75} />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">Решено задач</span>
                {progressLoading ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <span className="font-medium text-primary">{progressLabel}</span>
                )}
              </div>
              <div className="h-2.5 w-full rounded-full bg-border-color overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressLoading ? 0 : progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {progressLoading
                  ? 'Загрузка...'
                  : totalTasks === 0
                    ? 'Преподаватель ещё не назначил задачи'
                    : `Выполнено на ${progressPercent}%`}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border-color bg-surface p-5 flex flex-col justify-between">
            {HAS_IN_PROGRESS_LEARNING ? (
              <>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-widest text-primary uppercase">
                    {CONTINUE_LESSON.tag}
                  </p>
                  <h3 className="mb-1 text-lg font-bold">{CONTINUE_LESSON.title}</h3>
                  <p className="text-sm text-slate-400">{CONTINUE_LESSON.meta}</p>
                </div>
                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-bold text-background-dark transition-all hover:bg-primary/90"
                  type="button"
                  onClick={() => navigate('/student/tasks')}
                >
                  <Play aria-hidden className="size-5 fill-current" />
                  Решать
                </button>
              </>
            ) : (
              <>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-widest text-primary uppercase">
                    Начать изучение
                  </p>
                  <h3 className="mb-1 text-lg font-bold">Пока ничего не начато</h3>
                  <p className="text-sm text-slate-400">
                    Откройте список задач и отправьте первое решение.
                  </p>
                </div>
                <button
                  className="mt-4 w-full rounded-lg bg-primary py-2.5 font-bold text-background-dark transition-all hover:bg-primary/90"
                  type="button"
                  onClick={() => navigate('/student/tasks')}
                >
                  Начать
                </button>
              </>
            )}
          </div>
        </div>

        <StudentSubmissionHistory />
      </div>
    </main>
  );
}
