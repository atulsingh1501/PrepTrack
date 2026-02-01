import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Sidebar from './Sidebar';

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-dark-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-x-hidden relative">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
