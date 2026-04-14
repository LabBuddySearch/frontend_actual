import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  CodeXml,
  Filter,
  History,
  Mail,
  Sparkles,
  StickyNote,
  UserCircle,
  Users,
} from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { displayLoginFromUser } from '@/shared/lib/user-display';
import {
  adminProfileEditSchema,
  type AdminProfileEditValues,
  studentProfileEditSchema,
  type StudentProfileEditValues,
  teacherProfileEditSchema,
  type TeacherProfileEditValues,
} from '@/pages/profile/profile-edit.schema';

import styles from './Profile.module.css';

export type ProfileVariant = 'student' | 'teacher' | 'admin';

const historyData = [
  { id: 1, name: 'Сортировка пузырьком', status: 'OK', lang: 'Python', date: '12.10.2023 14:20', langColor: '#f1e05a' },
  { id: 2, name: 'Бинарный поиск', status: 'ERROR', lang: 'Java', date: '11.10.2023 10:15', langColor: '#b07219' },
  { id: 3, name: 'Связный список', status: 'OK', lang: 'Python', date: '10.10.2023 18:45', langColor: '#f1e05a' },
  { id: 4, name: 'Алгоритм Дейкстры', status: 'ERROR', lang: 'C++', date: '08.10.2023 12:05', langColor: '#f34b7d' },
];

type ProfileProps = {
  variant?: ProfileVariant;
};

