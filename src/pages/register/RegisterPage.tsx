import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { RegisterSuccessModal } from './RegisterSuccessModal';
import { StudentRegisterForm } from './StudentRegisterForm';
import { TeacherRegisterForm } from './TeacherRegisterForm';

type RegisterRole = 'student' | 'teacher';

const MIN_HEIGHT_EASE = 'min-height 0.28s cubic-bezier(0.4, 0, 0.2, 1)';

export function RegisterPage() {
  const [role, setRole] = useState<RegisterRole>('student');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureCount = useRef(0);

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    document.title =
      role === 'teacher'
        ? 'Регистрация Преподавателя | Educational Platform'
        : 'Регистрация | Programming Platform';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, [role]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const next = Math.ceil(entry.contentRect.height);
      if (next < 1) return;
      measureCount.current += 1;
      setPanelHeight(next);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [role]);

  const panelStyle =
    panelHeight === null
      ? undefined
      : {
          minHeight: panelHeight,
          transition:
            reduceMotion || measureCount.current <= 1 ? 'none' : MIN_HEIGHT_EASE,
        };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col items-center justify-center bg-background-light p-4 py-12 font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <main className="flex w-full min-w-0 max-w-md flex-col">
        <div className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Регистрация</h1>
            <p className="mx-auto min-h-[3rem] max-w-sm text-sm leading-snug text-slate-500 dark:text-slate-400">
              {role === 'teacher'
                ? 'Создайте аккаунт преподавателя для доступа к платформе'
                : 'Начните свой путь в программировании'}
            </p>
          </div>

          <div className="mb-8 flex border-b border-slate-200 dark:border-border-dark">
            <button
              aria-current={role === 'student' ? 'page' : undefined}
              className={`flex-1 border-b-2 py-3 text-sm font-bold transition-colors ${
                role === 'student'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              type="button"
              onClick={() => setRole('student')}
            >
              Студент
            </button>
            <button
              aria-current={role === 'teacher' ? 'page' : undefined}
              className={`flex-1 border-b-2 py-3 text-sm font-bold transition-colors ${
                role === 'teacher'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              type="button"
              onClick={() => setRole('teacher')}
            >
              Преподаватель
            </button>
          </div>

          <div className="w-full min-w-0 overflow-hidden" style={panelStyle}>
            <div ref={contentRef} className="w-full min-w-0">
              {role === 'student' ? (
                <StudentRegisterForm onSuccess={() => setSuccessModalOpen(true)} />
              ) : (
                <TeacherRegisterForm onSuccess={() => setSuccessModalOpen(true)} />
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Уже есть аккаунт?{' '}
              <Link className="ml-1 font-semibold text-primary hover:underline" to="/login">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </main>

      <RegisterSuccessModal open={successModalOpen} onOpenChange={setSuccessModalOpen} />
    </div>
  );
}
