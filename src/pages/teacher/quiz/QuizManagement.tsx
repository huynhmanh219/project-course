import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Clock,
  Users,
  BookOpen,
  Play,
  Pause,
  Copy,
  FileDown
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

// Mock data
const mockQuizzes = [
  {
    id: 1,
    tenBaiKiemTra: 'Kiểm tra Chương 1 - Giới thiệu Toán cao cấp',
    moTa: 'Bài kiểm tra 15 phút về kiến thức cơ bản',
    soCauHoi: 10,
    thoiGianLamBai: 15,
    diemToiDa: 10,
    trangThaiQuiz: 'published' as const,
    ngayBatDau: '2024-01-15T08:00:00',
    ngayKetThuc: '2024-01-15T23:59:59',
    soSinhVienDaLam: 25,
    tongSoSinhVien: 30,
    lopHoc: { tenLopHoc: 'Toán cao cấp A1' },
    chuong: { tenChuong: 'Chương 1: Giới thiệu' }
  },
  {
    id: 2,
    tenBaiKiemTra: 'Bài tập trắc nghiệm Vi phân',
    moTa: 'Kiểm tra giữa kỳ về vi phân',
    soCauHoi: 20,
    thoiGianLamBai: 45,
    diemToiDa: 20,
    trangThaiQuiz: 'draft' as const,
    ngayBatDau: '2024-01-20T08:00:00',
    ngayKetThuc: '2024-01-20T23:59:59',
    soSinhVienDaLam: 0,
    tongSoSinhVien: 30,
    lopHoc: { tenLopHoc: 'Toán cao cấp A1' },
    chuong: { tenChuong: 'Chương 2: Vi phân' }
  },
  {
    id: 3,
    tenBaiKiemTra: 'Kiểm tra cuối kỳ - Tích phân',
    moTa: 'Đề thi cuối kỳ toàn bộ kiến thức',
    soCauHoi: 30,
    thoiGianLamBai: 90,
    diemToiDa: 30,
    trangThaiQuiz: 'closed' as const,
    ngayBatDau: '2024-01-10T08:00:00',
    ngayKetThuc: '2024-01-10T23:59:59',
    soSinhVienDaLam: 28,
    tongSoSinhVien: 30,
    lopHoc: { tenLopHoc: 'Toán cao cấp A1' },
    chuong: { tenChuong: 'Chương 3: Tích phân' }
  }
];

const QuizManagement: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Nháp</Badge>;
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-700">Đã xuất bản</Badge>;
      case 'closed':
        return <Badge variant="destructive" className="bg-red-100 text-red-700">Đã đóng</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getProgressPercentage = (daLam: number, tongSo: number) => {
    return tongSo > 0 ? Math.round((daLam / tongSo) * 100) : 0;
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.tenBaiKiemTra.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.lopHoc?.tenLopHoc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quiz.trangThaiQuiz === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePublishQuiz = (quizId: number) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId ? { ...quiz, trangThaiQuiz: 'published' as const } : quiz
    ));
  };

  const handleCloseQuiz = (quizId: number) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId ? { ...quiz, trangThaiQuiz: 'closed' as const } : quiz
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/20 p-3">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Quản lý bài kiểm tra</h1>
                  <p className="text-blue-100 text-lg mt-1">Tạo và quản lý các bài kiểm tra trắc nghiệm</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/teacher/quiz/add')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 px-6 py-3 text-lg font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo bài kiểm tra
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'draft', 'published', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'Tất cả' :
                     status === 'draft' ? 'Nháp' :
                     status === 'published' ? 'Đã xuất bản' : 'Đã đóng'}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {quiz.tenBaiKiemTra}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{quiz.lopHoc?.tenLopHoc}</p>
                      <p className="text-sm text-blue-600">{quiz.chuong?.tenChuong}</p>
                    </div>
                    {getStatusBadge(quiz.trangThaiQuiz)}
                  </div>

                  {/* Description */}
                  {quiz.moTa && (
                    <p className="text-gray-700 text-sm line-clamp-2">{quiz.moTa}</p>
                  )}

                  {/* Quiz Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{quiz.soCauHoi} câu hỏi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.thoiGianLamBai} phút</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BarChart3 className="w-4 h-4" />
                      <span>{quiz.diemToiDa} điểm</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{quiz.soSinhVienDaLam}/{quiz.tongSoSinhVien}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {quiz.trangThaiQuiz === 'published' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiến độ làm bài</span>
                        <span className="font-medium">{getProgressPercentage(quiz.soSinhVienDaLam, quiz.tongSoSinhVien)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(quiz.soSinhVienDaLam, quiz.tongSoSinhVien)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => navigate(`/teacher/quiz/${quiz.id}`)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => navigate(`/teacher/quiz/${quiz.id}/edit`)}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                    {quiz.trangThaiQuiz === 'published' && (
                      <button 
                        onClick={() => navigate(`/teacher/quiz/${quiz.id}/results`)}
                        className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Kết quả
                      </button>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {quiz.trangThaiQuiz === 'draft' && (
                      <button
                        onClick={() => handlePublishQuiz(quiz.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Xuất bản
                      </button>
                    )}
                    {quiz.trangThaiQuiz === 'published' && (
                      <button
                        onClick={() => handleCloseQuiz(quiz.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        Đóng bài thi
                      </button>
                    )}
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài kiểm tra nào</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Không tìm thấy bài kiểm tra phù hợp với tiêu chí tìm kiếm'
                  : 'Hãy tạo bài kiểm tra đầu tiên của bạn'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button
                  onClick={() => navigate('/teacher/quiz/add')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo bài kiểm tra đầu tiên
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizManagement; 