function StudentProfileEditor({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) {
  const user = useAuthStore((s) => s.user)!;
  const updateUser = useAuthStore((s) => s.updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentProfileEditValues>({
    resolver: zodResolver(studentProfileEditSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      username: displayLoginFromUser(user),
      groupCode: user.studentGroup ?? '',
      studentHobbies: user.studentHobbies ?? '',
    },
  });

  const onSubmit = (data: StudentProfileEditValues) => {
    updateUser({
      fullName: data.fullName,
      email: data.email,
      username: data.username.trim(),
      studentGroup: data.groupCode.trim() || undefined,
      studentHobbies: data.studentHobbies.trim() || undefined,
    });
    onSaved();
  };

  return (
    <form className={styles.editForm} noValidate onSubmit={handleSubmit(onSubmit)}>
      <p className={styles.roleHint}>Роль: студент (нельзя изменить в этом разделе)</p>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-st-name">
            Имя
          </label>
          <input id="pf-st-name" className={styles.input} type="text" autoComplete="name" {...register('fullName')} />
          {errors.fullName && (
            <p className={styles.fieldError} role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-st-email">
            Email
          </label>
          <input id="pf-st-email" className={styles.input} type="email" autoComplete="email" {...register('email')} />
          {errors.email && (
            <p className={styles.fieldError} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-st-user">
            Логин
          </label>
          <input
            id="pf-st-user"
            className={`${styles.input} ${styles.inputMono}`}
            type="text"
            autoComplete="username"
            {...register('username')}
          />
          {errors.username && (
            <p className={styles.fieldError} role="alert">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-st-group">
            Код группы
          </label>
          <input id="pf-st-group" className={styles.input} type="text" {...register('groupCode')} />
        </div>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel} htmlFor="pf-st-hobby">
            Увлечения и интересы
          </label>
          <textarea id="pf-st-hobby" className={styles.textarea} placeholder="Например: робототехника, олимпиады по информатике" {...register('studentHobbies')} />
        </div>
      </div>
      <div className={styles.formActions}>
        <button className={styles.secondaryBtn} type="button" onClick={onCancel}>
          Отмена
        </button>
        <button className={styles.editBtn} type="submit">
          Сохранить
        </button>
      </div>
    </form>
  );
}

function TeacherProfileEditor({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) {
  const user = useAuthStore((s) => s.user)!;
  const updateUser = useAuthStore((s) => s.updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherProfileEditValues>({
    resolver: zodResolver(teacherProfileEditSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      username: displayLoginFromUser(user),
      teacherSubject: user.teacherSubject ?? '',
    },
  });

  const onSubmit = (data: TeacherProfileEditValues) => {
    updateUser({
      fullName: data.fullName,
      email: data.email,
      username: data.username.trim(),
      teacherSubject: data.teacherSubject.trim() || undefined,
    });
    onSaved();
  };

  return (
    <form className={styles.editForm} noValidate onSubmit={handleSubmit(onSubmit)}>
      <p className={styles.roleHint}>Роль: преподаватель</p>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-th-name">
            ФИО
          </label>
          <input id="pf-th-name" className={styles.input} type="text" autoComplete="name" {...register('fullName')} />
          {errors.fullName && (
            <p className={styles.fieldError} role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-th-email">
            Email
          </label>
          <input id="pf-th-email" className={styles.input} type="email" autoComplete="email" {...register('email')} />
          {errors.email && (
            <p className={styles.fieldError} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-th-user">
            Логин
          </label>
          <input
            id="pf-th-user"
            className={`${styles.input} ${styles.inputMono}`}
            type="text"
            autoComplete="username"
            {...register('username')}
          />
          {errors.username && (
            <p className={styles.fieldError} role="alert">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel} htmlFor="pf-th-subj">
            Преподаваемый предмет
          </label>
          <input id="pf-th-subj" className={styles.input} type="text" placeholder="Например: информатика" {...register('teacherSubject')} />
        </div>
      </div>
      <div className={styles.formActions}>
        <button className={styles.secondaryBtn} type="button" onClick={onCancel}>
          Отмена
        </button>
        <button className={styles.editBtn} type="submit">
          Сохранить
        </button>
      </div>
    </form>
  );
}

function AdminProfileEditor({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) {
  const user = useAuthStore((s) => s.user)!;
  const updateUser = useAuthStore((s) => s.updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminProfileEditValues>({
    resolver: zodResolver(adminProfileEditSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      username: displayLoginFromUser(user),
      adminNote: user.adminNote ?? '',
    },
  });

  const onSubmit = (data: AdminProfileEditValues) => {
    updateUser({
      fullName: data.fullName,
      email: data.email,
      username: data.username.trim(),
      adminNote: data.adminNote.trim() || undefined,
    });
    onSaved();
  };

  return (
    <form className={styles.editForm} noValidate onSubmit={handleSubmit(onSubmit)}>
      <p className={styles.roleHint}>Роль: администратор</p>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-ad-name">
            Имя / ФИО
          </label>
          <input id="pf-ad-name" className={styles.input} type="text" autoComplete="name" {...register('fullName')} />
          {errors.fullName && (
            <p className={styles.fieldError} role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-ad-email">
            Email
          </label>
          <input id="pf-ad-email" className={styles.input} type="email" autoComplete="email" {...register('email')} />
          {errors.email && (
            <p className={styles.fieldError} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="pf-ad-user">
            Логин
          </label>
          <input
            id="pf-ad-user"
            className={`${styles.input} ${styles.inputMono}`}
            type="text"
            autoComplete="username"
            {...register('username')}
          />
          {errors.username && (
            <p className={styles.fieldError} role="alert">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel} htmlFor="pf-ad-note">
            Подразделение или заметка
          </label>
          <textarea id="pf-ad-note" className={styles.textarea} placeholder="Например: учебный отдел" {...register('adminNote')} />
        </div>
      </div>
      <div className={styles.formActions}>
        <button className={styles.secondaryBtn} type="button" onClick={onCancel}>
          Отмена
        </button>
        <button className={styles.editBtn} type="submit">
          Сохранить
        </button>
      </div>
    </form>
  );
}

export const Profile = ({ variant = 'student' }: ProfileProps) => {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = useState(false);
  const showSolutionHistory = variant === 'student';

  const roleLabel = variant === 'student' ? 'Группа' : 'Роль';
  const roleValue =
    variant === 'student'
      ? user?.studentGroup?.trim() || 'Не указано'
      : variant === 'teacher'
        ? 'Преподаватель'
        : 'Администратор';

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.historyNote}>Войдите в аккаунт, чтобы просмотреть профиль.</p>
      </div>
    );
  }

  const loginDisplay = displayLoginFromUser(user);

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileCardRow}>
          <div className={styles.avatarColumn} aria-hidden>
            <div className={styles.avatarLg} />
          </div>

          <div className={styles.profileMain}>
        {!isEditing ? (
          <div className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{variant === 'teacher' ? 'ФИО' : 'Имя'}</span>
                <span className={styles.infoValue}>{user.fullName}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>
                  <Mail size={18} color="var(--text-secondary)" aria-hidden />
                  {user.email}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{roleLabel}</span>
                <span className={styles.infoValue}>
                  {variant === 'student' ? (
                    <>
                      <Users size={18} color="var(--text-secondary)" />
                      {roleValue}
                    </>
                  ) : (
                    <>
                      <UserCircle size={18} color="var(--text-secondary)" />
                      {roleValue}
                    </>
                  )}
                </span>
              </div>

              {variant === 'student' && (
                <div className={styles.customBlock}>
                  <p className={styles.customTitle}>
                    <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    Увлечения и интересы
                  </p>
                  <span className={styles.infoValue} style={{ fontSize: 16, fontWeight: 500 }}>
                    {user.studentHobbies?.trim() || 'Не указано'}
                  </span>
                </div>
              )}

              {variant === 'teacher' && (
                <div className={styles.customBlock}>
                  <p className={styles.customTitle}>
                    <BookOpen size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    Предмет
                  </p>
                  <span className={styles.infoValue} style={{ fontSize: 16, fontWeight: 500 }}>
                    {user.teacherSubject?.trim() || 'Не указано'}
                  </span>
                </div>
              )}

              {variant === 'admin' && (
                <div className={styles.customBlock}>
                  <p className={styles.customTitle}>
                    <StickyNote size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    Подразделение / заметка
                  </p>
                  <span className={styles.infoValue} style={{ fontSize: 16, fontWeight: 500 }}>
                    {user.adminNote?.trim() || 'Не указано'}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.profileSideColumn}>
              <button className={styles.editBtn} type="button" onClick={() => setIsEditing(true)}>
                Редактировать профиль
              </button>
              <div className={styles.profileLoginBlock}>
                <span className={styles.infoLabel}>Логин</span>
                <span className={styles.infoValueLogin}>{loginDisplay}</span>
              </div>
            </div>
          </div>
        ) : variant === 'student' ? (
          <StudentProfileEditor onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />
        ) : variant === 'teacher' ? (
          <TeacherProfileEditor onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />
        ) : (
          <AdminProfileEditor onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />
        )}
          </div>
        </div>
      </div>

      {showSolutionHistory ? (
        <div>
          <div className={styles.historyHeader}>
            <h2 className={styles.historyTitle}>
              <History size={24} color="var(--primary-color)" />
              История всех решений
            </h2>
            <button className={styles.filterBtn} type="button">
              <Filter size={18} />
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Название задачи</th>
                  <th>Статус</th>
                  <th>Язык</th>
                  <th>Дата / Время</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${row.status === 'OK' ? styles.statusOk : styles.statusError}`}>
                        <span className={styles.statusDot} />
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.langInfo}>
                        <span className={styles.statusDot} style={{ backgroundColor: row.langColor }} />
                        {row.lang}
                      </div>
                    </td>
                    <td>{row.date}</td>
                    <td style={{ color: 'var(--text-secondary)', textAlign: 'right', cursor: 'pointer' }}>
                      <CodeXml size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <span>Показано 4 из 158 попыток</span>
              <div className={styles.pageControls}>
                <button className={styles.pageBtn} type="button">
                  Пред.
                </button>
                <button className={styles.pageBtn} type="button">
                  След.
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.historyNote}>
          История отправок решений отображается в кабинете студента. Здесь — только данные профиля.
        </p>
      )}
    </div>
  );
};
