import React from 'react';
import { useNavigate } from 'react-router-dom';

const adminSections = [
  {
    title: 'Quản lý người dùng',
    description: 'Thêm, sửa, xóa và xem danh sách người dùng.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
    ),
    to: '/admin/users',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    title: 'Quản lý vai trò',
    description: 'Xem thông tin các vai trò và quyền hạn trong hệ thống.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
    ),
    to: '/admin/roles',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },

  {
    title: 'Thống kê & Báo cáo',
    description: 'Xem báo cáo tổng quan về hệ thống, số lượng người dùng, lớp học, v.v.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
    ),
    to: '/admin/statistics',
    gradient: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Trang quản trị Admin</h1>
              <p className="text-blue-100 text-lg">Chào mừng bạn đến với trang quản trị. Vui lòng chọn chức năng để quản lý hệ thống.</p>
            </div>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {adminSections.map((section) => (
            <div
              key={section.title}
              className="group h-full cursor-pointer"
              onClick={() => navigate(section.to)}
            >
              <div className={`h-full flex flex-col shadow-lg border ${section.borderColor} bg-gradient-to-br ${section.bgGradient} group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden`}>
                {/* Header gradient bar */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.gradient}`} />
                
                <div className="flex-1 flex flex-col p-6">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-xl bg-gradient-to-tr ${section.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {section.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center flex-1 flex flex-col">
                    <h2 className={`text-xl font-bold ${section.textColor} mb-3`}>{section.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{section.description}</p>
                    
                    {/* Button */}
                    <button
                      className={`mt-6 px-6 py-3 rounded-xl bg-gradient-to-r ${section.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1`}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(section.to); 
                      }}
                    >
                      Đi tới
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;