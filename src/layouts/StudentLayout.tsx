import { LayoutDashboard, ListTodo, LogOut, Menu, Terminal, User, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { LogoutConfirmModal } from '@/components/LogoutConfirmModal';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/shallow';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
    isActive ? 'bg-primary/10 font-medium text-primary' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
  }`;
}

export function StudentLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const [logout, fullName] = useAuthStore(useShallow((state) => [state.logout, state.fullName]));

  const closeMobile = () => setMobileNavOpen(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
    navigate('/login');
  };

  const NavItems = (
    <>
      <NavLink className={navLinkClass} end to="/student" onClick={closeMobile}>
        <LayoutDashboard aria-hidden className="size-[22px]" strokeWidth={1.75} />
        Главный экран
      </NavLink>
      <NavLink className={navLinkClass} to="/student/profile" onClick={closeMobile}>
        <User aria-hidden className="size-[22px]" strokeWidth={1.75} />
        Профиль
      </NavLink>
      <NavLink className={navLinkClass} to="/student/tasks" onClick={closeMobile}>
        <ListTodo aria-hidden className="size-[22px]" strokeWidth={1.75} />
        Задачи
      </NavLink>
    </>
  );

  return (
    <div className="min-h-dvh w-full bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100 md:flex md:h-dvh md:overflow-hidden">
      {mobileNavOpen && (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          type="button"
          onClick={closeMobile}
        />
      )}

      {/* Сайдбар: на всю высоту окна, не прокручивается с контентом (desktop); на мобиле — выезжающая панель */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col border-r border-border-color bg-surface transition-transform duration-200 ease-out md:z-30 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex shrink-0 items-center justify-between p-6 md:block">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-primary text-background-dark">
              <Terminal aria-hidden className="size-[20px]" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight">EduCode</span>
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
        <nav className="flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto px-4 py-4 md:overflow-y-visible md:overflow-visible">
          {NavItems}
        </nav>
        <div className="mt-auto shrink-0 border-t border-border-color p-4">
          <button
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition-colors hover:text-red-400"
            type="button"
            onClick={() => {
              closeMobile();
              setLogoutOpen(true);
            }}
          >
            <LogOut aria-hidden className="size-[22px]" strokeWidth={1.75} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Основная колонка: на desktop только она прокручивается */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col md:ml-64 md:h-dvh md:min-h-0 md:overflow-hidden">
        <header className="sticky top-0 z-30 w-full shrink-0 border-b border-border-color bg-surface/80 backdrop-blur-md md:z-20">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                aria-label="Открыть меню"
                className="rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
                type="button"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="size-6" />
              </button>
              <div className="flex items-center gap-3 md:hidden">
                <div className="flex size-8 items-center justify-center rounded bg-primary text-background-dark">
                  <Terminal aria-hidden className="size-[20px]" strokeWidth={2} />
                </div>
                <span className="text-xl font-bold tracking-tight">EduCode</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">Привет, {fullName}!</p>
                <p className="text-xs text-slate-400">С возвращением</p>
              </div>
              <div className="relative cursor-pointer">
                <div
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-full border-2 border-primary/30 bg-surface text-slate-400"
                >
                  <User className="size-5" strokeWidth={1.5} />
                </div>
                <div className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background-dark bg-green-500" />
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto md:overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <LogoutConfirmModal open={logoutOpen} onConfirm={handleLogout} onOpenChange={setLogoutOpen} />
    </div>
  );
}
