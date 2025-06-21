import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Edit, Trash2, CheckCircle, XCircle, Plus, Info, Calendar, GraduationCap, User2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

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

const ClassManagement: React.FC = () => {
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

  const ClassCard: React.FC<{ cls: any }> = ({ cls }) => {
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
                <Users className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {cls.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    cls.status 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {cls.status ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Đã khóa
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Class Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">{courseOptions.find(c => c.id === cls.courseId)?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{teacherOptions.find(t => t.id === cls.teacherId)?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>{cls.createdAt}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {cls.description}
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
                  navigate(`/teacher/my-classes/edit/${cls.id}`);
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
                  handleDelete(cls.id);
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

  const activeCount = classes.filter(cls => cls.status).length;
  const inactiveCount = classes.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý lớp học phần</h1>
                <p className="text-blue-100 text-lg">Tạo, chỉnh sửa, xóa và quản lý các lớp học</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <div className="text-blue-100 text-sm">Đang hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveCount}</div>
                  <div className="text-blue-100 text-sm">Đã khóa</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <div className="text-blue-100 text-sm">Tổng lớp học</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/my-classes/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm lớp học
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có lớp học nào
              </h3>
              <p className="text-gray-500">
                Các lớp học sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement; 