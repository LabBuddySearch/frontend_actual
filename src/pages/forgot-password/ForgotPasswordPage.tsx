import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { requestPasswordReset } from '@/shared/api/auth';
import { type ForgotPasswordFormValues, forgotPasswordSchema } from './forgot-password.schema';

export function ForgotPasswordPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    document.title = 'Восстановление пароля | Programming Platform';
    return () => {
      document.title = 'Вход | Programming Education';
    };
  }, []);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setSubmitError(null);
    try {
      await requestPasswordReset({ email: data.email });
      setDone(true);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        setSubmitError('Сервис временно недоступен. Попробуйте позже.');
        return;
      }
      if (axios.isAxiosError(e) && e.response?.data && typeof e.response.data === 'object') {
        const msg = (e.response.data as { error?: string; message?: string }).error
          ?? (e.response.data as { message?: string }).message;
        if (msg) {
          setSubmitError(msg);
          return;
        }
      }
      setSubmitError('Не удалось отправить запрос. Проверьте подключение и попробуйте снова.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 font-display dark:bg-background-dark">
      <div className="w-full max-w-[440px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-border-dark dark:bg-card-dark">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Восстановление пароля
            </h1>
            <p className="text-sm text-slate-600 dark:text-text-secondary">
              Укажите email от аккаунта — мы отправим ссылку для сброса пароля
            </p>
          </div>

          {done ? (
            <div className="space-y-6">
              <p
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300"
                role="status"
              >
                Если этот адрес зарегистрирован в системе, на почту придёт письмо с инструкцией по
                восстановлению пароля.
              </p>
              <Link
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-base font-bold text-background-dark transition-all hover:opacity-90 active:scale-[0.98]"
                to="/login"
              >
                На страницу входа
              </Link>
            </div>
          ) : (
            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
              {submitError && (
                <p
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {submitError}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  htmlFor="forgot-email"
                >
                  Email
                </label>
                <input
                  id="forgot-email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-slate-100 dark:placeholder:text-text-secondary/50"
                  placeholder="you@example.com"
                  type="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-base font-bold text-background-dark transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                Отправить ссылку
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-border-dark">
            <p className="text-sm text-slate-600 dark:text-text-secondary">
              Вспомнили пароль?{' '}
              <Link className="ml-1 font-medium text-primary hover:underline" to="/login">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
