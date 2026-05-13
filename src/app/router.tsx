import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@/app/route-guards';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { StudentLayout } from '@/layouts/StudentLayout';
import { TeacherLayout } from '@/layouts/TeacherLayout';
import { StudentDashboardPage } from '@/pages/student/StudentDashboardPage';
import { StudentTasksPage } from '@/pages/student/StudentTasksPage';
import { StudentTaskIdePage } from '@/pages/student/StudentTaskIdePage';
import { TeacherDashboardPage } from '@/pages/teacher/TeacherDashboardPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTasksPage } from '@/pages/admin/AdminTasksPage';
import { AdminUserManagementPage } from '@/pages/admin/AdminUserManagementPage';
import { RoleProfilePage } from '@/pages/profile/RoleProfilePage';
import { VerifyEmailPage } from '@/pages/verify-email/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/forgot-password/ForgotPasswordPage';
import { TeacherTasksPage } from '@/pages/teacher/TeacherTasksPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRole="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'profile', element: <RoleProfilePage variant="admin" /> },
      { path: 'students', element: <AdminUserManagementPage variant="students" /> },
      { path: 'teachers', element: <AdminUserManagementPage variant="teachers" /> },
      { path: 'tasks', element: <AdminTasksPage /> },
    ],
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedRole="TEACHER">
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TeacherDashboardPage /> },
      { path: 'profile', element: <RoleProfilePage variant="teacher" /> },
      { path: 'tasks', element: <TeacherTasksPage /> },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRole="STUDENT">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentDashboardPage /> },
      { path: '/student/profile', element: <RoleProfilePage variant="student" /> },
      {
        path: '/student/tasks',
        children: [
          { index: true, element: <StudentTasksPage /> },
          { path: '/student/tasks/:taskId', element: <StudentTaskIdePage /> },
        ],
      },
    ],
  },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
]);
