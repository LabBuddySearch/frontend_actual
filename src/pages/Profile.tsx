import { History, Filter, UserCircle, Users, CodeXml } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import styles from './Profile.module.css';

export type ProfileVariant = 'student' | 'teacher' | 'admin';

// Захардкоженные данные
const historyData = [
  { id: 1, name: 'Сортировка пузырьком', status: 'OK', lang: 'Python', date: '12.10.2023 14:20', langColor: '#f1e05a' },
  { id: 2, name: 'Бинарный поиск', status: 'ERROR', lang: 'Java', date: '11.10.2023 10:15', langColor: '#b07219' },
  { id: 3, name: 'Связный список', status: 'OK', lang: 'Python', date: '10.10.2023 18:45', langColor: '#f1e05a' },
  { id: 4, name: 'Алгоритм Дейкстры', status: 'ERROR', lang: 'C++', date: '08.10.2023 12:05', langColor: '#f34b7d' },
];

type ProfileProps = {
  variant?: ProfileVariant;
};

export const Profile = ({ variant = 'student' }: ProfileProps) => {
  const { fullName, username, group } = useAuthStore();
  const showSolutionHistory = variant === 'student';

  const roleLabel = variant === 'student' ? 'Группа' : 'Роль';
  const roleValue =
    variant === 'student'
      ? group || 'Без группы'
      : variant === 'teacher'
        ? 'Преподаватель'
        : 'Администратор';

  return (
    <div className={styles.container}>
      {/* ВЕРХНЯЯ КАРТОЧКА ПРОФИЛЯ */}
      <div className={styles.profileCard}>
        <div className={styles.avatarLg}></div>
        
        <div className={styles.infoSection}>
          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Имя</span>
              <span className={styles.infoValue}>{fullName}</span>
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
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Логин</span>
              <span className={styles.infoValueLogin}>{username}</span>
            </div>
            
            {/* Чтобы кнопка съехала вниз, используем align-self в CSS */}
            <button className={styles.editBtn} type="button">
              Редактировать профиль
            </button>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ СЕКЦИЯ: история решений — только студент */}
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
                        <span className={styles.statusDot}></span>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.langInfo}>
                        <span className={styles.statusDot} style={{ backgroundColor: row.langColor }}></span>
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