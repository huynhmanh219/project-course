import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, BookOpen, FileText, Layers, Search, Hash, Calendar, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

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

  const [searchTerm, setSearchTerm] = useState('');

  const filteredChapters = chapters.filter(chapter =>
    chapter.Ten_Chuong.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.Mo_Ta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteChapter = (id: number) => {
    const chapter = chapters.find(c => c.ID === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa chương "${chapter?.Ten_Chuong}" không?\n\nHành động này sẽ xóa tất cả bài giảng trong chương và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setChapters(chapters.filter(c => c.ID !== id));
      alert("Đã xóa chương thành công!");
    }
  };

  const ChapterCard: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
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
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {chapter.Ten_Chuong}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    <Hash className="w-3 h-3 mr-1" />
                    Chương {chapter.Thu_Tu}
                  </span>
                </div>
              </div>
            </div>

            {/* Chapter Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">Bài giảng #{chapter.Bai_Giang_ID}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-2">
                {chapter.Mo_Ta}
              </p>
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                {chapter.Noi_Dung}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teacher/chapters/edit/${chapter.ID}`);
                }}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChapter(chapter.ID);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý chương</h1>
                <p className="text-blue-100 text-lg">Tạo, chỉnh sửa và quản lý các chương trong bài giảng</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{chapters.length}</div>
                  <div className="text-blue-100 text-sm">Tổng chương</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-blue-100 text-sm">Bài giảng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-blue-100 text-sm">Tài liệu</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/chapters/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm chương
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm chương..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredChapters.map((chapter) => (
            <ChapterCard key={chapter.ID} chapter={chapter} />
          ))}
        </div>

        {/* Empty State */}
        {filteredChapters.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? "Không tìm thấy chương nào" : "Chưa có chương nào"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Các chương sẽ xuất hiện ở đây"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterManagement; 