import { Modal } from '@/components/Modal';
import type { TaskDifficulty, TaskDraft, TaskLanguage } from '@/types/task';
import { RocketIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const SECTIONS = ['Алгоритмы', 'Текстовые', 'Логические'] as const;

const LANGS: TaskLanguage[] = ['Java', 'JavaScript', 'Python'];

const DIFFICULTIES: TaskDifficulty[] = ['Easy', 'Medium', 'Hard'];

export type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Готовый черновик без id и isDone */
  onSubmit: (draft: TaskDraft) => void;
  modalTitle: string;
  submitLabel: string;
  /** Показать иконку у основной кнопки (по умолчанию true) */
  showSubmitIcon?: boolean;
};

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  modalTitle,
  submitLabel,
  showSubmitIcon = true,
}: CreateTaskModalProps) {
  const [section, setSection] = useState<string>(SECTIONS[0]);
  const [name, setName] = useState('');
  const [lang, setLang] = useState<TaskLanguage>('Java');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Medium');
  const [time, setTime] = useState('1000');
  const [memory, setMemory] = useState('256');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSection(SECTIONS[0]);
    setName('');
    setLang('Java');
    setDifficulty('Medium');
    setTime('1000');
    setMemory('256');
    setDescription('');
  }, [isOpen]);

  const timeNum = Number.parseInt(time, 10);
  const memoryNum = Number.parseInt(memory, 10);

  const canSubmit =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    Number.isFinite(timeNum) &&
    timeNum > 0 &&
    Number.isFinite(memoryNum) &&
    memoryNum > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      section: section.trim() || SECTIONS[0],
      lang,
      difficulty,
      time: timeNum,
      memory: memoryNum,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="w-[600px]">
        <div>
          <span className="text-s text-slate-300">Раздел</span>
        </div>
        <select
          className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          {SECTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="mt-8 mb-1">
          <span className="text-s text-slate-300">Название задачи</span>
        </div>
        <input
          className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
          placeholder="Краткое название"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-8 mb-1">
          <span className="text-s text-slate-300">Язык программирования</span>
        </div>
        <select
          className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
          value={lang}
          onChange={(e) => setLang(e.target.value as TaskLanguage)}
        >
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <div className="mt-8 mb-1">
          <span className="text-s text-slate-300">Сложность</span>
        </div>
        <select
          className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d === 'Easy' ? 'Лёгкая' : d === 'Medium' ? 'Средняя' : 'Сложная'}
            </option>
          ))}
        </select>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1">
              <span className="text-s text-slate-300">Лимит времени (мс)</span>
            </div>
            <input
              className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
              min={1}
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1">
              <span className="text-s text-slate-300">Лимит памяти (МБ)</span>
            </div>
            <input
              className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
              min={1}
              type="number"
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 mb-1">
          <span className="text-s text-slate-300">Текст задачи</span>
        </div>
        <textarea
          className="w-full min-h-[120px] resize-y bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
          placeholder="Условие, входные и выходные данные"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="w-full flex justify-end gap-4 mt-10">
          <button
            className="bg-secondary text-slate-300 font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            type="button"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            type="button"
            onClick={handleSubmit}
          >
            {showSubmitIcon ? <RocketIcon className="text-white" /> : null}
            {submitLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
