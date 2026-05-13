import { ChevronLeft, ChevronRight, Search, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAdminPlatformStore } from '@/store/adminPlatformStore';

import { AdminCustomSelect } from './AdminCustomSelect';
import type { AdminUserRow } from './adminUsersTypes';

const PAGE_SIZE_OPTIONS = [4, 8, 12, 20, 50] as const;

type StatusFilter = 'all' | 'active' | 'blocked';

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'active', label: 'Активен' },
  { value: 'blocked', label: 'Заблокирован' },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

type Props = {
  /** Какой раздел открыт: студенты или преподаватели (от URL) */
  variant: 'students' | 'teachers';
};

export function AdminUserManagementPage({ variant }: Props) {
  const location = useLocation();
  const rows = useAdminPlatformStore((s) => s.users);
  const toggleUserBlock = useAdminPlatformStore((s) => s.toggleUserBlock);
  const removeUser = useAdminPlatformStore((s) => s.removeUser);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(4);
  const [page, setPage] = useState(0);

  const roleFilter: AdminUserRow['role'] = variant === 'students' ? 'STUDENT' : 'TEACHER';

  const sectionTitle = variant === 'students' ? 'Студенты' : 'Преподаватели';

  useEffect(() => {
    document.title = `${sectionTitle} | EduCode`;
    return () => {
      document.title = 'Панель Администратора | EduCode';
    };
  }, [sectionTitle]);

  useEffect(() => {
    setPage(0);
  }, [variant, search, statusFilter, pageSize]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((u) => {
      if (u.role !== roleFilter) return false;
      if (statusFilter === 'active' && u.blocked) return false;
      if (statusFilter === 'blocked' && !u.blocked) return false;
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [rows, roleFilter, search, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleBlock = (id: string) => {
    toggleUserBlock(id);
  };

  const handleDeleteUser = (u: AdminUserRow) => {
    if (!window.confirm(`Удалить пользователя «${u.fullName}» из системы?`)) return;
    removeUser(u.id);
  };

  const tabClass = (to: string) =>
    `flex flex-1 items-center justify-center border-b-2 py-3 text-sm font-bold transition-colors ${
      location.pathname === to
        ? 'border-primary text-primary'
        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  return (
    <main className="flex flex-1 justify-center overflow-y-auto px-6 py-8 lg:px-10">
      <div className="layout-content-container flex max-w-[1200px] flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-400">Главная / {sectionTitle}</p>
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-100">
            Управление пользователями
          </h1>
          <p className="text-sm text-slate-400">
            Просмотр, фильтрация и управление учётными записями образовательной платформы.
          </p>
        </div>

        <div className="mb-2 flex border-b border-border-color dark:border-border-dark">
          <NavLink className={tabClass('/admin/students')} to="/admin/students">
            Студенты
          </NavLink>
          <NavLink className={tabClass('/admin/teachers')} to="/admin/teachers">
            Преподаватели
          </NavLink>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-4 rounded-lg border border-border-color bg-surface p-4 lg:flex-row lg:items-center lg:gap-4 dark:border-border-dark">
          <div className="relative min-w-0 w-full lg:max-w-md lg:flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search aria-hidden className="size-5" strokeWidth={1.75} />
            </div>
            <input
              className="block h-11 w-full rounded-lg border border-border-color bg-surface pr-3 pl-10 text-sm text-slate-100 shadow-md shadow-black/25 placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none dark:border-border-dark"
              placeholder="Поиск по имени или email..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:w-auto lg:min-w-0 lg:gap-4">
            <div className="w-full min-w-[12rem] sm:w-48 sm:shrink-0">
              <AdminCustomSelect<StatusFilter>
                ariaLabel="Фильтр по статусу"
                id="admin-user-status"
                options={STATUS_FILTER_OPTIONS}
                size="md"
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
            <button
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-background-dark transition-colors hover:bg-primary/90"
              type="button"
            >
              <UserPlus aria-hidden className="size-5" strokeWidth={1.75} />
              Добавить
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border-color bg-surface dark:border-border-dark">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border-color bg-background-dark/50 dark:border-border-dark">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Имя
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Роль
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color dark:divide-border-dark">
                {total === 0 && (
                  <tr>
                    <td className="px-6 py-10 text-center text-sm text-slate-500" colSpan={4}>
                      Нет пользователей по заданным условиям.
                    </td>
                  </tr>
                )}
                {pageSlice.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-color bg-slate-800 dark:border-border-dark ${
                            u.blocked ? 'opacity-60' : ''
                          }`}
                        >
                          {u.avatarUrl ? (
                            <img
                              alt=""
                              className="size-full object-cover"
                              src={u.avatarUrl}
                            />
                          ) : (
                            <span className="text-xs font-semibold text-slate-300">
                              {initials(u.fullName)}
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="text-sm font-semibold text-slate-100">{u.fullName}</span>
                          <span className="truncate text-xs text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.role === 'STUDENT' ? (
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Студент
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400">
                          Преподаватель
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            u.blocked ? 'bg-status-red' : 'bg-status-green'
                          }`}
                        />
                        <span className="text-sm text-slate-300">
                          {u.blocked ? 'Заблокирован' : 'Активен'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-2">
                        {u.blocked ? (
                          <button
                            className="inline-flex h-12 w-52 shrink-0 items-center justify-center rounded-lg border border-primary px-4 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-background-dark"
                            type="button"
                            onClick={() => toggleBlock(u.id)}
                          >
                            Разблокировать
                          </button>
                        ) : (
                          <button
                            className="inline-flex h-12 w-52 shrink-0 items-center justify-center rounded-lg border border-status-red px-4 text-sm font-bold text-status-red transition-colors hover:bg-status-red hover:text-white"
                            type="button"
                            onClick={() => toggleBlock(u.id)}
                          >
                            Заблокировать
                          </button>
                        )}
                        <button
                          className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-status-red hover:underline"
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                        >
                          Удалить из системы
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 rounded-b-lg border-t border-border-color bg-background-dark/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-border-dark">
            <span className="text-xs text-slate-500">
              {total === 0
                ? 'Нет записей для отображения'
                : `Показано ${safePage * pageSize + 1}–${Math.min((safePage + 1) * pageSize, total)} из ${total} ${variant === 'students' ? 'студентов' : 'преподавателей'}`}
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="w-[3.25rem] shrink-0">
                <AdminCustomSelect
                  ariaLabel="Записей на странице"
                  id="admin-pagination-page-size"
                  options={PAGE_SIZE_OPTIONS.map((n) => ({
                    value: n,
                    label: String(n),
                  }))}
                  size="sm"
                  value={pageSize}
                  onChange={(v) => setPageSize(v)}
                />
              </div>
              <button
                aria-label="Предыдущая страница"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded border border-border-color text-slate-400 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark"
                disabled={safePage <= 0}
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft aria-hidden className="size-4" />
              </button>
              <button
                aria-label="Следующая страница"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded border border-border-color text-slate-400 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark"
                disabled={safePage >= pageCount - 1}
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                <ChevronRight aria-hidden className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
