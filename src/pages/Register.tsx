import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { User, AtSign, Lock, RefreshCw, Users } from 'lucide-react';
import styles from './Register.module.css';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Слишком короткое имя'),
    username: z.string().min(3, 'Логин должен содержать минимум 3 символа'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
    groupCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Обработчик переключения табов
  const handleTabChange = (newRole: 'student' | 'teacher') => {
    setRole(newRole);
    reset();
  };

  const onSubmit = (data: RegisterFormValues) => {
    const payload = { ...data, role };
    console.log('Отправка данных регистрации:', payload);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>
          {role === 'student'
            ? 'Начните свой путь в программировании'
            : 'Создайте аккаунт преподавателя для доступа к платформе'}
        </p>

        {/* Табы */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${role === 'student' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('student')}
          >
            Студент
          </button>
          <button
            className={`${styles.tab} ${role === 'teacher' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('teacher')}
          >
            Преподаватель
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Поле Имя / ФИО */}
          <div className={styles.formGroup}>
            <label className={styles.label}>{role === 'student' ? 'Имя' : 'ФИО'}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><User size={18} /></span>
              <input
                type="text"
                placeholder={role === 'student' ? 'Иван Иванов' : 'Иванов Иван Иванович'}
                className={styles.input}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && <span className={styles.errorText}>{errors.fullName.message}</span>}
          </div>

          {/* Поле Логин */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Логин</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><AtSign size={18} /></span>
              <input
                type="text"
                placeholder={role === 'teacher' ? 'teacher_login' : 'username'}
                className={styles.input}
                {...register('username')}
              />
            </div>
            {errors.username && <span className={styles.errorText}>{errors.username.message}</span>}
          </div>

          {/* Два поля в ряд: Пароль и Подтверждение */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Пароль</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><Lock size={18} /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={styles.input}
                  {...register('password')}
                />
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {role === 'student' ? 'Повторите' : 'Подтверждение пароля'}
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><RefreshCw size={18} /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={styles.input}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          {/* Поле для студента: Код группы */}
          {role === 'student' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Код группы</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><Users size={18} /></span>
                <input
                  type="text"
                  placeholder="Например: CS-2024"
                  className={styles.input}
                  {...register('groupCode')}
                />
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            Зарегистрироваться
          </button>
        </form>

        <div className={styles.footer}>
          Уже есть аккаунт?
          <Link to="/login" className={styles.loginLink}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};