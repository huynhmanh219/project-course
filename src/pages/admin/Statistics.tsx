import React from 'react';

const stats = [
  { label: 'Tổng số người dùng', value: 120 },
  { label: 'Tổng số lớp học', value: 8 },
  { label: 'Tổng số khóa học', value: 5 },
];

const Statistics: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Thống kê & Báo cáo</h1>
      <p className="mb-6 text-gray-600">Xem báo cáo tổng quan về hệ thống.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-gray-700">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics; 