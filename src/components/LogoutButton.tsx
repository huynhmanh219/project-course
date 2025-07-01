import React from 'react';
import { LogOut } from "lucide-react";
import { authService } from "../services/auth.service";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className, children }) => {
  const handleLogout = async () => {
    try {
      console.log('Logout clicked - calling authService.logout()');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);  
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "cursor-pointer text-red-600 focus:text-red-600 flex items-center"}
    >
      {children || (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </>
      )}
    </button>
  );
};

export default LogoutButton; 