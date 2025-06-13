import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, User2, GraduationCap, BookOpen, CheckCircle, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";

// Danh sách khoá học mẫu
const sampleCourses = [
  {
    ID: 1,
    Ten_Khoa_Hoc: "Lập trình Web",
    Mo_Ta: "Khóa học về HTML, CSS, JavaScript và framework hiện đại. Học cách xây dựng website responsive và ứng dụng web động.",
    Giang_Vien_ID: 1,
    Ngay_Bat_Dau: "2024-06-01",
    Ngay_Ket_Thuc: "2024-08-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Nguyễn Văn A" },
    completed: true,
  },
  {
    ID: 2,
    Ten_Khoa_Hoc: "Toán Cao Cấp",
    Mo_Ta: "Giải tích, đại số tuyến tính và ứng dụng trong khoa học máy tính. Nền tảng toán học cho lập trình viên.",
    Giang_Vien_ID: 2,
    Ngay_Bat_Dau: "2024-07-01",
    Ngay_Ket_Thuc: "2024-09-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Trần Thị B" },
    completed: false,
  },
  {
    ID: 3,
    Ten_Khoa_Hoc: "Kỹ năng mềm",
    Mo_Ta: "Phát triển kỹ năng giao tiếp, làm việc nhóm, thuyết trình và quản lý thời gian hiệu quả.",
    Giang_Vien_ID: 3,
    Ngay_Bat_Dau: "2024-05-15",
    Ngay_Ket_Thuc: "2024-07-15",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Lê Văn C" },
    completed: true,
  },
  {
    ID: 4,
    Ten_Khoa_Hoc: "Cơ sở dữ liệu",
    Mo_Ta: "Thiết kế và quản lý cơ sở dữ liệu, SQL, NoSQL và các hệ quản trị cơ sở dữ liệu phổ biến.",
    Giang_Vien_ID: 4,
    Ngay_Bat_Dau: "2024-08-01",
    Ngay_Ket_Thuc: "2024-10-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Phạm Văn D" },
    completed: false,
  },
  {
    ID: 5,
    Ten_Khoa_Hoc: "Mạng máy tính",
    Mo_Ta: "Kiến thức về mạng máy tính, giao thức TCP/IP, bảo mật mạng và quản trị hệ thống mạng.",
    Giang_Vien_ID: 5,
    Ngay_Bat_Dau: "2024-09-01",
    Ngay_Ket_Thuc: "2024-11-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Hoàng Thị E" },
    completed: false,
  },
  {
    ID: 6,
    Ten_Khoa_Hoc: "Trí tuệ nhân tạo",
    Mo_Ta: "Giới thiệu về AI, machine learning, deep learning và các ứng dụng thực tế trong cuộc sống.",
    Giang_Vien_ID: 6,
    Ngay_Bat_Dau: "2024-10-01",
    Ngay_Ket_Thuc: "2024-12-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Nguyễn Văn F" },
    completed: false,
  },
];

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses] = useState(sampleCourses);

  const CourseCard: React.FC<{ course: any }> = ({ course }) => {
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/course/${course.ID}`)}
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
                  {course.Ten_Khoa_Hoc}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    course.completed 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {course.completed ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã hoàn thành
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Đang học
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium">{course.giang_vien?.Ho_Ten || 'Chưa có giảng viên'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>
                  {format(new Date(course.Ngay_Bat_Dau), 'dd/MM/yyyy', { locale: vi })} - {format(new Date(course.Ngay_Ket_Thuc), 'dd/MM/yyyy', { locale: vi })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {course.Mo_Ta || 'Chưa có mô tả'}
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
                  navigate(`/course/${course.ID}`);
                }}
              >
                Xem chi tiết
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const completedCount = courses.filter(course => course.completed).length;
  const inProgressCount = courses.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Danh sách môn học</h1>
                <p className="text-blue-100 text-lg">Khám phá và theo dõi tiến độ học tập của bạn</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <div className="text-blue-100 text-sm">Đã hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inProgressCount}</div>
                  <div className="text-blue-100 text-sm">Đang học</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <div className="text-blue-100 text-sm">Tổng số môn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.ID} course={course} />
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có môn học nào
              </h3>
              <p className="text-gray-500">
                Các môn học sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;