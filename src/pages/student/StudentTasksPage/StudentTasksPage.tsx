import { TaskListElement } from '@/components/TaskListElement/TaskListElement';
import { getTasks, getTaskApiErrorMessage } from '@/shared/api/tasks';
import { TASK_SECTIONS, type TaskSection } from '@/shared/lib/task-category';
import { shortTaskToUiTask } from '@/shared/lib/task-mappers';
import type { Task } from '@/types/task';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type { Task } from '@/types/task';

export function StudentTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeSection, setActiveSection] = useState<TaskSection>(TASK_SECTIONS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTasks();
      setTasks(response.tasks.map(shortTaskToUiTask));
    } catch (err) {
      setError(getTaskApiErrorMessage(err, 'Не удалось загрузить задачи.'));
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Задачи | EduCode';
    void loadTasks();
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, [loadTasks]);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.section === activeSection),
    [tasks, activeSection],
  );

  const sectionCounts = useMemo(() => {
    const counts: Record<TaskSection, number> = {
      Алгоритмы: 0,
      Текстовые: 0,
      Логические: 0,
    };
    for (const task of tasks) {
      if (task.section in counts) {
        counts[task.section as TaskSection] += 1;
      }
    }
    return counts;
  }, [tasks]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Каталог задач</h1>
        <p className="text-slate-400">Задачи, назначенные вам или вашей группе.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-border-dark pb-1">
        {TASK_SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeSection === section
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section}
            <span className="ml-2 text-xs opacity-70">({sectionCounts[section]})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="size-5 animate-spin" />
          Загрузка задач...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6 text-red-300 text-center" role="alert">
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-border-dark bg-surface-dark p-8 text-center text-slate-400">
          Пока нет доступных задач. Преподаватель может назначить задачу вашей группе или вам лично.
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-border-dark bg-surface-dark p-8 text-center text-slate-400">
          В разделе «{activeSection}» пока нет задач.
        </div>
      ) : (
        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 min-w-[140px]">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Название задачи</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-48 text-right">
                    Сложность
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {filteredTasks.map((task) => (
                  <TaskListElement key={task.id} task={task} isCRUDable={false} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-slate-800/10 border-t border-border-dark flex flex-wrap justify-between gap-2 text-sm text-slate-400">
            <span>
              В разделе: {filteredTasks.length}
            </span>
            <span>Всего задач: {tasks.length}</span>
          </div>
        </div>
      )}
    </main>
  );
}
