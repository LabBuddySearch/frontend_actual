import { CreateGroupModal } from '@/components/teacher/CreateGroupModal';
import {
  createTeacherGroup,
  detachTeacherGroup,
  getTeacherApiErrorMessage,
  getTeacherGroups,
  type TeacherGroup,
} from '@/shared/api/teacher';
import {
  getGroupStats,
  taskStatsStatusLabel,
  type GroupStatsResponse,
} from '@/shared/api/stats';
import { Loader2, PlusSquare, Trash2 } from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';

export function TeacherGroupsPage() {
  const [groups, setGroups] = useState<TeacherGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detachingId, setDetachingId] = useState<number | null>(null);
  const [statsByGroupId, setStatsByGroupId] = useState<Record<number, GroupStatsResponse>>({});
  const [statsLoadingId, setStatsLoadingId] = useState<number | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTeacherGroups();
      setGroups(data.groups);
    } catch (err) {
      setError(getTeacherApiErrorMessage(err, 'Не удалось загрузить группы.'));
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Группы | EduCode';
    void load();
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, [load]);

  const handleCreate = async (name: string) => {
    setIsSubmitting(true);
    try {
      await createTeacherGroup({ name });
      await load();
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGroup = async (groupId: number) => {
    if (expandedId === groupId) {
      setExpandedId(null);
      setExpandedStudentId(null);
      return;
    }
    setExpandedId(groupId);
    setExpandedStudentId(null);
    if (statsByGroupId[groupId]) return;

    setStatsLoadingId(groupId);
    setStatsError(null);
    try {
      const stats = await getGroupStats(groupId);
      setStatsByGroupId((prev) => ({ ...prev, [groupId]: stats }));
    } catch {
      setStatsError('Не удалось загрузить статистику по задачам.');
    } finally {
      setStatsLoadingId(null);
    }
  };

  const handleDetach = async (group: TeacherGroup) => {
    const confirmed = window.confirm(
      `Отвязать группу «${group.name}»? Студенты этой группы будут скрыты из вашего списка, их код группы в профиле будет сброшен.`,
    );
    if (!confirmed) return;

    setDetachingId(group.id);
    try {
      await detachTeacherGroup(group.id);
      if (expandedId === group.id) setExpandedId(null);
      await load();
    } catch (err) {
      window.alert(getTeacherApiErrorMessage(err, 'Не удалось отвязать группу.'));
    } finally {
      setDetachingId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Мои группы</h1>
          <p className="text-slate-400">
            Создавайте группы и управляйте списком студентов. Отвязанная группа исчезает из списка, студенты скрываются.
          </p>
        </div>
        <button
          className="text-xs bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 self-start"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          <PlusSquare className="w-5" />
          Создать группу
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-400 py-12 justify-center">
          <Loader2 className="size-5 animate-spin" />
          Загрузка...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6 text-red-300 text-center" role="alert">
          {error}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border border-border-dark bg-surface-dark p-8 text-center text-slate-400">
          Групп пока нет. Нажмите «Создать группу», чтобы добавить первую.
        </div>
      ) : (
        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Код группы</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-32">
                    Студентов
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-48 text-right">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {groups.map((group) => (
                  <Fragment key={group.id}>
                    <tr className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          className="text-slate-100 font-medium hover:text-primary text-left"
                          type="button"
                          onClick={() => void toggleGroup(group.id)}
                        >
                          {group.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{group.students.length}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          aria-label="Отвязать группу"
                          className="inline-flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300 disabled:opacity-50"
                          disabled={detachingId === group.id}
                          type="button"
                          onClick={() => void handleDetach(group)}
                        >
                          {detachingId === group.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                          Отвязать
                        </button>
                      </td>
                    </tr>
                    {expandedId === group.id && (
                      <tr className="bg-background-dark/40">
                        <td className="px-6 py-4" colSpan={3}>
                          {group.students.length === 0 ? (
                            <p className="text-sm text-slate-500">В группе пока нет студентов.</p>
                          ) : (
                            <ul className="space-y-2 mb-6">
                              {group.students.map((s) => (
                                <li
                                  key={s.id}
                                  className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border border-border-dark/50 rounded-lg px-4 py-2"
                                >
                                  <span className="text-slate-200">{s.fullName}</span>
                                  <span className="text-slate-500">{s.email}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                            Статистика по задачам группы
                          </h3>
                          {statsLoadingId === group.id ? (
                            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                              <Loader2 className="size-4 animate-spin" />
                              Загрузка статистики...
                            </div>
                          ) : statsError ? (
                            <p className="text-sm text-red-400">{statsError}</p>
                          ) : statsByGroupId[group.id]?.students.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              Нет данных: назначьте задачи на эту группу, чтобы увидеть прогресс.
                            </p>
                          ) : (
                            <div className="overflow-x-auto rounded-lg border border-border-dark/60">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase">
                                    <th className="px-4 py-2">Студент</th>
                                    <th className="px-4 py-2">Решено</th>
                                    <th className="px-4 py-2 w-28">Детали</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark/40">
                                  {statsByGroupId[group.id]?.students.map((row) => (
                                    <Fragment key={row.studentId}>
                                      <tr>
                                        <td className="px-4 py-2 text-slate-200">{row.fullName}</td>
                                        <td className="px-4 py-2 text-slate-400">
                                          {row.solvedTasksCount} / {row.tasks.length}
                                        </td>
                                        <td className="px-4 py-2">
                                          {row.tasks.length > 0 && (
                                            <button
                                              className="text-primary hover:underline text-xs"
                                              type="button"
                                              onClick={() =>
                                                setExpandedStudentId((prev) =>
                                                  prev === row.studentId ? null : row.studentId,
                                                )
                                              }
                                            >
                                              {expandedStudentId === row.studentId
                                                ? 'Скрыть'
                                                : 'Задачи'}
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                      {expandedStudentId === row.studentId && (
                                        <tr>
                                          <td className="px-4 py-2 bg-slate-900/30" colSpan={3}>
                                            <ul className="space-y-1">
                                              {row.tasks.map((t) => (
                                                <li
                                                  key={t.taskId}
                                                  className="flex flex-wrap justify-between gap-2 text-xs text-slate-400 border-b border-slate-800/50 py-1 last:border-0"
                                                >
                                                  <span className="text-slate-300">{t.taskTitle}</span>
                                                  <span>{taskStatsStatusLabel(t.status)}</span>
                                                  <span>
                                                    попытки {t.attemptsUsed}/{t.maxAttempts}
                                                  </span>
                                                </li>
                                              ))}
                                            </ul>
                                          </td>
                                        </tr>
                                      )}
                                    </Fragment>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateGroupModal
        isOpen={createOpen}
        isSubmitting={isSubmitting}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </main>
  );
}
