// src/pages/TeacherGradebook.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Info } from 'lucide-react';

const initialGrades = [
  { id: 1, name: 'Nguyễn Văn A', mssv: 'SV001', grade: 9.5, status: true },
  { id: 2, name: 'Trần Thị B', mssv: 'SV002', grade: 8.0, status: true },
  { id: 3, name: 'Lê Văn C', mssv: 'SV003', grade: 6.5, status: false },
];

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
    {active ? 'Hoạt động' : 'Khóa'}
  </span>
);

const Gradebook: React.FC = () => {
  const navigate = useNavigate();
  const grades = initialGrades;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" /> Sổ điểm lớp
            </h1>
            <p className="text-gray-500 text-base">Xem bảng điểm sinh viên trong lớp.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                <th className="px-4 py-3 text-left font-semibold">Họ tên</th>
                <th className="px-4 py-3 text-left font-semibold">MSSV</th>
                <th className="px-4 py-3 text-left font-semibold">Điểm</th>
                <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    Không có dữ liệu điểm.
                  </td>
                </tr>
              ) : (
                grades.map((g) => (
                  <tr key={g.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-semibold text-blue-900">{g.name}</td>
                    <td className="px-4 py-3">{g.mssv}</td>
                    <td className="px-4 py-3 font-bold text-indigo-700">{g.grade}</td>
                    <td className="px-4 py-3">{statusBadge(g.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gradebook;