import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { verifyEmailToken } from '@/shared/api/register';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const hasToken = token.length > 0;

  const [state, setState] = useState<'loading' | 'ok' | 'err'>(() =>
    hasToken ? 'loading' : 'err',
  );
  const [message, setMessage] = useState(() =>
    hasToken ? '' : 'В ссылке нет кода подтверждения.',
  );

  useEffect(() => {
    if (!hasToken) return;

    let cancelled = false;

    verifyEmailToken(token)
      .then(() => {
        if (!cancelled) {
          setState('ok');
          setMessage('Email успешно подтверждён. Теперь можно войти.');
        }
      })
      .catch((e) => {
        if (cancelled) return;
        const msg =
          axios.isAxiosError(e) && e.response?.data && typeof e.response.data === 'object'
            ? String((e.response.data as { error?: string }).error ?? e.message)
            : 'Не удалось подтвердить email. Запустите сервер API или откройте ссылку снова.';
        setState('err');
        setMessage(msg);
      });

    return () => {
      cancelled = true;
    };
  }, [hasToken, token]);

  useEffect(() => {
    document.title = 'Подтверждение email | Programming Platform';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl dark:border-border-dark dark:bg-surface-dark">
        <h1 className="mb-4 text-center text-xl font-semibold text-slate-900 dark:text-slate-100">
          Подтверждение email
        </h1>
        {state === 'loading' && (
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">Проверяем ссылку…</p>
        )}
        {state === 'ok' && (
          <p className="text-center text-sm text-slate-700 dark:text-slate-300">{message}</p>
        )}
        {state === 'err' && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">{message}</p>
        )}
        <div className="mt-8 text-center">
          <Link className="text-sm font-medium text-primary hover:underline" to="/login">
            На страницу входа
          </Link>
        </div>
      </div>
    </div>
  );
}
