import { TaskListElement } from '@/components/TaskListElement/TaskListElement';
import type { Task } from '@/types/task';
import type { ReactNode } from 'react';

export type PlatformTasksTableProps = {
  tasks: Task[];
  /** Текст в футере слева; по умолчанию «Всего задач: N» */
  footerLeft?: ReactNode;
  emptyMessage?: string;
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  deletingId?: number | null;
};

export function PlatformTasksTable({
  tasks,
  footerLeft,
  emptyMessage = 'Задач пока нет.',
  onDeleteTask,
  onEditTask,
  deletingId = null,
}: PlatformTasksTableProps) {
  const left =
    footerLeft !== undefined ? footerLeft : <span className="text-sm text-slate-400">Всего задач: {tasks.length}</span>;

  return (
    <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Название задачи</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-48">Язык</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-32 text-right">
                Сложность
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-32 text-right">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {tasks.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-slate-500" colSpan={4}>
                  {emptyMessage}
                </td>
              </tr>
            )}
            {tasks.map((task) => (
              <TaskListElement
                key={task.id}
                isCRUDable
                isDeleting={deletingId === task.id}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                task={task}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-800/10 flex items-center justify-between border-t border-border-dark">
        {left}
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border border-border-dark text-slate-300 hover:bg-slate-800 transition-colors">
            Назад
          </button>
          <button className="px-3 py-1 rounded border border-border-dark text-slate-300 hover:bg-slate-800 transition-colors">
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}
