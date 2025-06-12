import React from 'react';

const stats = [
  {
    label: 'Tổng số người dùng',
    value: 120,
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
    ),
    color: 'from-blue-400 to-blue-600',
  },
  {
    label: 'Tổng số lớp học',
    value: 8,
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
    ),
    color: 'from-green-400 to-green-600',
  },
  {
    label: 'Tổng số khóa học',
    value: 5,
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a4 4 0 018 0v2" /></svg>
    ),
    color: 'from-purple-400 to-purple-600',
  },
];

const Statistics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <span className="bg-blue-100 p-3 rounded-full mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3.75h1.5m-1.5 0a2.25 2.25 0 00-2.25 2.25v.75m3.75-3v.75m0 0h1.5a2.25 2.25 0 012.25 2.25v.75m-7.5 0v-.75A2.25 2.25 0 0111.25 3.75m-3.75 3v12.75A2.25 2.25 0 009.75 21.75h4.5a2.25 2.25 0 002.25-2.25V6.75m-9 0h13.5" /></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2">Thống kê & Báo cáo</h1>
          <p className="text-gray-600 text-center text-lg">Xem báo cáo tổng quan về hệ thống.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition-all group cursor-pointer hover:-translate-y-1`}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className={`text-4xl font-extrabold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
              <div className="text-gray-700 text-center font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics; 