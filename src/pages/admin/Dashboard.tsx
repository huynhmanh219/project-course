import React from 'react';
import { useNavigate } from 'react-router-dom';

const adminSections = [
  {
    title: 'Quản lý người dùng',
    description: 'Thêm, sửa, xóa và xem danh sách người dùng.',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
    ),
    to: '/admin/users',
  },
  {
    title: 'Quản lý lớp học',
    description: 'Tạo, chỉnh sửa, xóa và quản lý các lớp học.',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
    ),
    to: '/teacher/my-classes',
  },
  {
    title: 'Quản lý Bộ môn',
    description: 'Quản lý thông tin các bộ môn, phân công giáo viên.',
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
    ),
    to: '/admin/departments',
  },
  {
    title: 'Thống kê & Báo cáo',
    description: 'Xem báo cáo tổng quan về hệ thống, số lượng người dùng, lớp học, v.v.',
    icon: (
      <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /><rect x="7" y="13" width="3" height="5" rx="1" /><rect x="12" y="9" width="3" height="9" rx="1" /><rect x="17" y="5" width="3" height="13" rx="1" /></svg>
    ),
    to: '/admin/statistics',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-3 text-blue-700 text-center drop-shadow">Trang quản trị Admin</h1>
        <p className="mb-10 text-gray-600 text-center text-lg">Chào mừng bạn đến với trang quản trị. Vui lòng chọn chức năng để quản lý hệ thống.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adminSections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition-all duration-200 group cursor-pointer hover:-translate-y-1"
              onClick={() => navigate(section.to)}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">{section.icon}</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">{section.title}</h2>
              <p className="text-gray-500 text-center mb-4 text-sm">{section.description}</p>
              <button
                className="mt-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition-colors"
                onClick={e => { e.stopPropagation(); navigate(section.to); }}
              >
                Đi tới
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 