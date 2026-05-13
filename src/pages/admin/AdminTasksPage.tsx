import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { PlatformTasksTable } from '@/components/tasks/PlatformTasksTable';
import { useAdminPlatformStore } from '@/store/adminPlatformStore';
import type { Task, TaskDraft } from '@/types/task';
import { useEffect, useState } from 'react';

export function AdminTasksPage() {
  const tasks = useAdminPlatformStore((s) => s.tasks);
  const addTask = useAdminPlatformStore((s) => s.addTask);
  const removeTask = useAdminPlatformStore((s) => s.removeTask);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Задачи | EduCode';
    return () => {
      document.title = 'Панель Администратора | EduCode';
    };
  }, []);

  const handleSubmit = (draft: TaskDraft) => {
    addTask(draft);
    setModalOpen(false);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Удалить задачу «${task.name}»?`)) removeTask(task.id);
  };

  return (
    <main className="flex flex-1 justify-center overflow-y-auto px-6 py-8 lg:px-10">
      <div className="layout-content-container flex max-w-[1200px] flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-400">Главная / Задачи</p>
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-100">Задачи</h1>
          <p className="text-sm text-slate-400">Список задач платформы. Количество на дашборде совпадает с числом строк ниже.</p>
        </div>

        <div className="flex justify-end">
          <button
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-background-dark transition-colors hover:bg-primary/90"
            type="button"
            onClick={() => setModalOpen(true)}
          >
            Добавить задачу
          </button>
        </div>

        <PlatformTasksTable tasks={tasks} onDeleteTask={handleDeleteTask} />
      </div>

      <CreateTaskModal
        isOpen={modalOpen}
        modalTitle="Новая задача"
        showSubmitIcon={false}
        submitLabel="Добавить"
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
