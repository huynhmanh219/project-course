import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen, Calendar, Hash, FileText, Clock, User, Eye, Download, Share2, Bookmark } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const monHoc = monHocList.find(mh => mh.id === lecture.Mon_Hoc_ID);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/teacher/lectures')}
              className="p-3 hover:bg-blue-100 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-blue-700">Chi tiết bài giảng</h1>
                <p className="text-blue-600 mt-1">Quản lý nội dung bài giảng</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-all duration-200">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-all duration-200">
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/teacher/lectures/edit/${lecture.id}`)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
            >
              <Edit className="w-5 h-5" /> Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture title and info */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(lecture.Trang_Thai || '')}`}>
                      {lecture.Trang_Thai}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Bài {lecture.Thu_Tu}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-blue-900 mb-3 leading-tight">{lecture.Ten_Bai_Giang}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">{lecture.Mo_Ta}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-2">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{lecture.Luot_Xem?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Lượt xem</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{lecture.Thoi_Luong}</p>
                  <p className="text-sm text-gray-600">Phút</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-2">
                    <Hash className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{lecture.Thu_Tu}</p>
                  <p className="text-sm text-gray-600">Thứ tự</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{monHoc?.ma}</p>
                  <p className="text-sm text-gray-600">Mã môn</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">Nội dung bài giảng</h3>
              </div>
              <div className="prose prose-blue max-w-none">
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                    {lecture.Noi_Dung}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Thông tin môn học</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Tên môn học</p>
                  <p className="text-blue-900 font-bold">{monHoc?.ten}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Mã môn học</p>
                  <p className="text-blue-900 font-bold">{monHoc?.ma}</p>
                </div>
              </div>
            </div>

            {/* Author and dates */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Thông tin khác</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tác giả</p>
                    <p className="font-semibold text-gray-900">{lecture.Tac_Gia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày tạo</p>
                    <p className="font-semibold text-gray-900">{formatDate(lecture.Ngay_Tao)}</p>
                  </div>
                </div>
                {lecture.Ngay_Cap_Nhat && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                      <p className="font-semibold text-gray-900">{formatDate(lecture.Ngay_Cap_Nhat)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-all duration-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-blue-700">Xem trước</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-xl transition-all duration-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-green-700">Tải xuống PDF</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-purple-50 rounded-xl transition-all duration-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Share2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-semibold text-purple-700">Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetail; 