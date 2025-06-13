import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Edit, Trash2, CheckCircle, XCircle, Plus, Info } from 'lucide-react';

const courseOptions = [
  { id: 1, name: 'Toán 10' },
  { id: 2, name: 'Văn 11' },
];
const teacherOptions = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
];

const initialClasses = [
  { id: 1, name: 'Lớp 10A1', courseId: 1, teacherId: 1, description: 'Lớp chuyên Toán', status: true, createdAt: '2024-06-01 10:00' },
  { id: 2, name: 'Lớp 11B2', courseId: 2, teacherId: 2, description: 'Lớp chuyên Văn', status: false, createdAt: '2024-06-02 09:30' },
];

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
    {active ? (<><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động</>) : (<><XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa</>)}
  </span>
);

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState(initialClasses);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setClasses(classes.filter((cls) => cls.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" /> Quản lý lớp học
            </h1>
            <p className="text-gray-500 text-base">Tạo, chỉnh sửa, xóa và quản lý các lớp học.</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/teacher/my-classes/add')}
          >
            <Plus className="w-5 h-5" /> Thêm lớp học
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                <th className="px-4 py-3 text-left font-semibold">Tên lớp</th>
                <th className="px-4 py-3 text-left font-semibold">Khóa học</th>
                <th className="px-4 py-3 text-left font-semibold">Giảng viên</th>
                <th className="px-4 py-3 text-left font-semibold">Ngày tạo</th>
                {/* <th className="px-4 py-3 text-left font-semibold">Trạng thái</th> */}
                <th className="px-4 py-3 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    Không có lớp học nào.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-semibold text-blue-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" /> {cls.name}
                    </td>
                    <td className="px-4 py-3">{courseOptions.find(c => c.id === cls.courseId)?.name}</td>
                    <td className="px-4 py-3">{teacherOptions.find(t => t.id === cls.teacherId)?.name}</td>
                    <td className="px-4 py-3">{cls.createdAt}</td>
                    {/* <td className="px-4 py-3">{statusBadge(cls.status)}</td> */}
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition duration-200"
                        onClick={() => navigate(`/teacher/my-classes/edit/${cls.id}`)}
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-rose-600 transition duration-200"
                        onClick={() => handleDelete(cls.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </td>
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

export default ClassManagement; 