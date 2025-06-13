import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit, Trash2, CheckCircle, XCircle, Plus, Info } from "lucide-react";
import { Button } from "../../../components/ui/button";

const initialCourses = [
  { id: 1, tenKhoaHoc: "Toán 10", moTa: "Khóa học Toán nâng cao", ngayBatDau: "2024-06-01", ngayKetThuc: "2024-07-01", trangThai: true },
  { id: 2, tenKhoaHoc: "Văn 11", moTa: "Khóa học Văn cơ bản", ngayBatDau: "2024-06-10", ngayKetThuc: "2024-07-10", trangThai: false },
];

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
    {active ? (<><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động</>) : (<><XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa</>)}
  </span>
);

const TeacherCourses: React.FC = () => {
  const [courses, setCourses] = useState(initialCourses);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    const course = courses.find(c => c.id === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa khóa học "${course?.tenKhoaHoc}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setCourses(courses.filter((c) => c.id !== id));
      alert("Đã xóa khóa học thành công!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" /> Quản lý môn học
            </h1>
            <p className="text-gray-500 text-base">Tạo, chỉnh sửa, xóa và quản lý các khoá học.</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/teacher/courses/add')}
          >
            <Plus className="w-5 h-5" /> Thêm môn học
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                <th className="px-4 py-3 text-left font-semibold">Tên môn học</th>
                <th className="px-4 py-3 text-left font-semibold">Mô tả</th>
                <th className="px-4 py-3 text-left font-semibold">Ngày bắt đầu</th>
                <th className="px-4 py-3 text-left font-semibold">Ngày kết thúc</th>
                {/* <th className="px-4 py-3 text-left font-semibold">Trạng thái</th> */}
                <th className="px-4 py-3 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    Không có môn học nào.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-4 py-3">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg font-semibold shadow-sm hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition duration-200 border border-blue-200 hover:border-blue-300 group"
                        onClick={() => navigate(`/teacher/courses/${course.id}`)}
                      >
                        <BookOpen className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                        <span className="group-hover:text-blue-800 transition-colors">{course.tenKhoaHoc}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">{course.moTa}</td>
                    <td className="px-4 py-3">{course.ngayBatDau}</td>
                    <td className="px-4 py-3">{course.ngayKetThuc}</td>
                    {/* <td className="px-4 py-3">{statusBadge(course.trangThai)}</td> */}
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition duration-200"
                        onClick={() => navigate(`/teacher/courses/edit/${course.id}`)}
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-rose-600 transition duration-200"
                        onClick={() => handleDelete(course.id)}
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

export default TeacherCourses; 