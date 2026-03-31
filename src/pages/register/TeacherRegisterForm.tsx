import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, KeyRound, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { postTeacherRegister } from '@/shared/api/register';

import {
  type TeacherRegisterFormValues,
  teacherRegisterSchema,
} from './teacher-register.schema';
import { REG_ERROR, REG_ICON, REG_INPUT, REG_LABEL, REG_SUBMIT } from './register-ui';

type TeacherRegisterFormProps = {
  onSuccess?: () => void;
};

export function TeacherRegisterForm({ onSuccess }: TeacherRegisterFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherRegisterFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(teacherRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TeacherRegisterFormValues) => {
    setApiError(null);
    try {
      await postTeacherRegister({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      reset();
      onSuccess?.();
    } catch (e) {
      const msg =
        axios.isAxiosError(e) && e.response?.data && typeof e.response.data === 'object'
          ? String((e.response.data as { error?: string }).error ?? e.message)
          : 'Не удалось отправить запрос. Запустите сервер API (npm run dev:server) и попробуйте снова.';
      setApiError(msg);
    }
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {apiError && (
        <div
          className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {apiError}
        </div>
      )}

      <div>
        <label className={REG_LABEL} htmlFor="teacher-full-name">
          ФИО
        </label>
        <div className="relative">
          <User aria-hidden className={REG_ICON} strokeWidth={1.75} />
          <input
            id="teacher-full-name"
            autoComplete="name"
            className={REG_INPUT}
            placeholder="Иванов Иван Иванович"
            type="text"
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p className={REG_ERROR} role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label className={REG_LABEL} htmlFor="teacher-email">
          Email
        </label>
        <div className="relative">
          <Mail aria-hidden className={REG_ICON} strokeWidth={1.75} />
          <input
            id="teacher-email"
            autoComplete="email"
            className={REG_INPUT}
            placeholder="you@example.com"
            type="email"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className={REG_ERROR} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className={REG_LABEL} htmlFor="teacher-login">
          Логин
        </label>
        <div className="relative">
          <AtSign aria-hidden className={REG_ICON} strokeWidth={1.75} />
          <input
            id="teacher-login"
            autoComplete="username"
            className={REG_INPUT}
            placeholder="teacher_login"
            type="text"
            {...register('username')}
          />
        </div>
        {errors.username && (
          <p className={REG_ERROR} role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={REG_LABEL} htmlFor="teacher-password">
            Пароль
          </label>
          <div className="relative">
            <Lock aria-hidden className={REG_ICON} strokeWidth={1.75} />
            <input
              id="teacher-password"
              autoComplete="new-password"
              className={REG_INPUT}
              placeholder="••••••••"
              type="password"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className={REG_ERROR} role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label className={REG_LABEL} htmlFor="teacher-confirm-password">
            Повторите
          </label>
          <div className="relative">
            <KeyRound aria-hidden className={REG_ICON} strokeWidth={1.75} />
            <input
              id="teacher-confirm-password"
              autoComplete="new-password"
              className={REG_INPUT}
              placeholder="••••••••"
              type="password"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className={REG_ERROR} role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button className={REG_SUBMIT} disabled={isSubmitting} type="submit">
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
}
