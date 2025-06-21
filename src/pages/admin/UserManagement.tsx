import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const boMonOptions = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Văn' },
  { id: 3, name: 'Lý' },
];

const initialTeachers = [
  { id: 1, hoTen: 'Nguyễn Văn A', email: 'a@edu.com', lop: 'Toán', hinhAnh: '', trangThai: true },
  { id: 2, hoTen: 'Trần Thị B', email: 'b@edu.com', lop: 'Văn', hinhAnh: '', trangThai: false },
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

  const activeCount = teachers.filter(t => t.trangThai).length;
  const inactiveCount = teachers.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý Giảng viên</h1>
                <p className="text-blue-100 text-lg">Thêm, sửa, xóa và quản lý thông tin giảng viên trong hệ thống.</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <div className="text-blue-100 text-sm">Đang hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveCount}</div>
                  <div className="text-blue-100 text-sm">Đã khóa</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{teachers.length}</div>
                  <div className="text-blue-100 text-sm">Tổng giảng viên</div>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex items-center gap-2"
                  onClick={() => navigate('/admin/teachers/add')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Thêm giảng viên
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 rounded-tl-2xl">Họ tên</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Lớp</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Ảnh đại diện</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 rounded-tr-2xl">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`hover:bg-blue-50 transition-all duration-200 ${idx === teachers.length - 1 ? 'rounded-b-2xl' : ''}`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800 text-left">{t.hoTen}</td>
                  <td className="px-6 py-4 text-gray-600 text-left text-sm">{t.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-left text-sm">{t.lop}</td>
                  <td className="px-6 py-4 text-center">
                    {t.hinhAnh ? (
                      <img src={t.hinhAnh} alt="avatar" className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-blue-200 shadow-sm" />
                    ) : (
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 mx-auto shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      t.trangThai 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {t.trangThai ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Đã khóa
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                      onClick={() => navigate(`/admin/teachers/edit/${t.id}`)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.213 3.75 21.25l1.037-3.75L16.862 4.487z" /></svg>
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                      onClick={() => handleDelete(t.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2m0 0h4m-4 0H7" /></svg>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {teachers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có giảng viên nào
              </h3>
              <p className="text-gray-500">
                Các giảng viên sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;