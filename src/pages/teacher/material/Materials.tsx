import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Download, Edit, Trash2, Filter } from "lucide-react";

const materialsList = [
  {
    id: 1,
    Ten_Tai_Lieu: 'Tài liệu học tập Toán cao cấp',
    Mo_Ta: 'Tài liệu tổng hợp các kiến thức cơ bản về Toán cao cấp',
    Loai_Tai_Lieu: 1,
    Duong_Dan_File: 'toan_cao_cap.pdf',
    Bai_Giang: 'Giới thiệu về Toán cao cấp',
    Mon_Hoc: 'Toán cao cấp',
    Ngay_Upload: '2024-03-15',
  },
  {
    id: 2,
    Ten_Tai_Lieu: 'Bài tập Lập trình Web',
    Mo_Ta: 'Các bài tập thực hành về HTML, CSS và JavaScript',
    Loai_Tai_Lieu: 2,
    Duong_Dan_File: 'bai_tap_web.zip',
    Bai_Giang: 'Các khái niệm cơ bản về Web',
    Mon_Hoc: 'Lập trình Web',
    Ngay_Upload: '2024-03-14',
  },
  {
    id: 3,
    Ten_Tai_Lieu: 'Đề thi giữa kỳ CSDL',
    Mo_Ta: 'Đề thi giữa kỳ môn Cơ sở dữ liệu',
    Loai_Tai_Lieu: 3,
    Duong_Dan_File: 'de_thi_csdl.pdf',
    Bai_Giang: 'Tổng quan về CSDL',
    Mon_Hoc: 'Cơ sở dữ liệu',
    Ngay_Upload: '2024-03-13',
  },
];

const Materials: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const filteredMaterials = materialsList.filter(material => {
    const matchesSearch = material.Ten_Tai_Lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.Mo_Ta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.Bai_Giang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.Mon_Hoc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === null || material.Loai_Tai_Lieu === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'Tài liệu học tập';
      case 2: return 'Bài tập';
      case 3: return 'Đề thi';
      default: return '';
    }
  };

  const getTypeColor = (type: number) => {
    switch (type) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-indigo-100 text-indigo-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-blue-700">Quản lý tài liệu</h1>
          </div>
          <button
            onClick={() => navigate('/teacher/materials/add')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-600 transition duration-200 flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Thêm tài liệu mới
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === null
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedType(1)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === 1
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tài liệu học tập
              </button>
              <button
                onClick={() => setSelectedType(2)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === 2
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bài tập
              </button>
              <button
                onClick={() => setSelectedType(3)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === 3
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Đề thi
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(material.Loai_Tai_Lieu)}`}>
                    {getTypeLabel(material.Loai_Tai_Lieu)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/teacher/materials/edit/${material.id}`)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const confirmMessage = `Bạn có chắc chắn muốn xóa tài liệu "${material.Ten_Tai_Lieu}" không?\n\nHành động này không thể hoàn tác.`;
                        
                        if (window.confirm(confirmMessage)) {
                          // TODO: Gọi API xóa tài liệu ở đây
                          console.log("Xóa tài liệu có ID:", material.id);
                          alert("Đã xóa tài liệu thành công!");
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{material.Ten_Tai_Lieu}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.Mo_Ta}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{material.Duong_Dan_File}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Bài giảng:</span>
                    <span className="truncate">{material.Bai_Giang}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Môn học:</span>
                    <span className="truncate">{material.Mon_Hoc}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Ngày upload:</span>
                    <span>{material.Ngay_Upload}</span>
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {/* TODO: Xử lý tải xuống */}}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:from-blue-600 hover:to-indigo-600 transition duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy tài liệu</h3>
            <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc thêm tài liệu mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials; 