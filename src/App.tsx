import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { Profile } from '@/pages/Profile';
import { Tasks } from '@/pages/Tasks';
import { useAuthStore } from '@/store/authStore';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  return isAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  const isAuth = useAuthStore((state) => state.isAuth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные роуты */}
        {/* Если авторизован и зашел на /login, перекидываем в профиль */}
        <Route path="/login" element={isAuth ? <Navigate to="/profile" replace /> : <Login />} />
        <Route path="/register" element={isAuth ? <Navigate to="/profile" replace /> : <Register />} />

        {/* Приватные роуты (внутри MainLayout) */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;