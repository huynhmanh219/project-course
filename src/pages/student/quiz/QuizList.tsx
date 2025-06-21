import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

const QuizList: React.FC = () => {
  const navigate = useNavigate();

  // Mock data
  const mockQuizzes = [
    {
      id: 1,
      tenBaiKiemTra: 'Kiểm tra Chương 1 - Giới thiệu Toán cao cấp',
      moTa: 'Bài kiểm tra 15 phút về kiến thức cơ bản',
      thoiGianLamBai: 15,
      soCauHoi: 10,
      ngayBatDau: '2024-01-15T08:00:00',
      ngayKetThuc: '2024-01-15T23:59:59',
      trangThai: 'available',
      lopHoc: 'Toán cao cấp A1'
    },
    {
      id: 2,
      tenBaiKiemTra: 'Bài tập trắc nghiệm Vi phân',
      moTa: 'Kiểm tra giữa kỳ về vi phân',
      thoiGianLamBai: 45,
      soCauHoi: 20,
      ngayBatDau: '2024-01-20T08:00:00',
      ngayKetThuc: '2024-01-20T23:59:59',
      trangThai: 'upcoming',
      lopHoc: 'Toán cao cấp A1'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-700">Có thể làm</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Sắp diễn ra</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">Đã hoàn thành</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700">Hết hạn</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Bài kiểm tra</h1>
                <p className="text-blue-100 text-lg mt-1">Danh sách các bài kiểm tra của bạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {quiz.tenBaiKiemTra}
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">{quiz.lopHoc}</p>
                    </div>
                    {getStatusBadge(quiz.trangThai)}
                  </div>

                  {/* Description */}
                  {quiz.moTa && (
                    <p className="text-gray-700 text-sm line-clamp-2">{quiz.moTa}</p>
                  )}

                  {/* Quiz Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{quiz.soCauHoi} câu</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.thoiGianLamBai} phút</span>
                    </div>
                  </div>

                  {/* Date Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(quiz.ngayBatDau).toLocaleDateString('vi-VN')} - {' '}
                        {new Date(quiz.ngayKetThuc).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {quiz.trangThai === 'available' ? (
                      <Button
                        onClick={() => navigate(`/student/quiz/${quiz.id}/take`)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Làm bài
                      </Button>
                    ) : quiz.trangThai === 'upcoming' ? (
                      <Button disabled className="w-full" variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        Chưa đến giờ
                      </Button>
                    ) : quiz.trangThai === 'completed' ? (
                      <Button
                        onClick={() => navigate(`/student/quiz/${quiz.id}/result`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Xem kết quả
                      </Button>
                    ) : (
                      <Button disabled className="w-full" variant="outline">
                        Hết hạn
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockQuizzes.length === 0 && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài kiểm tra nào</h3>
              <p className="text-gray-600">Hiện tại chưa có bài kiểm tra nào được giao cho bạn</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Lịch sử làm bài</h3>
                  <p className="text-sm text-blue-700">Xem lại các bài kiểm tra đã hoàn thành</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/student/quiz/history')}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Xem lịch sử
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizList; 