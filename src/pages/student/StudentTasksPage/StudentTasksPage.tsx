import { TaskListElement } from '@/components/TaskListElement/TaskListElement';
import { LightbulbIcon, TrendingUp, TrophyIcon } from 'lucide-react';
import { useEffect } from 'react';

// временно здесь
export type Task = {
  id: number;
  isDone: boolean;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lang: 'JavaScript' | 'Java' | 'Python';
  time: number;
  memory: number;
};

const mockTasks: Task[] = [
  {
    id: 1,
    isDone: true,
    name: 'Двусвязный список: Базовые операции',
    description: 'Реализуйте методы вставки и удаления узлов',
    difficulty: 'Medium',
    lang: 'Java',
    time: 1000,
    memory: 256,
  },
  {
    id: 2,
    isDone: false,
    name: 'Бинарный поиск в массиве',
    description: 'Классический поиск элемента за O(log n)',
    difficulty: 'Easy',
    lang: 'Python',
    time: 1500,
    memory: 256,
  },
  {
    id: 3,
    isDone: true,
    name: 'Сортировка пузырьком',
    description: 'Простейший алгоритм сортировки',
    difficulty: 'Easy',
    lang: 'Java',
    time: 800,
    memory: 512,
  },
  {
    id: 4,
    isDone: false,
    name: 'Кратчайший путь: Алгоритм Дейкстры',
    description: 'Поиск пути в графе с весами',
    difficulty: 'Hard',
    lang: 'JavaScript',
    time: 800,
    memory: 128,
  },
  {
    id: 5,
    isDone: false,
    name: 'Обход дерева в ширину (BFS)',
    description: 'Использование очереди для обхода структуры',
    difficulty: 'Medium',
    lang: 'JavaScript',
    time: 1200,
    memory: 256,
  },
  {
    id: 6,
    isDone: true,
    name: 'Решето Эратосфена',
    description: 'Поиск простых чисел до заданного N',
    difficulty: 'Easy',
    lang: 'Python',
    time: 1000,
    memory: 256,
  },
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
                <TaskListElement task={task} isCRUDable={false} />
              ))}
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
