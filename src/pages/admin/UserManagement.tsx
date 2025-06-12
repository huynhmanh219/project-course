import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const boMonOptions = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Văn' },
  { id: 3, name: 'Lý' },
];

const initialTeachers = [
  { id: 1, hoTen: 'Nguyễn Văn A', email: 'a@edu.com', boMon: 'Toán', hinhAnh: '', trangThai: true },
  { id: 2, hoTen: 'Trần Thị B', email: 'b@edu.com', boMon: 'Văn', hinhAnh: '', trangThai: false },
];

const UserManagement: React.FC = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý giảng viên</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/admin/teachers/add')}>
        Thêm giảng viên
      </button>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Họ tên</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Bộ môn</th>
            <th className="px-4 py-2 border">Ảnh đại diện</th>
            <th className="px-4 py-2 border">Trạng thái</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id} className="text-center">
              <td className="px-4 py-2 border">{t.hoTen}</td>
              <td className="px-4 py-2 border">{t.email}</td>
              <td className="px-4 py-2 border">{t.boMon}</td>
              <td className="px-4 py-2 border">{t.hinhAnh || <span className="text-gray-400">(Không có)</span>}</td>
              <td className="px-4 py-2 border">{t.trangThai ? 'Hoạt động' : 'Khóa'}</td>
              <td className="px-4 py-2 border">
                <button
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() => navigate(`/admin/teachers/edit/${t.id}`)} // Có thể mở form sửa ở đây nếu muốn
                >
                  Sửa
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(t.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement; 