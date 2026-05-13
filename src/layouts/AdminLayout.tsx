import {
  Bell,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Terminal,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { LogoutConfirmModal } from '@/components/LogoutConfirmModal';
import { useAuthStore } from '@/store/authStore';

function sidebarLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-slate-400 hover:bg-background-dark hover:text-slate-100'
  }`;
}

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const fullName = useAuthStore((s) => s.user?.fullName ?? '');

  const closeMobile = () => setMobileNavOpen(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
    navigate('/login');
  };

  const NavItems = (
    <>
      <NavLink className={sidebarLinkClass} end to="/admin" onClick={closeMobile}>
        <LayoutDashboard aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
        Дашборд
      </NavLink>
      <NavLink className={sidebarLinkClass} to="/admin/profile" onClick={closeMobile}>
        <User aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
        Профиль
      </NavLink>
      <NavLink className={sidebarLinkClass} to="/admin/students" onClick={closeMobile}>
        <GraduationCap aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
        Студенты
      </NavLink>
      <NavLink className={sidebarLinkClass} to="/admin/teachers" onClick={closeMobile}>
        <Users aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
        Преподаватели
      </NavLink>
      <NavLink className={sidebarLinkClass} to="/admin/tasks" onClick={closeMobile}>
        <ClipboardList aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
        Задачи
      </NavLink>
    </>
  );

  return (
    <div className="admin-layout-print-root relative flex min-h-dvh w-full overflow-hidden bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100">
      {mobileNavOpen && (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          type="button"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col gap-2 border-r border-border-color bg-surface p-4 transition-transform duration-200 ease-out md:static md:z-20 md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-3 px-3 py-4 text-primary md:block">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Terminal aria-hidden className="size-[20px] text-primary" strokeWidth={2} />
            </div>
            <h2 className="text-lg leading-tight font-bold tracking-tight text-slate-100">
              EduCode
            </h2>
          </div>
          <button
            aria-label="Закрыть"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
            type="button"
            onClick={closeMobile}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-3 py-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
          Меню
        </div>
        <nav className="flex flex-col gap-1">{NavItems}</nav>
        <button
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#8b949e] transition-all hover:bg-red-500/10 hover:text-status-red"
          type="button"
          onClick={() => {
            closeMobile();
            setLogoutOpen(true);
          }}
        >
          <LogOut aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
          Выйти
        </button>
      </aside>

      <div className="admin-layout-print-main flex min-h-0 min-w-0 flex-1 flex-col md:h-dvh">
        <header className="flex shrink-0 items-center justify-between border-b border-border-color bg-surface px-6 py-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-4 md:gap-8">
            <button
              aria-label="Открыть меню"
              className="shrink-0 rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
              type="button"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="size-6" />
            </button>
            <h2 className="truncate text-lg leading-tight font-bold tracking-tight text-slate-100">
              Панель Администратора
            </h2>
            <label className="relative hidden min-h-10 min-w-64 flex-col md:flex">
              <span className="sr-only">Поиск по системе</span>
              <div className="flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-border-color bg-background-dark focus-within:border-primary">
                <span className="flex items-center justify-center pl-3 text-slate-400">
                  <Search aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent pr-3 pl-2 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-0"
                  placeholder="Поиск по системе..."
                  type="search"
                />
              </div>
            </label>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden gap-2 sm:flex">
              <button
                aria-label="Уведомления"
                className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border-color bg-background-dark text-slate-400 transition-colors hover:text-primary"
                type="button"
              >
                <Bell aria-hidden className="size-5" strokeWidth={1.75} />
              </button>
              <button
                aria-label="Настройки"
                className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border-color bg-background-dark text-slate-400 transition-colors hover:text-primary"
                type="button"
              >
                <Settings aria-hidden className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="mx-1 hidden h-8 w-px bg-border-color sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-slate-100">
                  {fullName || 'Администратор'}
                </span>
                <span className="text-xs text-slate-500">Super Admin</span>
              </div>
              <NavLink
                to="/admin/profile"
                className="rounded-full border border-primary/50 bg-primary/20 p-0.5 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                aria-label="Профиль"
              >
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-full border-2 border-surface bg-slate-800 text-slate-400"
                >
                  <Users className="size-5" strokeWidth={1.5} />
                </span>
              </NavLink>
            </div>
          </div>
        </header>

        <div className="admin-layout-print-outlet min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <LogoutConfirmModal
        open={logoutOpen}
        onConfirm={handleLogout}
        onOpenChange={setLogoutOpen}
      />
    </div>
  );
}
