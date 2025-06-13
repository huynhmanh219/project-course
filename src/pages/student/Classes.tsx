import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { BookOpen, User2, Info, CheckCircle, XCircle, GraduationCap } from "lucide-react";

const initialClasses = [
  {
    id: 1,
    tenLop: "Lớp Toán 10A",
    tenKhoaHoc: "Toán 10",
    giangVien: "Nguyễn Văn A",
    moTa: "Lớp học Toán nâng cao cho học sinh lớp 10",
    trangThai: true,
  },
  {
    id: 2,
    tenLop: "Lớp Văn 11B",
    tenKhoaHoc: "Ngữ Văn 11",
    giangVien: "Trần Thị B",
    moTa: "Lớp học Văn dành cho học sinh lớp 11",
    trangThai: true,
  },
  {
    id: 3,
    tenLop: "Lớp Lý 12C",
    tenKhoaHoc: "Vật Lý 12",
    giangVien: "Lê Văn C",
    moTa: "Lớp học Vật Lý chuyên sâu lớp 12",
    trangThai: false,
  },
];

const StudentClasses: React.FC = () => {
  const navigate = useNavigate();

  const ClassCard: React.FC<{ cls: any }> = ({ cls }) => {
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/student/classes/${cls.id}`)}
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
                  {cls.tenLop}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    cls.trangThai 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {cls.trangThai ? (
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
                <User2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium">{cls.giangVien}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>{cls.tenKhoaHoc}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {cls.moTa}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/student/classes/${cls.id}`);
                }}
                disabled={!cls.trangThai}
              >
                {cls.trangThai ? "Vào lớp" : "Lớp đã khóa"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const activeCount = initialClasses.filter(cls => cls.trangThai).length;
  const inactiveCount = initialClasses.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Danh sách lớp học</h1>
                <p className="text-blue-100 text-lg">Khám phá và theo dõi tiến độ học tập của bạn</p>
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
                  <div className="text-2xl font-bold">{initialClasses.length}</div>
                  <div className="text-blue-100 text-sm">Tổng số lớp</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {initialClasses.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>

        {/* Empty State */}
        {initialClasses.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
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

export default StudentClasses; 