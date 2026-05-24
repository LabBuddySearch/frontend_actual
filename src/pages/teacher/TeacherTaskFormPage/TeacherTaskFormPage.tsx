import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { createTask, getTaskApiErrorMessage } from '@/shared/api/tasks';
import type { TaskFormValues } from '@/shared/lib/task-mappers';
import { draftToNewTaskRequest } from '@/shared/lib/task-mappers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TeacherTaskFormPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Создание задачи | EduCode';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  const handleSubmit = async (draft: TaskFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createTask(draftToNewTaskRequest(draft));
      navigate('/teacher/tasks', { replace: true });
    } catch (err) {
      setError(getTaskApiErrorMessage(err, 'Не удалось создать задачу.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}
      <CreateTaskModal
        isOpen
        isSubmitting={isSubmitting}
        modalTitle="Создание задачи"
        mode="create"
        showSubmitIcon={false}
        submitLabel="Создать"
        onClose={() => navigate('/teacher/tasks')}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
