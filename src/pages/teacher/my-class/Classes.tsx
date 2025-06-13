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
    const classItem = classes.find(c => c.id === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa lớp học "${classItem?.name}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setClasses(classes.filter((c) => c.id !== id));
      alert("Đã xóa lớp học thành công!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" /> Lớp học của tôi
            </h1>
            <p className="text-gray-500 text-base">Quản lý các lớp học bạn đang phụ trách.</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:from-emerald-600 hover:to-teal-600 transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/teacher/classes/add')}
          >
            <UserPlus className="w-5 h-5" /> Thêm sinh viên vào lớp
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              Không có lớp học nào.
            </div>
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-shadow duration-200 flex flex-col p-8 group cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow">
                      <BookOpen className="text-white w-7 h-7" />
                    </span>
                    <div>
                      <h3 className="font-bold text-xl text-blue-900">{cls.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{courseOptions.find(c => c.id === cls.courseId)?.name}</span>
                      </div>
                    </div>
                  </div>
                  {/* {statusBadge(cls.status)} */}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="text-sm text-gray-500">Ngày tạo: {cls.createdAt}</div>
                  <div className="text-gray-700 text-base">{cls.description}</div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition duration-200"
                    onClick={() => navigate(`/teacher/classes/${cls.id}/students`)}
                  >
                    <Users className="w-5 h-5" /> Quản lý sinh viên
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow hover:from-emerald-600 hover:to-teal-600 transition duration-200"
                    onClick={() => navigate(`/teacher/my-classes/edit/${cls.id}`)}
                  >
                    <Edit className="w-5 h-5" /> Sửa
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold shadow hover:from-red-600 hover:to-rose-600 transition duration-200"
                    onClick={() => handleDelete(cls.id)}
                  >
                    <Trash2 className="w-5 h-5" /> Xóa
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
