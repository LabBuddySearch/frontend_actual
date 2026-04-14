import { TaskListElement } from '@/components/TaskListElement/TaskListElement';
import { CheckCircle2, Circle, LightbulbIcon, TrendingUp, TrophyIcon } from 'lucide-react';
import { useEffect } from 'react';

// временно здесь
export type Task = {
  isDone: boolean;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

const mockTasks: Task[] = [
  {
    isDone: true,
    name: 'Двусвязный список: Базовые операции',
    description: 'Реализуйте методы вставки и удаления узлов',
    difficulty: 'Medium',
  },
  { isDone: false, name: '', description: '', difficulty: 'Easy' },
  { isDone: true, name: '', description: '', difficulty: 'Easy' },
  { isDone: false, name: '', description: '', difficulty: 'Hard' },
  { isDone: false, name: '', description: '', difficulty: 'Medium' },
  { isDone: true, name: '', description: '', difficulty: 'Easy' },
];

export function StudentTasksPage() {
  useEffect(() => {
    document.title = 'Задачи | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Каталог задач</h1>
        <p className="text-slate-400">Практикуйтесь на реальных алгоритмических задачах разной сложности.</p>
      </div>
      <div className="flex border-b border-border-dark mb-6 overflow-x-auto no-scrollbar">
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-primary text-primary whitespace-nowrap">
          Алгоритмы
        </button>
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-100 transition-colors whitespace-nowrap">
          Текстовые
        </button>
        <button className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-100 transition-colors whitespace-nowrap">
          Логические
        </button>
      </div>
      <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-16">Статус</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Название задачи</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-48 text-right">
                  Сложность
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {mockTasks.map((task) => (
                <TaskListElement task={task} />
              ))}
              <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <CheckCircle2 className="text-emerald-500" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">
                      Двусвязный список: Базовые операции
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Реализуйте методы вставки и удаления узлов</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Medium
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <Circle className="text-slate-600" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">
                      Бинарный поиск в массиве
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Классический поиск элемента за O(log n)</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Easy
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <CheckCircle2 className="text-emerald-500" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">
                      Сортировка пузырьком
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Простейший алгоритм сортировки</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Easy
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <Circle className="text-slate-600" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">
                      Кратчайший путь: Алгоритм Дейкстры
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Поиск пути в графе с весами</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Hard
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <Circle className="text-slate-600" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">
                      Обход дерева в ширину (BFS)
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Использование очереди для обхода структуры</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Medium
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <CheckCircle2 className="text-emerald-500" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-primary transition-colors">
                      Решето Эратосфена
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Поиск простых чисел до заданного N</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Easy
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-800/10 flex items-center justify-between border-t border-border-dark">
          <span className="text-sm text-slate-400">Показано 6 из 42 задач</span>
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
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-surface-dark border border-border-dark">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-primary" />
            <h3 className="font-bold text-slate-100">Ваш прогресс</h3>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full w-2/3"></div>
          </div>
          <p className="text-sm text-slate-400">Выполнено 28 из 42 задач в категории Алгоритмы</p>
        </div>
        <div className="p-6 rounded-xl bg-surface-dark border border-border-dark">
          <div className="flex items-center gap-3 mb-4">
            <TrophyIcon className="text-primary" />
            <h3 className="font-bold text-slate-100">Рейтинг</h3>
          </div>
          <p className="text-2xl font-bold text-slate-100">#1,245</p>
          <p className="text-sm text-slate-400">Топ 15% среди всех студентов платформы</p>
        </div>
        <div className="p-6 rounded-xl bg-surface-dark border border-border-dark">
          <div className="flex items-center gap-3 mb-4">
            <LightbulbIcon className="text-primary" />
            <h3 className="font-bold text-slate-100">Рекомендация</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Попробуйте решить <span className="text-primary font-medium">Динамическое программирование</span>, чтобы
            закрепить навыки рекурсии.
          </p>
        </div>
      </div>
    </main>
  );
}
