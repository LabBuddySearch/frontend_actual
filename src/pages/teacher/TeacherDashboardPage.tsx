import {
  failureReasonLabel,
  getTeacherDashboardStats,
  type GroupDashboardStats,
  type TaskDashboardStats,
} from '@/shared/api/stats';
import { CheckCircle2, ChevronDown, ChevronRight, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TeacherDashboardPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupDashboardStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
  const [expandedTaskKey, setExpandedTaskKey] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Преподаватель | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    void getTeacherDashboardStats()
      .then((data) => setGroups(data.groups))
      .catch(() => setError('Не удалось загрузить статистику.'))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleTask = (groupId: number, taskId: number) => {
    const key = `${groupId}-${taskId}`;
    setExpandedTaskKey((prev) => (prev === key ? null : key));
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Действия</h3>
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
            onClick={() => navigate('/teacher/tasks/new')}
          >
            Создать задачу
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-100">Статистика групп</h3>
        <p className="text-sm text-slate-400">
          По каждой задаче: кто решил успешно и кто не сдал (дедлайн или исчерпаны попытки).
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Загрузка статистики...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-8 text-center text-red-300" role="alert">
            {error}
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-xl border border-border-color bg-surface px-6 py-16 text-center">
            <p className="text-sm text-slate-400">Пока нет групп. Создайте группу в разделе «Мои группы».</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.groupId}
                className="rounded-xl border border-border-color bg-surface overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-slate-800/20 transition-colors"
                  type="button"
                  onClick={() =>
                    setExpandedGroupId((prev) => (prev === group.groupId ? null : group.groupId))
                  }
                >
                  <span className="font-semibold text-slate-100">{group.groupName}</span>
                  <span className="text-xs text-slate-500">
                    {group.tasks.length} {group.tasks.length === 1 ? 'задача' : 'задач'}
                  </span>
                  {expandedGroupId === group.groupId ? (
                    <ChevronDown className="size-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="size-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {expandedGroupId === group.groupId && (
                  <div className="border-t border-border-color px-4 py-4 space-y-3">
                    {group.tasks.length === 0 ? (
                      <p className="text-sm text-slate-500 px-2 py-4 text-center">
                        Нет задач для этой группы. Назначьте задачу на группу или «всем студентам».
                      </p>
                    ) : (
                      group.tasks.map((task) => (
                        <TaskStatsCard
                          key={task.taskId}
                          expanded={expandedTaskKey === `${group.groupId}-${task.taskId}`}
                          groupId={group.groupId}
                          task={task}
                          onToggle={() => toggleTask(group.groupId, task.taskId)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TaskStatsCard({
  task,
  expanded,
  onToggle,
}: {
  groupId: number;
  task: TaskDashboardStats;
  expanded: boolean;
  onToggle: () => void;
}) {
  const solvedCount = task.solvedStudents.length;
  const failedCount = task.failedStudents.length;

  return (
    <div className="rounded-lg border border-border-color/80 bg-background-dark/30 overflow-hidden">
      <button
        className="w-full flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-800/30 transition-colors"
        type="button"
        onClick={onToggle}
      >
        <span className="font-medium text-slate-200">{task.taskTitle}</span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="size-3.5" />
            {solvedCount} решили
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <XCircle className="size-3.5" />
            {failedCount} не сдали
          </span>
          {expanded ? (
            <ChevronDown className="size-4 text-slate-500" />
          ) : (
            <ChevronRight className="size-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border-color/60 px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80 mb-2">
              Решили успешно
            </p>
            {task.solvedStudents.length === 0 ? (
              <p className="text-slate-500">Пока никто</p>
            ) : (
              <ul className="space-y-1.5">
                {task.solvedStudents.map((s) => (
                  <li key={s.studentId} className="text-slate-300">
                    {s.fullName}
                    <span className="text-slate-500 text-xs ml-2">{s.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-500/80 mb-2">
              Не сдали
            </p>
            {task.failedStudents.length === 0 ? (
              <p className="text-slate-500">Нет</p>
            ) : (
              <ul className="space-y-1.5">
                {task.failedStudents.map((s) => (
                  <li key={s.studentId} className="text-slate-300">
                    {s.fullName}
                    <span className="block text-xs text-rose-400/90 mt-0.5">
                      {failureReasonLabel(s.failureReason)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
