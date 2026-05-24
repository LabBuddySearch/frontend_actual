import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { PlatformTasksTable } from '@/components/tasks/PlatformTasksTable';
import {
  deleteTask,
  getTaskApiErrorMessage,
  getTasks,
  getTeacherTaskById,
  updateTask,
} from '@/shared/api/tasks';
import { TASK_SECTIONS, type TaskSection } from '@/shared/lib/task-category';
import type { TaskFormValues } from '@/shared/lib/task-mappers';
import {
  draftToEditTaskRequest,
  shortTaskToUiTask,
  taskResponseToFormValues,
} from '@/shared/lib/task-mappers';
import type { Task } from '@/types/task';
import { Loader2, PlusSquare } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TeacherTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeSection, setActiveSection] = useState<TaskSection>(TASK_SECTIONS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<TaskFormValues | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const response = await getTasks();
      setTasks(response.tasks.map(shortTaskToUiTask));
    } catch (err) {
      setListError(getTaskApiErrorMessage(err, 'Не удалось загрузить список задач.'));
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Задачи | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.section === activeSection),
    [tasks, activeSection],
  );

  const sectionCounts = useMemo(() => {
    const counts: Record<TaskSection, number> = {
      Алгоритмы: 0,
      Текстовые: 0,
      Логические: 0,
    };
    for (const task of tasks) {
      if (task.section in counts) {
        counts[task.section as TaskSection] += 1;
      }
    }
    return counts;
  }, [tasks]);

  const handleEditTask = async (task: Task) => {
    setEditingTaskId(task.id);
    setEditModalOpened(true);
    setIsEditLoading(true);
    setFormError(null);
    setEditInitialValues(null);
    try {
      const fullTask = await getTeacherTaskById(task.id);
      setEditInitialValues(taskResponseToFormValues(fullTask));
    } catch (err) {
      setFormError(getTaskApiErrorMessage(err, 'Не удалось загрузить задачу для редактирования.'));
      setEditModalOpened(false);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleUpdateTask = async (draft: TaskFormValues) => {
    if (editingTaskId == null) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await updateTask(editingTaskId, draftToEditTaskRequest(editingTaskId, draft));
      setEditModalOpened(false);
      setEditingTaskId(null);
      setEditInitialValues(null);
      await loadTasks();
    } catch (err) {
      setFormError(getTaskApiErrorMessage(err, 'Не удалось сохранить изменения.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const confirmed = window.confirm(
      `Удалить задачу «${task.name}»?\n\nВсе тесты и попытки студентов по этой задаче будут удалены. Это действие нельзя отменить.`,
    );
    if (!confirmed) return;

    setDeletingId(task.id);
    try {
      await deleteTask(task.id);
      if (editingTaskId === task.id) {
        setEditModalOpened(false);
        setEditingTaskId(null);
        setEditInitialValues(null);
      }
      await loadTasks();
    } catch (err) {
      window.alert(getTaskApiErrorMessage(err, 'Не удалось удалить задачу.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Ваши задачи</h1>
            <p className="text-slate-400 text-sm">Управление задачами по разделам каталога.</p>
          </div>
          <button
            className="text-xs bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 self-start shrink-0"
            type="button"
            onClick={() => navigate('/teacher/tasks/new')}
          >
            <PlusSquare className="w-5" />
            Создать задачу
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-border-dark pb-1">
          {TASK_SECTIONS.map((section) => (
            <button
              key={section}
              type="button"
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
                activeSection === section
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section}
              <span className="ml-2 text-xs opacity-70">({sectionCounts[section]})</span>
            </button>
          ))}
        </div>

        {formError && !editModalOpened && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" role="alert">
            {formError}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="size-5 animate-spin" />
            Загрузка задач...
          </div>
        ) : listError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6 text-red-300 text-center" role="alert">
            {listError}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-border-dark bg-surface-dark p-8 text-center text-slate-400">
            Задач пока нет. Нажмите «Создать задачу», чтобы добавить первую.
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-border-dark bg-surface-dark p-8 text-center text-slate-400">
            В разделе «{activeSection}» пока нет задач.
          </div>
        ) : (
          <PlatformTasksTable
            deletingId={deletingId}
            emptyMessage={`В разделе «${activeSection}» задач нет.`}
            footerLeft={
              <span className="text-sm text-slate-400">
                В разделе: {filteredTasks.length} · Всего: {tasks.length}
              </span>
            }
            tasks={filteredTasks}
            onDeleteTask={(task) => void handleDeleteTask(task)}
            onEditTask={(task) => void handleEditTask(task)}
          />
        )}
      </main>

      <CreateTaskModal
        initialValues={editInitialValues}
        isOpen={editModalOpened && !isEditLoading && editInitialValues != null}
        isSubmitting={isSubmitting}
        modalTitle="Редактирование задачи"
        mode="edit"
        showSubmitIcon={false}
        submitLabel="Сохранить"
        onClose={() => {
          setEditModalOpened(false);
          setEditingTaskId(null);
          setEditInitialValues(null);
          setFormError(null);
        }}
        onSubmit={handleUpdateTask}
      />

      {editModalOpened && isEditLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <span className="inline-flex items-center gap-2 text-slate-200">
            <Loader2 className="size-6 animate-spin" />
            Загрузка задачи...
          </span>
        </div>
      )}

      {formError && editModalOpened && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 max-w-md rounded-lg border border-red-500/40 bg-red-900/90 px-4 py-3 text-sm text-red-200 shadow-lg" role="alert">
          {formError}
        </div>
      )}
    </>
  );
}
