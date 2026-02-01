import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import LeetCode   from './pages/LeetCode';
import Tasks      from './pages/Tasks';
import Skills     from './pages/Skills';
import Resources  from './pages/Resources';
import Goals      from './pages/Goals';
import Profiles   from './pages/Profiles';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a2e', color: '#e8e8f0', border: '1px solid #2e2e4e' }
      }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leetcode" element={<ProtectedRoute><LeetCode /></ProtectedRoute>} />
          <Route path="/tasks"    element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/skills"   element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="/resources"element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/goals"    element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
