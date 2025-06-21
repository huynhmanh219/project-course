import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen, Calendar, Hash, FileText, Clock, User, Eye, Download, Share2, Bookmark, GraduationCap, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

interface Lecture {
  id: number;
  Ten_Bai_Giang: string;
  Mo_Ta: string;
  Thu_Tu: number;
  Noi_Dung: string;
  Mon_Hoc_ID: number;
  Ngay_Tao: string;
  Ngay_Cap_Nhat?: string;
  Tac_Gia?: string;
  Thoi_Luong?: number;
  Luot_Xem?: number;
  Trang_Thai?: string;
}

const monHocList = [
  { id: 1, ten: 'Toán cao cấp', ma: 'MATH101' },
  { id: 2, ten: 'Lập trình Web', ma: 'CS201' },
  { id: 3, ten: 'Cơ sở dữ liệu', ma: 'CS301' },
];

const LectureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // TODO: Gọi API lấy thông tin bài giảng theo id
    // Giả lập dữ liệu
    setLecture({
      id: Number(id),
      Ten_Bai_Giang: "Giới thiệu về Toán cao cấp - Khái niệm cơ bản",
      Mo_Ta: "Bài giảng đầu tiên về Toán cao cấp, giới thiệu các khái niệm cơ bản và tầm quan trọng của môn học trong việc ứng dụng vào thực tế.",
      Thu_Tu: 1,
      Noi_Dung: `# Giới thiệu về Toán cao cấp

## 1. Tổng quan về môn học
Toán cao cấp là một môn học quan trọng trong chương trình đào tạo kỹ sư...

## 2. Các khái niệm cơ bản
### 2.1 Giới hạn
Khái niệm giới hạn là nền tảng của toán cao cấp...

### 2.2 Đạo hàm
Đạo hàm biểu thị tốc độ thay đổi của hàm số...

## 3. Ứng dụng thực tế
- Tính toán trong kỹ thuật
- Mô hình hóa các hiện tượng tự nhiên
- Tối ưu hóa các bài toán kinh tế`,
      Mon_Hoc_ID: 1,
      Ngay_Tao: "2024-03-15",
      Ngay_Cap_Nhat: "2024-03-20",
      Tac_Gia: "TS. Nguyễn Văn A",
      Thoi_Luong: 90,
      Luot_Xem: 1250,
      Trang_Thai: "Đã xuất bản"
    });
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã xuất bản':
        return 'bg-green-100 text-green-800';
      case 'Bản nháp':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đang xem xét':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!lecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const monHoc = monHocList.find(mh => mh.id === lecture.Mon_Hoc_ID);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/teacher/lectures')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-3">Chi tiết bài giảng</h1>
                  <p className="text-blue-100 text-lg">Quản lý và xem nội dung bài giảng</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{lecture.Luot_Xem?.toLocaleString()}</div>
                  <div className="text-blue-100 text-sm">Lượt xem</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{lecture.Thoi_Luong}</div>
                  <div className="text-blue-100 text-sm">Phút</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">#{lecture.Thu_Tu}</div>
                  <div className="text-blue-100 text-sm">Thứ tự</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate(`/teacher/lectures/edit/${lecture.id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture Info Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                    <BookOpen className="text-white w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(lecture.Trang_Thai || '')}`}>
                        {lecture.Trang_Thai}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Bài {lecture.Thu_Tu}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{lecture.Ten_Bai_Giang}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{lecture.Mo_Ta}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                  <Button
                    // variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`${
                      isBookmarked 
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' 
                        : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Đã lưu' : 'Lưu'}
                  </Button>
                  <Button variant="default" size="sm" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem trước
                  </Button>
                  <Button variant="default" size="sm" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                    <Download className="w-4 h-4 mr-2" />
                    Tải PDF
                  </Button>
                  <Button variant="default" size="sm" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-gradient-to-tr from-green-500 to-emerald-500 p-3 shadow-lg">
                    <FileText className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Nội dung bài giảng</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                    {lecture.Noi_Dung}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 shadow-lg">
                    <GraduationCap className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thông tin môn học</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Tên môn học</p>
                    <p className="text-gray-800 font-bold">{monHoc?.ten}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Mã môn học</p>
                    <p className="text-gray-800 font-bold">{monHoc?.ma}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author and Dates Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 p-2 shadow-lg">
                    <User className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thông tin khác</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                    <User className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tác giả</p>
                      <p className="font-semibold text-gray-800">{lecture.Tac_Gia}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày tạo</p>
                      <p className="font-semibold text-gray-800">{formatDate(lecture.Ngay_Tao)}</p>
                    </div>
                  </div>
                  {lecture.Ngay_Cap_Nhat && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                        <p className="font-semibold text-gray-800">{formatDate(lecture.Ngay_Cap_Nhat)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-2 shadow-lg">
                    <Star className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thống kê</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">{lecture.Luot_Xem?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Lượt xem</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">{lecture.Thoi_Luong}</p>
                    <p className="text-xs text-gray-600">Phút</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetail; 