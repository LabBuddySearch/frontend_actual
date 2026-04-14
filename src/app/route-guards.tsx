import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';

export function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole && user?.role !== allowedRole.toUpperCase()) {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
}

export function GuestLogin() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);
  
  if (isAuth && user) {
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/student" replace />;
  }
  
  return <LoginPage />; 
}

export function GuestRegister() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);
  
  if (isAuth && user) {
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/student" replace />;
  }
  
  return <RegisterPage />; 
}