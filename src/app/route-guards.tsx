import { Navigate } from 'react-router-dom';

import type { TestRole } from '@/config/testAccounts';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { useAuthStore } from '@/store/authStore';

function authedHome(role: TestRole | null) {
  if (role === 'teacher') return '/teacher';
  if (role === 'admin') return '/admin';
  return '/student';
}

export function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: TestRole;
}) {
  const isAuth = useAuthStore((s) => s.isAuth);
  const role = useAuthStore((s) => s.role);
  if (!isAuth || !role) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to={authedHome(role)} replace />;
  return <>{children}</>;
}

export function GuestLogin() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const role = useAuthStore((s) => s.role);
  if (isAuth && role) return <Navigate to={authedHome(role)} replace />;
  return <Login />;
}

export function GuestRegister() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const role = useAuthStore((s) => s.role);
  if (isAuth && role) return <Navigate to={authedHome(role)} replace />;
  return <Register />;
}