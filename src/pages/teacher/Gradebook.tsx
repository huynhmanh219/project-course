// src/pages/TeacherGradebook.tsx
import React from 'react';

const gradebook = [
  {
    name: 'Trần Thị B',
    mssv: 'SV001',
    progress: '80%',
    grade: 8.5,
    status: true,
  },
  {
    name: 'Nguyễn Văn C',
    mssv: 'SV002',
    progress: '60%',
    grade: 7.0,
    status: true,
  },
  {
    name: 'Lê Thị D',
    mssv: 'SV003',
    progress: '40%',
    grade: 5.5,
    status: false,
  },
];

const TeacherGradebook: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sổ điểm & Tiến độ học tập</h1>
      <p className="mb-6 text-gray-600">Theo dõi tiến độ và điểm số của sinh viên trong lớp.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên sinh viên</th>
              <th className="px-4 py-2 border">MSSV</th>
              <th className="px-4 py-2 border">Tiến độ</th>
              <th className="px-4 py-2 border">Điểm</th>
              <th className="px-4 py-2 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {gradebook.map((sv, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{sv.name}</td>
                <td className="px-4 py-2 border">{sv.mssv}</td>
                <td className="px-4 py-2 border">{sv.progress}</td>
                <td className="px-4 py-2 border">{sv.grade}</td>
                <td className="px-4 py-2 border">{sv.status ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherGradebook;