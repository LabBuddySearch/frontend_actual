import { createBrowserRouter, Navigate } from 'react-router-dom';

import { GuestLogin, GuestRegister, ProtectedRoute } from '@/app/route-guards';
import { AdminLayout } from '@/layouts/AdminLayout';
import { StudentLayout } from '@/layouts/StudentLayout';
import { TeacherLayout } from '@/layouts/TeacherLayout';
import { ComingSoonPage } from '@/pages/coming-soon/ComingSoonPage';
import { StudentDashboardPage } from '@/pages/student/StudentDashboardPage';
import { StudentTasksPage } from '@/pages/student/StudentTasksPage';
import { StudentTaskIdePage } from '@/pages/student/StudentTaskIdePage';
import { TeacherDashboardPage } from '@/pages/teacher/TeacherDashboardPage';
import { TeacherSectionPlaceholder } from '@/pages/teacher/TeacherSectionPlaceholder';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminSectionPlaceholder } from '@/pages/admin/AdminSectionPlaceholder';
import { RoleProfilePage } from '@/pages/profile/RoleProfilePage';
import { VerifyEmailPage } from '@/pages/verify-email/VerifyEmailPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <GuestLogin /> },
  { path: '/register', element: <GuestRegister /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'profile', element: <RoleProfilePage variant="admin" /> },
      { path: 'students', element: <AdminSectionPlaceholder title="Студенты" /> },
      { path: 'teachers', element: <AdminSectionPlaceholder title="Преподаватели" /> },
      { path: 'tasks', element: <AdminSectionPlaceholder title="Задачи" /> },
    ],
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedRole="teacher">
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TeacherDashboardPage /> },
      { path: 'profile', element: <RoleProfilePage variant="teacher" /> },
      { path: 'tasks', element: <TeacherSectionPlaceholder title="Задачи" /> },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRole="student">
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
  { path: '/forgot-password', element: <ComingSoonPage title="Восстановление пароля" /> },
]);
