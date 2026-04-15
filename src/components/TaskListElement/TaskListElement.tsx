import type { Task } from '@/pages/student/StudentTasksPage/StudentTasksPage'; //temp
import { CheckCircle2, Circle, PenBoxIcon, Trash2Icon } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  task: Task;
  isCRUDable: boolean;
}

export const TaskListElement: FC<Props> = ({ task, isCRUDable }) => {
  const navigate = useNavigate();

  const { id, isDone, name, description, lang, difficulty } = task;

  const difficultyChipClass = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} border`;

  return (
    <tr
      className={`hover:bg-slate-800/20 transition-colors group ${isCRUDable ? '' : 'cursor-pointer'}`}
      onClick={isCRUDable ? undefined : () => navigate(`${id}`, { state: { task } })}
    >
      {!isCRUDable && (
        <td className="px-6 py-5">
          {isDone ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}
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
            <PenBoxIcon className="text-slate-400 hover:text-slate-200 transition-colors duration-300 w-5" />
            <Trash2Icon className="text-slate-400 hover:text-slate-200 transition-colors duration-300 w-5" />
          </div>
        </td>
      )}
    </tr>
  );
};
