import { Modal } from '@/components/Modal';
import { TaskListElement } from '@/components/TaskListElement/TaskListElement';
import type { Task } from '@/pages/student/StudentTasksPage/StudentTasksPage';
import { PlusSquare, RocketIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export function TeacherTasksPage() {
  const [createModalOpened, setCreateModalOpened] = useState(false);

  useEffect(() => {
    document.title = 'Задачи | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Ваши задачи</h1>
          <button
            className="text-xs mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-1 px-3 rounded-lg shadow-lg transition-all flex items-center gap-2"
            onClick={() => setCreateModalOpened(true)}
          >
            <PlusSquare className="w-5" />
            Создать
          </button>
        </div>
        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Название задачи
                  </th>
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
                {mockTasks.map((task) => (
                  <TaskListElement task={task} isCRUDable />
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
      </main>
      <Modal isOpen={createModalOpened} onClose={() => setCreateModalOpened(false)} title="Создание задачи">
        <div className="w-[600px]">
          <div>
            <span className="text-s text-slate-300">Раздел</span>
          </div>
          <select className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer">
            <option>Алгоритмы</option>
            <option>Текстовые</option>
            <option>Логические</option>
          </select>

          <div className="mt-8 mb-1">
            <span className="text-s text-slate-300">Язык программирования</span>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                className="w-3 h-3 accent-blue-500 rounded"
                type="checkbox"
                name="Java"
                checked={false}
                onChange={undefined}
              />
              Java
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                className="w-3 h-3 accent-blue-500 rounded"
                type="checkbox"
                name="JavaScript"
                checked={false}
                onChange={undefined}
              />
              JavaScript
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                className="w-3 h-3 accent-blue-500 rounded"
                type="checkbox"
                name="Python"
                checked={false}
                onChange={undefined}
              />
              Python
            </label>
          </div>

          <div className="mt-8 mb-1">
            <span className="text-s text-slate-300">Название задачи</span>
          </div>
          <input
            className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
            placeholder="Введите краткое и понятное название"
          ></input>

          <div className="mt-8 mb-1">
            <span className="text-s text-slate-300">Описание задачи</span>
          </div>
          <textarea
            className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
            placeholder="Опишите условие задачи, входные и выходные данные"
          ></textarea>

          <div className="w-full flex justify-end gap-4  mt-10">
            <button
              className="bg-secondary text-slate-300 font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
              onClick={() => setCreateModalOpened(false)}
            >
              Отмена
            </button>
            <button
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
              onClick={undefined}
            >
              <RocketIcon className="text-white" />
              Отправить на проверку
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
