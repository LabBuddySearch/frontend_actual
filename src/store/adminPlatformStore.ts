import { create } from 'zustand';

import { ADMIN_USERS_MOCK } from '@/pages/admin/adminUsersMock';
import type { AdminUserRow } from '@/pages/admin/adminUsersTypes';
import type { Task, TaskDraft } from '@/types/task';

export type TeacherApplication = {
  id: string;
  fullName: string;
  email: string;
  stack: string;
};

export type AdminActivityEntry = {
  id: string;
  text: string;
  createdAt: number;
};

const INITIAL_APPLICATIONS: TeacherApplication[] = [
  {
    id: 'app-1',
    fullName: 'Ivan Ivanov',
    email: 'ivan.ivanov.pending@example.com',
    stack: 'Стек: Python, Django, React',
  },
  {
    id: 'app-2',
    fullName: 'Anna Petrova',
    email: 'anna.petrova.pending@example.com',
    stack: 'Стек: Java, Spring Boot, MySQL',
  },
  {
    id: 'app-3',
    fullName: 'Dmitry Sokolov',
    email: 'dmitry.sokolov.pending@example.com',
    stack: 'Стек: JavaScript, Node.js, Express',
  },
];

function initialTasks(): Task[] {
  const seed: { name: string; description: string }[] = [
    { name: 'Двусвязный список: Базовые операции', description: 'Реализуйте методы вставки и удаления узлов' },
    { name: 'Бинарный поиск в массиве', description: 'Классический поиск элемента за O(log n)' },
    { name: 'Сортировка пузырьком', description: 'Простейший алгоритм сортировки' },
    { name: 'Кратчайший путь: Алгоритм Дейкстры', description: 'Поиск пути в графе с весами' },
    { name: 'Обход дерева в ширину (BFS)', description: 'Использование очереди для обхода структуры' },
    { name: 'Решето Эратосфена', description: 'Поиск простых чисел до заданного N' },
  ];
  const langs: Task['lang'][] = ['Java', 'Python', 'JavaScript'];
  const diffs: Task['difficulty'][] = ['Medium', 'Easy', 'Hard'];
  const memories = [256, 256, 128, 512, 256, 256] as const;
  const out: Task[] = [];
  for (let i = 0; i < 45; i++) {
    const s = seed[i % seed.length]!;
    out.push({
      id: i + 1,
      isDone: false,
      name: s.name,
      description: s.description,
      section: 'Алгоритмы',
      lang: langs[i % langs.length]!,
      difficulty: diffs[i % diffs.length]!,
      time: 800 + (i % 5) * 200,
      memory: memories[i % memories.length]!,
    });
  }
  return out;
}

function newLogId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function pushLog(entries: AdminActivityEntry[], text: string, max = 80): AdminActivityEntry[] {
  return [{ id: newLogId(), text, createdAt: Date.now() }, ...entries].slice(0, max);
}

type AdminPlatformState = {
  users: AdminUserRow[];
  teacherApplications: TeacherApplication[];
  tasks: Task[];
  activityLog: AdminActivityEntry[];
  toggleUserBlock: (id: string) => void;
  removeUser: (id: string) => void;
  approveTeacherApplication: (applicationId: string) => void;
  rejectTeacherApplication: (applicationId: string) => void;
  addTask: (draft: TaskDraft) => void;
  removeTask: (taskId: number) => void;
};

export const useAdminPlatformStore = create<AdminPlatformState>((set) => ({
  users: [...ADMIN_USERS_MOCK],
  teacherApplications: [...INITIAL_APPLICATIONS],
  tasks: initialTasks(),
  activityLog: [],

  toggleUserBlock: (id) =>
    set((s) => {
      const u = s.users.find((x) => x.id === id);
      if (!u) return s;
      const blocked = !u.blocked;
      const text = blocked
        ? `Пользователь «${u.fullName}» заблокирован`
        : `Пользователь «${u.fullName}» разблокирован`;
      return {
        users: s.users.map((row) => (row.id === id ? { ...row, blocked } : row)),
        activityLog: pushLog(s.activityLog, text),
      };
    }),

  removeUser: (id) =>
    set((s) => {
      const u = s.users.find((x) => x.id === id);
      if (!u) return s;
      return {
        users: s.users.filter((x) => x.id !== id),
        activityLog: pushLog(s.activityLog, `Пользователь «${u.fullName}» удалён из системы`),
      };
    }),

  approveTeacherApplication: (applicationId) =>
    set((s) => {
      const app = s.teacherApplications.find((a) => a.id === applicationId);
      if (!app) return s;
      const newTeacher: AdminUserRow = {
        id: `tchr-${newLogId()}`,
        fullName: app.fullName,
        email: app.email.replace('.pending@', '@') || app.email,
        role: 'TEACHER',
        blocked: false,
      };
      return {
        teacherApplications: s.teacherApplications.filter((a) => a.id !== applicationId),
        users: [...s.users, newTeacher],
        activityLog: pushLog(
          s.activityLog,
          `Заявка преподавателя «${app.fullName}» одобрена, добавлен в список преподавателей`,
        ),
      };
    }),

  rejectTeacherApplication: (applicationId) =>
    set((s) => {
      const app = s.teacherApplications.find((a) => a.id === applicationId);
      if (!app) return s;
      return {
        teacherApplications: s.teacherApplications.filter((a) => a.id !== applicationId),
        activityLog: pushLog(s.activityLog, `Заявка преподавателя «${app.fullName}» отклонена`),
      };
    }),

  addTask: (draft) => {
    const name = draft.name.trim();
    const description = draft.description.trim();
    if (!name || !description || draft.time < 1 || draft.memory < 1) return;
    set((s) => {
      const nextId = s.tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
      const row: Task = {
        ...draft,
        name,
        description,
        id: nextId,
        isDone: false,
      };
      return {
        tasks: [...s.tasks, row],
        activityLog: pushLog(s.activityLog, `Добавлена задача «${name}»`),
      };
    });
  },

  removeTask: (taskId) =>
    set((s) => {
      const t = s.tasks.find((x) => x.id === taskId);
      if (!t) return s;
      return {
        tasks: s.tasks.filter((x) => x.id !== taskId),
        activityLog: pushLog(s.activityLog, `Удалена задача «${t.name}»`),
      };
    }),
}));
