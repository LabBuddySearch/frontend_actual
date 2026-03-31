import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { matchTestAccount } from '@/config/testAccounts';
import { useAuthStore } from '@/store/authStore';
import styles from './Login.module.css';

const loginSchema = z.object({
  username: z.string().min(3, 'Логин должен содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    clearErrors('root');
    const account = matchTestAccount(data.username, data.password);
    if (!account) {
      setError('root', { message: 'Неверный логин или пароль' });
      return;
    }
    login(account.username, account.fullName, account.role, account.group);
    const home =
      account.role === 'teacher' ? '/teacher' : account.role === 'admin' ? '/admin' : '/student';
    navigate(home);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Авторизация</h1>
        <p className={styles.subtitle}>Введите свои данные для входа в аккаунт</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Поле Логин */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <label className={styles.label}>Логин</label>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Введите ваш логин"
                className={styles.input}
                {...register('username')}
              />
            </div>
            {errors.username && (
              <span className={styles.errorText}>{errors.username.message}</span>
            )}
          </div>

          {/* Поле Пароль */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <label className={styles.label}>Пароль</label>
              <a href="#" className={styles.forgotPassword}>
                Забыли пароль?
              </a>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите ваш пароль"
                className={styles.input}
                {...register('password')}
              />
              {/* Иконка переключения видимости пароля */}
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>{errors.password.message}</span>
            )}
          </div>

          {errors.root && (
            <span className={styles.errorText} role="alert">
              {errors.root.message}
            </span>
          )}

          <button type="submit" className={styles.submitBtn}>
            Войти
          </button>
        </form>

        <div className={styles.footer}>
          Нет аккаунта?
          <Link to="/register" className={styles.registerLink}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};