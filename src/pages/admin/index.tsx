import React from 'react';
import {  Outlet } from 'react-router-dom';

// const adminLinks = [
//   { to: '/admin/dashboard', label: 'Dashboard' },
//   { to: '/admin/users', label: 'Quản lý người dùng' },
//   { to: '/admin/classes', label: 'Quản lý lớp học' },
//   { to: '/admin/courses', label: 'Quản lý khóa học' },
//   { to: '/admin/statistics', label: 'Thống kê' },
// ];

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 