import { Modal } from '@/components/Modal';
import { getTeacherGroups, type TeacherGroup } from '@/shared/api/teacher';
import type { TestCaseRequest } from '@/shared/api/tasks';
import { apiDateTimeToLocalInput, defaultDeadlineLocalInput } from '@/shared/lib/datetime';
import type { TaskAssignmentMode, TaskFormValues } from '@/shared/lib/task-mappers';
import type { TaskDifficulty, TaskLanguage } from '@/types/task';
import { Plus, RocketIcon, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { TASK_SECTIONS } from '@/shared/lib/task-category';

const SECTIONS = TASK_SECTIONS;

const LANGS: TaskLanguage[] = ['Java', 'JavaScript', 'Python'];

const DIFFICULTIES: TaskDifficulty[] = ['Easy', 'Medium', 'Hard'];

const EMPTY_TEST_CASE: TestCaseRequest = { inputData: '', expectedOutput: '', isHidden: false };

export type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (draft: TaskFormValues) => void | Promise<void>;
  modalTitle: string;
  submitLabel: string;
  showSubmitIcon?: boolean;
  mode?: 'create' | 'edit';
  initialValues?: TaskFormValues | null;
  isSubmitting?: boolean;
};

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  modalTitle,
  submitLabel,
  showSubmitIcon = true,
  mode = 'create',
  initialValues = null,
  isSubmitting = false,
}: CreateTaskModalProps) {
  const [section, setSection] = useState<string>(SECTIONS[0]);
  const [name, setName] = useState('');
  const [lang, setLang] = useState<TaskLanguage>('Java');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Medium');
  const [time, setTime] = useState('2000');
  const [memory, setMemory] = useState('256');
  const [deadlineLocal, setDeadlineLocal] = useState(defaultDeadlineLocalInput());
  const [maxAttempts, setMaxAttempts] = useState('3');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState<TestCaseRequest[]>([{ ...EMPTY_TEST_CASE }]);
  const [assignmentMode, setAssignmentMode] = useState<TaskAssignmentMode>('all');
  const [assignedGroupId, setAssignedGroupId] = useState<number | ''>('');
  const [assignedStudentId, setAssignedStudentId] = useState<number | ''>('');
  const [groups, setGroups] = useState<TeacherGroup[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    void getTeacherGroups()
      .then((res) => setGroups(res.groups))
      .catch(() => setGroups([]));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialValues) {
      setSection(initialValues.section || SECTIONS[0]);
      setName(initialValues.name);
      setLang(initialValues.lang);
      setDifficulty(initialValues.difficulty);
      setTime(String(initialValues.time));
      setMemory(String(initialValues.memory));
      setDeadlineLocal(initialValues.deadlineLocal || apiDateTimeToLocalInput(null));
      setMaxAttempts(String(initialValues.maxAttempts ?? 3));
      setDescription(initialValues.description);
      setTestCases(
        initialValues.testCases.length > 0
          ? initialValues.testCases.map((tc) => ({ ...tc }))
          : [{ ...EMPTY_TEST_CASE }],
      );
      setAssignmentMode(initialValues.assignmentMode ?? 'all');
      setAssignedGroupId(initialValues.assignedGroupId ?? '');
      setAssignedStudentId(initialValues.assignedStudentId ?? '');
      return;
    }

    setSection(SECTIONS[0]);
    setName('');
    setLang('Java');
    setDifficulty('Medium');
    setTime('2000');
    setMemory('256');
    setDeadlineLocal(defaultDeadlineLocalInput());
    setMaxAttempts('3');
    setDescription('');
    setTestCases([{ ...EMPTY_TEST_CASE }]);
    setAssignmentMode('all');
    setAssignedGroupId('');
    setAssignedStudentId('');
  }, [isOpen, initialValues]);

  const studentsInSelectedGroup = useMemo(() => {
    if (assignedGroupId === '') return [];
    return groups.find((g) => g.id === assignedGroupId)?.students ?? [];
  }, [assignedGroupId, groups]);

  const timeNum = Number.parseInt(time, 10);
  const memoryNum = Number.parseInt(memory, 10);
  const maxAttemptsNum = Number.parseInt(maxAttempts, 10);

  const validTestCases = testCases.filter(
    (tc) => tc.inputData.trim().length > 0 && tc.expectedOutput.trim().length > 0,
  );

  const assignmentValid =
    assignmentMode === 'all' ||
    (assignmentMode === 'group' && assignedGroupId !== '') ||
    (assignmentMode === 'student' && assignedStudentId !== '');

  const canSubmit =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    deadlineLocal.length > 0 &&
    validTestCases.length > 0 &&
    Number.isFinite(timeNum) &&
    timeNum > 0 &&
    Number.isFinite(memoryNum) &&
    memoryNum > 0 &&
    Number.isFinite(maxAttemptsNum) &&
    maxAttemptsNum > 0 &&
    assignmentValid;

  const updateTestCase = (index: number, patch: Partial<TestCaseRequest>) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, ...patch } : tc)),
    );
  };

  const addTestCase = () => {
    setTestCases((prev) => [...prev, { ...EMPTY_TEST_CASE }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    void onSubmit({
      name: name.trim(),
      description: description.trim(),
      section: section.trim() || SECTIONS[0],
      lang,
      difficulty,
      time: timeNum,
      memory: memoryNum,
      deadlineLocal,
      maxAttempts: maxAttemptsNum,
      testCases: validTestCases.map((tc) => ({
        inputData: tc.inputData.trim(),
        expectedOutput: tc.expectedOutput.trim(),
        isHidden: Boolean(tc.isHidden),
      })),
      assignmentMode,
      assignedGroupId: assignedGroupId === '' ? null : assignedGroupId,
      assignedStudentId: assignedStudentId === '' ? null : assignedStudentId,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="w-[600px] max-w-full">
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
          className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 disabled:opacity-60"
          disabled={mode === 'edit'}
          placeholder="Краткое название"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {mode === 'edit' && (
          <p className="text-xs text-slate-500 mt-1">Название нельзя изменить после создания.</p>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="mb-1">
              <span className="text-s text-slate-300">Дедлайн сдачи</span>
            </div>
            <input
              className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
              type="datetime-local"
              value={deadlineLocal}
              onChange={(e) => setDeadlineLocal(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1">
              <span className="text-s text-slate-300">Макс. попыток</span>
            </div>
            <input
              className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20"
              min={1}
              type="number"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
            />
          </div>
        </div>

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
              <span className="text-s text-slate-300">Лимит времени на решение (мс)</span>
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

        <div className="mt-8 flex items-center justify-between gap-3">
          <span className="text-s text-slate-300">Тест-кейсы (обязателен минимум один)</span>
          <button
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold"
            type="button"
            onClick={addTestCase}
          >
            <Plus className="size-4" />
            Добавить тест
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {testCases.map((tc, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-700/80 bg-background-dark/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Тест #{index + 1}
                </span>
                {testCases.length > 1 && (
                  <button
                    aria-label="Удалить тест"
                    className="text-slate-500 hover:text-rose-400"
                    type="button"
                    onClick={() => removeTestCase(index)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <textarea
                className="w-full min-h-[72px] resize-y bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5"
                placeholder="Входные данные (Input)"
                value={tc.inputData}
                onChange={(e) => updateTestCase(index, { inputData: e.target.value })}
              />
              <textarea
                className="w-full min-h-[72px] resize-y bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5"
                placeholder="Ожидаемый результат (Expected Output)"
                value={tc.expectedOutput}
                onChange={(e) => updateTestCase(index, { expectedOutput: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input
                  checked={tc.isHidden}
                  type="checkbox"
                  onChange={(e) => updateTestCase(index, { isHidden: e.target.checked })}
                />
                Скрытый тест (не показывать студенту)
              </label>
            </div>
          ))}
        </div>

        <div className="mt-8 mb-1">
          <span className="text-s text-slate-300">Кому назначить задачу</span>
        </div>
        <select
          className="w-full bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
          value={assignmentMode}
          onChange={(e) => {
            const next = e.target.value as TaskAssignmentMode;
            setAssignmentMode(next);
            if (next !== 'group') setAssignedGroupId('');
            if (next !== 'student') setAssignedStudentId('');
          }}
        >
          <option value="all">Всем студентам</option>
          <option value="group">Группе</option>
          <option value="student">Конкретному студенту</option>
        </select>

        {assignmentMode === 'group' && (
          <select
            className="w-full mt-3 bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
            value={assignedGroupId}
            onChange={(e) => {
              setAssignedGroupId(e.target.value ? Number(e.target.value) : '');
              setAssignedStudentId('');
            }}
          >
            <option value="">Выберите группу</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}

        {assignmentMode === 'student' && (
          <>
            <select
              className="w-full mt-3 bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
              value={assignedGroupId}
              onChange={(e) => {
                setAssignedGroupId(e.target.value ? Number(e.target.value) : '');
                setAssignedStudentId('');
              }}
            >
              <option value="">Сначала выберите группу</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <select
              className="w-full mt-3 bg-background-dark text-slate-300 font-medium border border-gray-700 rounded-xl px-3 py-2.5 shadow-lg shadow-black/20 cursor-pointer"
              value={assignedStudentId}
              onChange={(e) => setAssignedStudentId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Выберите студента</option>
              {studentsInSelectedGroup.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.email})
                </option>
              ))}
            </select>
          </>
        )}

        {groups.length === 0 && assignmentMode !== 'all' && (
          <p className="text-xs text-amber-400/90 mt-2">
            У вас пока нет групп в системе. Создайте группу на странице «Группы» или назначьте задачу всем студентам.
          </p>
        )}

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
            disabled={!canSubmit || isSubmitting}
            type="button"
            onClick={handleSubmit}
          >
            {showSubmitIcon ? <RocketIcon className="text-white" /> : null}
            {isSubmitting ? 'Сохранение...' : submitLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
