import React from 'react';

const adminSections = [
  {
    title: 'Quản lý người dùng',
    description: 'Thêm, sửa, xóa và xem danh sách người dùng.',
  },
  {
    title: 'Quản lý lớp học',
    description: 'Tạo, chỉnh sửa, xóa và quản lý các lớp học.',
  },
  {
    title: 'Quản lý khóa học',
    description: 'Quản lý thông tin các khóa học, phân công giáo viên.',
  },
  {
    title: 'Thống kê & Báo cáo',
    description: 'Xem báo cáo tổng quan về hệ thống, số lượng người dùng, lớp học, v.v.',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Trang quản trị Admin</h1>
        <p className="mb-8 text-gray-600">Chào mừng bạn đến với trang quản trị. Vui lòng chọn chức năng để quản lý hệ thống.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.title}</h2>
              <p className="text-gray-500">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 