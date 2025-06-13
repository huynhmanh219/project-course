import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Edit, Trash2, Plus, Info } from 'lucide-react';

const initialLectures = [
  { 
    id: 1, 
    Ten_Bai_Giang: "Giới thiệu về Toán cao cấp", 
    Mon_Hoc_ID: 1,
    Thu_Tu: 1,
    Mo_Ta: "Bài giảng đầu tiên về Toán cao cấp",
    Ngay_Tao: "2024-03-15"
  },
  { 
    id: 2, 
    Ten_Bai_Giang: "Các khái niệm cơ bản về Web", 
    Mon_Hoc_ID: 2,
    Thu_Tu: 1,
    Mo_Ta: "Tổng quan về lập trình Web",
    Ngay_Tao: "2024-03-16"
  },
];

const monHocList = [
  { id: 1, ten: 'Toán cao cấp' },
  { id: 2, ten: 'Lập trình Web' },
  { id: 3, ten: 'Cơ sở dữ liệu' },
];

const Lectures: React.FC = () => {
  const [lectures, setLectures] = useState(initialLectures);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    const lecture = lectures.find(l => l.id === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa bài giảng "${lecture?.Ten_Bai_Giang}" không?\n\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      // TODO: Gọi API xóa bài giảng ở đây
      console.log("Xóa bài giảng có ID:", id);
      alert("Đã xóa bài giảng thành công!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" /> Quản lý bài giảng
            </h1>
            <p className="text-gray-500 text-base">Tạo, chỉnh sửa và quản lý các bài giảng.</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/teacher/lectures/add')}
          >
            <Plus className="w-5 h-5" /> Thêm bài giảng
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                <th className="px-4 py-3 text-left font-semibold">Tên bài giảng</th>
                <th className="px-4 py-3 text-left font-semibold">Môn học</th>
                <th className="px-4 py-3 text-left font-semibold">Thứ tự</th>
                <th className="px-4 py-3 text-left font-semibold">Mô tả</th>
                <th className="px-4 py-3 text-left font-semibold">Ngày tạo</th>
                <th className="px-4 py-3 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {lectures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    Không có bài giảng nào.
                  </td>
                </tr>
              ) : (
                lectures.map((lecture) => (
                  <tr key={lecture.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-4 py-3">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg font-semibold shadow-sm hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition duration-200 border border-blue-200 hover:border-blue-300 group"
                        onClick={() => navigate(`/teacher/lectures/${lecture.id}`)}
                      >
                        <BookOpen className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                        <span className="group-hover:text-blue-800 transition-colors">{lecture.Ten_Bai_Giang}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">{monHocList.find(mh => mh.id === lecture.Mon_Hoc_ID)?.ten}</td>
                    <td className="px-4 py-3">{lecture.Thu_Tu}</td>
                    <td className="px-4 py-3">{lecture.Mo_Ta}</td>
                    <td className="px-4 py-3">{lecture.Ngay_Tao}</td>
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition duration-200"
                        onClick={() => navigate(`/teacher/lectures/edit/${lecture.id}`)}
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-rose-600 transition duration-200"
                        onClick={() => handleDelete(lecture.id)}
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

export default Lectures; 