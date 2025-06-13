import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Download, Edit, Trash2, Filter, Calendar, BookOpen } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

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

  const MaterialCard: React.FC<{ material: any }> = ({ material }) => {
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {material.Ten_Tai_Lieu}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(material.Loai_Tai_Lieu)}`}>
                    {getTypeLabel(material.Loai_Tai_Lieu)}
                  </span>
                </div>
              </div>
            </div>

            {/* Material Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">{material.Mon_Hoc}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="truncate">{material.Bai_Giang}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>{material.Ngay_Upload}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {material.Mo_Ta}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium"
                onClick={() => {/* TODO: Xử lý tải xuống */}}
              >
                <Download className="w-4 h-4 mr-2" /> Tải xuống
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                  onClick={() => navigate(`/teacher/materials/edit/${material.id}`)}
                >
                  <Edit className="w-3 h-3 mr-1" /> Sửa
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                  onClick={() => {
                    const confirmMessage = `Bạn có chắc chắn muốn xóa tài liệu "${material.Ten_Tai_Lieu}" không?\n\nHành động này không thể hoàn tác.`;
                    
                    if (window.confirm(confirmMessage)) {
                      console.log("Xóa tài liệu có ID:", material.id);
                      alert("Đã xóa tài liệu thành công!");
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const typeCount = (type: number) => materialsList.filter(m => m.Loai_Tai_Lieu === type).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý tài liệu</h1>
                <p className="text-blue-100 text-lg">Tạo, chỉnh sửa, xóa và quản lý các tài liệu học tập</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{typeCount(1)}</div>
                  <div className="text-blue-100 text-sm">Tài liệu</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{typeCount(2)}</div>
                  <div className="text-blue-100 text-sm">Bài tập</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{typeCount(3)}</div>
                  <div className="text-blue-100 text-sm">Đề thi</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/materials/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm tài liệu
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6">
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
        </div> */}

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy tài liệu nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials; 