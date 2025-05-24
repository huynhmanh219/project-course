import React from 'react';

const users = [
  { name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Giáo viên' },
  { name: 'Trần Thị B', email: 'b@gmail.com', role: 'Học sinh' },
  { name: 'Admin', email: 'admin@gmail.com', role: 'Admin' },
];

const UserManagement: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý người dùng</h1>
      <p className="mb-6 text-gray-600">Thêm, sửa, xóa và xem danh sách người dùng.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Vai trò</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-500 hover:underline mr-2">Sửa</button>
                  <button className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 