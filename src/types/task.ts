export type TaskLanguage = 'JavaScript' | 'Java' | 'Python';

export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';

export type StudentTaskStatus = 'SOLVED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'FAILED';

/** Задача в каталоге (студент / преподаватель / админ). */
export type Task = {
  id: number;
  isDone: boolean;
  studentStatus?: StudentTaskStatus;
  name: string;
  description: string;
  difficulty: TaskDifficulty;
  lang: TaskLanguage;
  /** Лимит времени, мс */
  time: number;
  /** Лимит памяти, МБ */
  memory: number;
  /** Раздел каталога */
  section: string;
};

/** Данные формы создания (id и isDone выставляет хранилище / страница). */
export type TaskDraft = Omit<Task, 'id' | 'isDone'>;
