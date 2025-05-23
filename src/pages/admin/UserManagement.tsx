import React from 'react';

const UserManagement: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý người dùng</h1>
      <p className="mb-6 text-gray-600">Thêm, sửa, xóa và xem danh sách người dùng trong hệ thống.</p>
      <div className="bg-white rounded shadow p-4">
        <p className="text-gray-400">(Bảng danh sách người dùng sẽ hiển thị ở đây)</p>
      </div>
    </div>
  );
};

export default UserManagement; 