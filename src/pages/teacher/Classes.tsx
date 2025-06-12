import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Info, CheckCircle, XCircle, Users, Edit, Trash2, UserPlus } from "lucide-react";

const courseOptions = [
  { id: 1, name: 'Toán 10' },
  { id: 2, name: 'Văn 11' },
];

const initialClasses = [
  { id: 1, name: 'Lớp 10A1', courseId: 1, description: 'Lớp chuyên Toán', status: true, createdAt: '2024-06-01 10:00' },
  { id: 2, name: 'Lớp 11B2', courseId: 2, description: 'Lớp chuyên Văn', status: false, createdAt: '2024-06-02 09:30' },
];

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
    {active ? (<><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động</>) : (<><XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa</>)}
  </span>
);

const TeacherClasses: React.FC = () => {
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
              <BookOpen className="w-7 h-7 text-blue-600" /> Lớp học của tôi
            </h1>
            <p className="text-gray-500 text-base">Quản lý các lớp học bạn đang phụ trách.</p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow hover:from-indigo-600 hover:to-blue-700 transition"
            onClick={() => navigate('/teacher/classes/add')}
          >
            <UserPlus className="w-5 h-5" /> Thêm sinh viên vào lớp
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              Không có lớp học nào.
            </div>
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-shadow duration-200 flex flex-col p-6 group cursor-pointer relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-2 shadow">
                    <BookOpen className="text-white w-6 h-6" />
                  </span>
                  <span className="font-bold text-lg text-blue-900 truncate flex-1">{cls.name}</span>
                  {statusBadge(cls.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{courseOptions.find(c => c.id === cls.courseId)?.name}</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">Ngày tạo: {cls.createdAt}</div>
                <div className="mb-3 text-gray-700 text-sm line-clamp-2 min-h-[36px]">{cls.description}</div>
                <div className="flex gap-2 mt-auto">
                  <button className="flex items-center gap-1 text-blue-500 hover:underline font-semibold" onClick={() => navigate(`/teacher/classes/${cls.id}/students`)}>
                    <Users className="w-4 h-4" /> Quản lý sinh viên
                  </button>
                  <button className="flex items-center gap-1 text-green-600 hover:underline font-semibold" onClick={() => navigate(`/teacher/my-classes/edit/${cls.id}`)}>
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button className="flex items-center gap-1 text-red-600 hover:underline font-semibold" onClick={() => handleDelete(cls.id)}>
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClasses;
