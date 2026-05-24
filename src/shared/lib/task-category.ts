export const TASK_SECTIONS = ['Алгоритмы', 'Текстовые', 'Логические'] as const;
export type TaskSection = (typeof TASK_SECTIONS)[number];

export type TaskCategoryApi = 'ALGORITHMS' | 'TEXT' | 'LOGICAL';

export function sectionToCategory(section: string): TaskCategoryApi {
  switch (section) {
    case 'Текстовые':
      return 'TEXT';
    case 'Логические':
      return 'LOGICAL';
    default:
      return 'ALGORITHMS';
  }
}

export function categoryToSection(category?: string | null): TaskSection {
  switch (category) {
    case 'TEXT':
      return 'Текстовые';
    case 'LOGICAL':
      return 'Логические';
    default:
      return 'Алгоритмы';
  }
}

export type StudentTaskStatus = 'SOLVED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'FAILED';

export function studentStatusLabel(status: StudentTaskStatus | string | undefined): string {
  switch (status) {
    case 'SOLVED':
      return 'Решено';
    case 'IN_PROGRESS':
      return 'В работе';
    case 'FAILED':
      return 'Не сдано';
    case 'NOT_STARTED':
    default:
      return 'Не решено';
  }
}
