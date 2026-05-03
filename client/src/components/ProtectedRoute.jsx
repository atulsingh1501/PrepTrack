import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import AppLayout from './AppLayout';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-primary-500 flex items-center justify-center shadow-glow-indigo">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Loading PrepTrack…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
};

export default ProtectedRoute;
