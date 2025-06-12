import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Search, Calendar, User2, GraduationCap, ArrowUpDown, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

// Danh sách khoá học mẫu
const sampleCourses = [
  {
    ID: 1,
    Ten_Khoa_Hoc: "Lập trình Web",
    Mo_Ta: "Khóa học về HTML, CSS, JavaScript và framework hiện đại.",
    Giang_Vien_ID: 1,
    Ngay_Bat_Dau: "2024-06-01",
    Ngay_Ket_Thuc: "2024-08-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Nguyễn Văn A" },
    tien_do: { Hoan_Thanh: false, phan_tram: 75 },
  },
  {
    ID: 2,
    Ten_Khoa_Hoc: "Toán Cao Cấp",
    Mo_Ta: "Giải tích, đại số tuyến tính và ứng dụng.",
    Giang_Vien_ID: 2,
    Ngay_Bat_Dau: "2024-07-01",
    Ngay_Ket_Thuc: "2024-09-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Trần Thị B" },
    tien_do: { Hoan_Thanh: false, phan_tram: 40 },
  },
  {
    ID: 3,
    Ten_Khoa_Hoc: "Kỹ năng mềm",
    Mo_Ta: "Phát triển kỹ năng giao tiếp, làm việc nhóm, thuyết trình.",
    Giang_Vien_ID: 3,
    Ngay_Bat_Dau: "2024-05-15",
    Ngay_Ket_Thuc: "2024-07-15",
    Trang_Thai: false,
    giang_vien: { Ho_Ten: "Lê Văn C" },
    tien_do: { Hoan_Thanh: true, phan_tram: 100 },
  },
];

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses] = useState(sampleCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (value: string) => {
    if (value === sortBy) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const sortedAndFilteredCourses = React.useMemo(() => {
    return courses
      .filter(course => 
        course.Ten_Khoa_Hoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Mo_Ta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.giang_vien?.Ho_Ten.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'name':
            return multiplier * a.Ten_Khoa_Hoc.localeCompare(b.Ten_Khoa_Hoc);
          case 'date':
            return multiplier * (new Date(a.Ngay_Bat_Dau).getTime() - new Date(b.Ngay_Bat_Dau).getTime());
          case 'progress':
            return multiplier * ((a.tien_do?.phan_tram || 0) - (b.tien_do?.phan_tram || 0));
          default:
            return 0;
        }
      });
  }, [courses, searchTerm, sortBy, sortOrder]);

  const getStatusInfo = (course: any) => {
    if (!course.Trang_Thai) return { label: 'Đã đóng', variant: 'destructive' };
    if (course.tien_do?.Hoan_Thanh) return { label: 'Đã hoàn thành', variant: 'success' };
    const now = new Date();
    const startDate = new Date(course.Ngay_Bat_Dau);
    const endDate = new Date(course.Ngay_Ket_Thuc);
    if (now < startDate) return { label: 'Sắp diễn ra', variant: 'secondary' };
    if (now > endDate) return { label: 'Đã kết thúc', variant: 'destructive' };
    return { label: 'Đang diễn ra', variant: 'default' };
  };

  const CourseCard: React.FC<{ course: any }> = ({ course }) => {
    const status = getStatusInfo(course);
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50 group-hover:scale-[1.025] group-hover:shadow-2xl transition-transform duration-200 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/course/${course.ID}`)}
        >
          {/* Header gradient bar & icon */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10" />
          <div className="flex items-center gap-3 px-6 pt-6 pb-2">
            <div className="rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-2 shadow-lg">
              <BookOpen className="text-white w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl text-blue-900 flex-1 truncate">
              {course.Ten_Khoa_Hoc}
            </h3>
            {/* <Badge variant={status.variant as any} className="ml-2 text-xs px-3 py-1 rounded-full font-semibold">
              {status.label}
            </Badge> */}
          </div>
          <CardContent className="flex-1 flex flex-col px-6 pb-6 pt-2">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <User2 className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{course.giang_vien?.Ho_Ten || 'Chưa có giảng viên'}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                {format(new Date(course.Ngay_Bat_Dau), 'dd/MM/yyyy', { locale: vi })} -
                {format(new Date(course.Ngay_Ket_Thuc), 'dd/MM/yyyy', { locale: vi })}
              </span>
            </div>
            <div className="mb-3 text-gray-700 text-sm line-clamp-3 min-h-[48px]">
              {course.Mo_Ta || 'Chưa có mô tả'}
            </div>
            {course.tien_do && (
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Tiến độ</span>
                  <span className="text-xs font-semibold text-blue-700">{course.tien_do.phan_tram}%</span>
                </div>
                <Progress value={course.tien_do.phan_tram} className="h-2 bg-blue-100" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 mb-1">Danh sách khoá học</h1>
            <p className="text-gray-500 text-base">Khám phá các khoá học bạn đã tham gia hoặc có thể học.</p>
          </div>
          {/* <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khoá học..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={handleSort}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">
                  <span className="flex items-center">
                    Tên khoá học
                    {sortBy === 'name' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </span>
                </SelectItem>
                <SelectItem value="date">
                  <span className="flex items-center">
                    Ngày bắt đầu
                    {sortBy === 'date' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </span>
                </SelectItem>
                <SelectItem value="progress">
                  <span className="flex items-center">
                    Tiến độ
                    {sortBy === 'progress' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedAndFilteredCourses.map((course) => (
            <CourseCard key={course.ID} course={course} />
          ))}
        </div>
        {sortedAndFilteredCourses.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
              {searchTerm ? 'Không tìm thấy khoá học phù hợp' : 'Chưa có khoá học nào'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;