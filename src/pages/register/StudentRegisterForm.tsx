import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, KeyRound, Lock, Mail, User, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { registerUser } from '@/shared/api/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import {
  type StudentRegisterFormValues,
  studentRegisterSchema,
} from './student-register.schema';
import { REG_ERROR, REG_HINT, REG_ICON, REG_INPUT, REG_LABEL, REG_SUBMIT } from './register-ui';

type StudentRegisterFormProps = {
  onSuccess?: () => void;
};

export function StudentRegisterForm({ onSuccess }: StudentRegisterFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const loginAction = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      groupCode: '',
    },
  });

  const onSubmit = async (data: StudentRegisterFormValues) => {
    setApiError(null);
    try {
      const payload = {
        role: 'STUDENT',
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        student_group: data.groupCode,
      };
      
      const response = await registerUser(payload);

      loginAction(response.accessToken, {
        ...response.user,
        username: data.username.trim(),
        studentGroup: data.groupCode.trim() || undefined,
      });
      
      reset();
      onSuccess?.();
    } catch (e) {
      const msg = axios.isAxiosError(e) && e.response?.data && typeof e.response.data === 'object'
        ? String((e.response.data as { message?: string }).message ?? e.message)
        : 'Не удалось отправить запрос.';
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
        <label className={REG_LABEL} htmlFor="reg-full-name">
          Имя
        </label>
        <div className="relative">
          <User
            aria-hidden
            className={REG_ICON}
            strokeWidth={1.75}
          />
          <input
            id="reg-full-name"
            autoComplete="name"
            className={REG_INPUT}
            placeholder="Иван Иванов"
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
        <label className={REG_LABEL} htmlFor="reg-email">
          Email
        </label>
        <div className="relative">
          <Mail aria-hidden className={REG_ICON} strokeWidth={1.75} />
          <input
            id="reg-email"
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
        <label className={REG_LABEL} htmlFor="reg-username">
          Логин
        </label>
        <div className="relative">
          <AtSign aria-hidden className={REG_ICON} strokeWidth={1.75} />
          <input
            id="reg-username"
            autoComplete="username"
            className={REG_INPUT}
            placeholder="username"
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
          <label className={REG_LABEL} htmlFor="reg-password">
            Пароль
          </label>
          <div className="relative">
            <Lock aria-hidden className={REG_ICON} strokeWidth={1.75} />
            <input
              id="reg-password"
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
          <label className={REG_LABEL} htmlFor="reg-confirm-password">
            Повторите
          </label>
          <div className="relative">
            <KeyRound aria-hidden className={REG_ICON} strokeWidth={1.75} />
            <input
              id="reg-confirm-password"
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

      <div>
        <label className={REG_LABEL} htmlFor="reg-group-code">
          Код группы
        </label>
        <div className="relative">
          <Users aria-hidden className={REG_ICON} strokeWidth={1.75} />
          <input
            id="reg-group-code"
            className={REG_INPUT}
            placeholder="Например: CS-2024"
            type="text"
            {...register('groupCode')}
          />
        </div>
        <p className={REG_HINT}>
          Необязательно, если вы регистрируетесь самостоятельно
        </p>
      </div>

      <div className="pt-2">
        <button className={REG_SUBMIT} disabled={isSubmitting} type="submit">
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
}
