// src/pages/login/LoginPage.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { loginUser } from '@/shared/api/auth';
import { useAuthStore } from '@/store/authStore';
import { type LoginFormValues, loginSchema } from './login.schema';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const loginAction = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      const response = await loginUser({ email: data.email, password: data.password });
      
      loginAction(response.accessToken, response.user);
      
      if (response.user.role === 'STUDENT') navigate('/student');
      else if (response.user.role === 'TEACHER') navigate('/teacher');
      else if (response.user.role === 'ADMIN') navigate('/admin');
      else navigate('/');
      
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        setAuthError('Неверный email или пароль');
      } else {
        setAuthError('Ошибка подключения к серверу');
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 font-display dark:bg-background-dark">
      <div className="w-full max-w-[440px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-border-dark dark:bg-card-dark">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Авторизация</h1>
            <p className="text-sm text-slate-600 dark:text-text-secondary">Введите свои данные для входа в аккаунт</p>
          </div>

          <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
                {authError}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-slate-100 dark:placeholder:text-text-secondary/50"
                placeholder="you@example.com"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400" role="alert">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="login-password">
                  Пароль
                </label>
                <Link className="text-xs text-primary hover:underline" to="/forgot-password">Забыли пароль?</Link>
              </div>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-12 pl-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-slate-100 dark:placeholder:text-text-secondary/50"
                  placeholder="Введите ваш пароль"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <button
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  className="absolute right-3 text-slate-400 transition-colors hover:text-primary dark:text-text-secondary"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff aria-hidden className="size-[22px]" strokeWidth={1.75} /> : <Eye aria-hidden className="size-[22px]" strokeWidth={1.75} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400" role="alert">{errors.password.message}</p>
              )}
            </div>

            <button
              className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-base font-bold text-background-dark transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              Войти
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-border-dark">
            <p className="text-sm text-slate-600 dark:text-text-secondary">
              Нет аккаунта? <Link className="ml-1 font-medium text-primary hover:underline" to="/register">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}