import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Edit, Trash2, Plus, Info, Calendar, GraduationCap, Hash } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

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
      console.log("Xóa bài giảng có ID:", id);
      alert("Đã xóa bài giảng thành công!");
    }
  };

  const LectureCard: React.FC<{ lecture: any }> = ({ lecture }) => {
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/teacher/lectures/${lecture.id}`)}
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
                  {lecture.Ten_Bai_Giang}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    <Hash className="w-3 h-3 mr-1" />
                    Bài {lecture.Thu_Tu}
                  </span>
                </div>
              </div>
            </div>

            {/* Lecture Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">{monHocList.find(mh => mh.id === lecture.Mon_Hoc_ID)?.ten}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>{lecture.Ngay_Tao}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {lecture.Mo_Ta}
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
                  navigate(`/teacher/lectures/edit/${lecture.id}`);
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
                  handleDelete(lecture.id);
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

  const subjectCount = (subjectId: number) => lectures.filter(l => l.Mon_Hoc_ID === subjectId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý bài giảng</h1>
                <p className="text-blue-100 text-lg">Tạo, chỉnh sửa và quản lý các bài giảng</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{subjectCount(1)}</div>
                  <div className="text-blue-100 text-sm">Toán cao cấp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{subjectCount(2)}</div>
                  <div className="text-blue-100 text-sm">Lập trình Web</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{lectures.length}</div>
                  <div className="text-blue-100 text-sm">Tổng bài giảng</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/lectures/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm bài giảng
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {lectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>

        {/* Empty State */}
        {lectures.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có bài giảng nào
              </h3>
              <p className="text-gray-500">
                Các bài giảng sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lectures; 