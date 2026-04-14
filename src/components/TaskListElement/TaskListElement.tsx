import type { Task } from '@/pages/student/StudentTasksPage/StudentTasksPage'; //temp
import { CheckCircle2, Circle } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  task: Task;
}

export const TaskListElement: FC<Props> = ({ task: { isDone, name, description, difficulty } }) => {
  const navigate = useNavigate();

  const difficultyChipClass = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} border`;

  return (
    <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer" onClick={() => navigate('1')}>
      <td className="px-6 py-5">
        {isDone ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">{name}</span>
          <span className="text-xs text-slate-500 mt-1">{description}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <span className={difficultyChipClass}>{difficulty}</span>
      </td>
    </tr>
  );
};
