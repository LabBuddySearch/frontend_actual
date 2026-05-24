import { Modal } from '@/components/Modal';
import { getTeacherApiErrorMessage } from '@/shared/api/teacher';
import { useState } from 'react';

type CreateGroupModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
};

export function CreateGroupModal({ isOpen, isSubmitting, onClose, onSubmit }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Введите код группы.');
      return;
    }
    setError(null);
    try {
      await onSubmit(trimmed);
      setName('');
      onClose();
    } catch (err) {
      setError(getTeacherApiErrorMessage(err, 'Не удалось создать группу.'));
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создание группы">
      <div className="w-[420px] max-w-full">
        <label className="text-sm text-slate-300" htmlFor="group-name">
          Код группы
        </label>
        <input
          id="group-name"
          className="mt-2 w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
          placeholder="Например: БПИ-2301"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="mt-2 text-xs text-slate-500">
          Студенты смогут выбрать эту группу при регистрации.
        </p>
        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="bg-secondary text-slate-300 font-bold py-2 px-4 rounded-lg"
            type="button"
            onClick={handleClose}
          >
            Отмена
          </button>
          <button
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            disabled={isSubmitting || !name.trim()}
            type="button"
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
