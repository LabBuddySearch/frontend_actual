import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, ListTodo, LogOut, SquareTerminal } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { displayLoginFromUser } from '@/shared/lib/user-display';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const username = displayLoginFromUser(user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Боковое меню */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <SquareTerminal className={styles.logoIcon} size={28} />
          EduCode
        </div>
        
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} end>
            <LayoutDashboard size={20} />
            Главный экран
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
            <User size={20} />
            Профиль
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
            <ListTodo size={20} />
            Задачи
          </NavLink>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          Выйти
        </button>
      </aside>

      {/* Основная часть с шапкой и контентом */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <span className={styles.username}>{username}</span>
            <div className={styles.avatar}></div> {/* Градиентная заглушка */}
          </div>
        </header>
        
        <div className={styles.content}>
          {/* Сюда будут подставляться страницы (Главная, Профиль, Задачи) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};