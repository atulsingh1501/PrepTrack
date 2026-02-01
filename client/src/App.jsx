import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { setupInterceptors } from './api/axios';
import useAuthStore from './store/useAuthStore';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlatformTrackers from './pages/PlatformTrackers';
import Agenda from './pages/Agenda';
import InterviewBoard from './pages/InterviewBoard';
import StudyHub from './pages/StudyHub';
import Goals from './pages/Goals';

// Run interceptor setup
setupInterceptors(useAuthStore);

// Dashboard is now imported from './pages/Dashboard'


function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trackers" element={<PlatformTrackers />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/interviews" element={<InterviewBoard />} />
            <Route path="/study" element={<StudyHub />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
