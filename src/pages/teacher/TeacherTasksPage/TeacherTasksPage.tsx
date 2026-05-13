import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { PlatformTasksTable } from '@/components/tasks/PlatformTasksTable';
import type { Task, TaskDraft } from '@/types/task';
import { PlusSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

const initialTasks: Task[] = [
  {
    id: 1,
    isDone: true,
    name: 'Двусвязный список: Базовые операции',
    description: 'Реализуйте методы вставки и удаления узлов',
    difficulty: 'Medium',
    lang: 'Java',
    time: 1000,
    memory: 256,
    section: 'Алгоритмы',
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
    section: 'Алгоритмы',
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
    section: 'Алгоритмы',
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
    section: 'Алгоритмы',
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
    section: 'Алгоритмы',
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
    section: 'Алгоритмы',
  },
];

export function TeacherTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  useEffect(() => {
    document.title = 'Задачи | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  const handleCreateTask = (draft: TaskDraft) => {
    const nextId = tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    setTasks((prev) => [...prev, { ...draft, id: nextId, isDone: false }]);
    setCreateModalOpened(false);
  };

  const handleDeleteTask = (task: Task) => {
    if (!window.confirm(`Удалить задачу «${task.name}»?`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Ваши задачи</h1>
          <button
            className="text-xs mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-1 px-3 rounded-lg shadow-lg transition-all flex items-center gap-2"
            type="button"
            onClick={() => setCreateModalOpened(true)}
          >
            <PlusSquare className="w-5" />
            Создать
          </button>
        </div>
        <PlatformTasksTable tasks={tasks} onDeleteTask={handleDeleteTask} />
      </main>
      <CreateTaskModal
        isOpen={createModalOpened}
        modalTitle="Создание задачи"
        submitLabel="Отправить на проверку"
        onClose={() => setCreateModalOpened(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}
