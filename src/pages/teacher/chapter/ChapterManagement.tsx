import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, BookOpen, FileText, Layers, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Chapter {
  ID: number;
  Ten_Chuong: string;
  Mo_Ta: string;
  Bai_Giang_ID: number;
  Thu_Tu: number;
  Noi_Dung: string;
}

const ChapterManagement: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      ID: 1,
      Ten_Chuong: "Chương 1: Giới thiệu",
      Mo_Ta: "Tổng quan về môn học",
      Bai_Giang_ID: 1,
      Thu_Tu: 1,
      Noi_Dung: "Nội dung chi tiết của chương 1..."
    },
    {
      ID: 2,
      Ten_Chuong: "Chương 2: Cơ sở lý thuyết",
      Mo_Ta: "Các khái niệm cơ bản",
      Bai_Giang_ID: 1,
      Thu_Tu: 2,
      Noi_Dung: "Nội dung chi tiết của chương 2..."
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [newChapter, setNewChapter] = useState<Partial<Chapter>>({
    Ten_Chuong: '',
    Mo_Ta: '',
    Thu_Tu: 1,
    Noi_Dung: ''
  });

  const handleAddChapter = () => {
    if (newChapter.Ten_Chuong) {
      const chapter: Chapter = {
        ID: chapters.length + 1,
        Ten_Chuong: newChapter.Ten_Chuong,
        Mo_Ta: newChapter.Mo_Ta || '',
        Bai_Giang_ID: 1, // Giả lập
        Thu_Tu: newChapter.Thu_Tu || 1,
        Noi_Dung: newChapter.Noi_Dung || ''
      };
      setChapters([...chapters, chapter]);
      setIsAddModalOpen(false);
      setNewChapter({ Ten_Chuong: '', Mo_Ta: '', Thu_Tu: 1, Noi_Dung: '' });
    }
  };

  const handleEditChapter = () => {
    if (selectedChapter) {
      setChapters(chapters.map(chapter => 
        chapter.ID === selectedChapter.ID ? selectedChapter : chapter
      ));
      setIsEditModalOpen(false);
      setSelectedChapter(null);
    }
  };

  const handleDeleteChapter = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương này?')) {
      setChapters(chapters.filter(chapter => chapter.ID !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        {/* <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/teacher" className="hover:text-blue-600 transition">Trang chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 font-medium">Quản lý chương</span>
        </div> */}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Quản lý chương</h1>
            <p className="text-gray-600">Quản lý các chương trong bài giảng</p>
          </div>
          <button
            onClick={() => navigate('/teacher/chapters/add')}
            className="group relative inline-flex items-center justify-center px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 ease-in-out transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative flex items-center gap-2">
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              <span>Thêm chương mới</span>
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng số chương</p>
                <p className="text-2xl font-bold text-blue-700">{chapters.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl text-white">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng số bài giảng</p>
                <p className="text-2xl font-bold text-green-700">3</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl text-white">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng số tài liệu</p>
                <p className="text-2xl font-bold text-purple-700">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Danh sách chương</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm chương..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300 focus:w-80"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Thứ tự</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Tên chương</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Mô tả</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Nội dung</th>
                  <th className="text-right py-4 px-6 text-gray-600 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <tr 
                    key={chapter.ID} 
                    className="border-b border-gray-50 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {chapter.Thu_Tu}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800">{chapter.Ten_Chuong}</td>
                    <td className="py-4 px-6 text-gray-600">{chapter.Mo_Ta}</td>
                    <td className="py-4 px-6 text-gray-600 max-w-md truncate">{chapter.Noi_Dung}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/teacher/chapters/edit/${chapter.ID}`)}
                          className="p-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.ID)}
                          className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal thêm chương */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm chương mới</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương</label>
                  <input
                    type="text"
                    value={newChapter.Ten_Chuong}
                    onChange={(e) => setNewChapter({...newChapter, Ten_Chuong: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={newChapter.Mo_Ta}
                    onChange={(e) => setNewChapter({...newChapter, Mo_Ta: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea
                    value={newChapter.Noi_Dung}
                    onChange={(e) => setNewChapter({...newChapter, Noi_Dung: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                  <input
                    type="number"
                    value={newChapter.Thu_Tu}
                    onChange={(e) => setNewChapter({...newChapter, Thu_Tu: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddChapter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa chương */}
        {isEditModalOpen && selectedChapter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa chương</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương</label>
                  <input
                    type="text"
                    value={selectedChapter.Ten_Chuong}
                    onChange={(e) => setSelectedChapter({...selectedChapter, Ten_Chuong: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={selectedChapter.Mo_Ta}
                    onChange={(e) => setSelectedChapter({...selectedChapter, Mo_Ta: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea
                    value={selectedChapter.Noi_Dung}
                    onChange={(e) => setSelectedChapter({...selectedChapter, Noi_Dung: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                  <input
                    type="number"
                    value={selectedChapter.Thu_Tu}
                    onChange={(e) => setSelectedChapter({...selectedChapter, Thu_Tu: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditChapter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterManagement; 