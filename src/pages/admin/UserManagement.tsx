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
    const user = teachers.find(t => t.id === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa người dùng "${user?.hoTen}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setTeachers(teachers.filter((t) => t.id !== id));
      alert("Đã xóa người dùng thành công!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-blue-100 p-3 rounded-full mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
          </span>
          <h1 className="text-2xl font-extrabold text-blue-700 text-center">Quản lý giảng viên</h1>
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-150 text-base"
            onClick={() => navigate('/admin/teachers/add')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Thêm giảng viên
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 rounded-tl-2xl">Họ tên</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Bộ môn</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Ảnh đại diện</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 rounded-tr-2xl">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`hover:bg-blue-50 transition-colors ${idx === teachers.length - 1 ? 'rounded-b-2xl' : ''} text-center`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800 text-left">{t.hoTen}</td>
                  <td className="px-6 py-4 text-gray-600 text-left">{t.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-left">{t.boMon}</td>
                  <td className="px-6 py-4">
                    {t.hinhAnh ? (
                      <img src={t.hinhAnh} alt="avatar" className="w-10 h-10 rounded-full object-cover mx-auto border border-blue-200" />
                    ) : (
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-400 mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.trangThai ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{t.trangThai ? 'Hoạt động' : 'Khóa'}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      className="flex items-center gap-1 text-orange-700 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-2xl font-semibold shadow transition border border-orange-200 hover:shadow-md"
                      onClick={() => navigate(`/admin/teachers/edit/${t.id}`)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.213 3.75 21.25l1.037-3.75L16.862 4.487z" /></svg>
                      Sửa
                    </button>
                    <button
                      className="flex items-center gap-1 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-2 rounded-2xl font-semibold shadow transition border border-red-400 hover:shadow-md"
                      onClick={() => handleDelete(t.id)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2m0 0h4m-4 0H7" /></svg>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 