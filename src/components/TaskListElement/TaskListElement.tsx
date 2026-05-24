import { studentStatusLabel } from '@/shared/lib/task-category';
import type { Task } from '@/types/task';
import { CheckCircle2, Circle, Loader2, PenBoxIcon, Trash2Icon } from 'lucide-react';
import type { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  task: Task;
  isCRUDable: boolean;
  isDeleting?: boolean;
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
}

function statusBadgeClass(status: Task['studentStatus']): string {
  switch (status) {
    case 'SOLVED':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'IN_PROGRESS':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'FAILED':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-700/40 text-slate-400 border-slate-600/40';
  }
}

export const TaskListElement: FC<Props> = ({
  task,
  isCRUDable,
  isDeleting = false,
  onDeleteTask,
  onEditTask,
}) => {
  const navigate = useNavigate();

  const { id, isDone, name, description, lang, difficulty, studentStatus } = task;

  const stopRowClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const difficultyChipClass = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} border`;

  const statusLabel = studentStatus ? studentStatusLabel(studentStatus) : isDone ? 'Решено' : 'Не решено';

  return (
    <tr
      className={`hover:bg-slate-800/20 transition-colors group ${isCRUDable ? '' : 'cursor-pointer'}`}
      onClick={isCRUDable ? undefined : () => navigate(`${id}`, { state: { task } })}
    >
      {!isCRUDable && (
        <td className="px-6 py-5">
          <div className="flex items-center gap-2">
            {isDone ? (
              <CheckCircle2 className="text-emerald-500 shrink-0 size-5" aria-hidden />
            ) : (
              <Circle className="text-slate-600 shrink-0 size-5" aria-hidden />
            )}
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(studentStatus)}`}
            >
              {statusLabel}
            </span>
          </div>
        </td>
      )}
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">{name}</span>
          {!isCRUDable && <span className="text-xs text-slate-500 mt-1">{description}</span>}
        </div>
      </td>
      {isCRUDable && (
        <td className="px-6 py-5">
          <span className="text-m text-slate-400 mt-1">{lang}</span>
        </td>
      )}
      <td className={`px-6 py-5 ${isCRUDable ? 'text-right' : 'text-right'}`}>
        <span className={difficultyChipClass}>{difficulty}</span>
      </td>
      {isCRUDable && (
        <td className={`px-6 py-5 ${isCRUDable ? 'text-right' : ''}`}>
          <div className="flex gap-3 justify-end">
            <button
              aria-label="Редактировать"
              className="p-0 border-0 bg-transparent cursor-pointer"
              type="button"
              onClick={(e) => {
                stopRowClick(e);
                onEditTask?.(task);
              }}
            >
              <PenBoxIcon className="text-slate-400 hover:text-slate-200 transition-colors duration-300 w-5" />
            </button>
            {onDeleteTask ? (
              <button
                aria-label="Удалить задачу"
                className="p-0 border-0 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={isDeleting}
                title="Удалить"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task);
                }}
              >
                {isDeleting ? (
                  <Loader2 className="text-rose-400 animate-spin w-5 h-5" />
                ) : (
                  <Trash2Icon className="text-slate-400 hover:text-rose-400 transition-colors duration-300 w-5" />
                )}
              </button>
            ) : null}
          </div>
        </td>
      )}
    </tr>
  );
};
