import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      if (token && user) {
        setIsAuthenticated(true);
        setUserRole(user.role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRole && userRole) {
    // Admin can access everything
    if (userRole === 'admin') {
      return <>{children}</>;
    }
    
    // For other roles, check if they have the required role
    if (!requiredRole.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không có quyền truy cập</h2>
            <p className="text-gray-600 mb-4">
              Bạn không có quyền truy cập vào trang này.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute; 