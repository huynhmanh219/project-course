import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Eye, Calendar, BookOpen } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

const QuizHistory: React.FC = () => {
  const navigate = useNavigate();

  // Mock data
  const mockHistory = [
    {
      id: 1,
      tenBaiKiemTra: 'Kiểm tra Chương 1 - Giới thiệu Toán cao cấp',
      lopHoc: 'Toán cao cấp A1',
      ngayLam: '2024-01-15T14:30:00',
      diem: 8.5,
      diemToiDa: 10,
      thoiGianLam: 12, // minutes
      trangThai: 'completed'
    },
    {
      id: 2,
      tenBaiKiemTra: 'Bài tập trắc nghiệm Đạo hàm',
      lopHoc: 'Toán cao cấp A1',
      ngayLam: '2024-01-10T16:15:00',
      diem: 7.0,
      diemToiDa: 10,
      thoiGianLam: 18,
      trangThai: 'completed'
    }
  ];

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-700">Giỏi</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-700">Khá</Badge>;
    return <Badge className="bg-red-100 text-red-700">Cần cải thiện</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/student/quiz')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Lịch sử làm bài</h1>
              <p className="text-gray-600">Xem lại các bài kiểm tra đã hoàn thành</p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {mockHistory.map((item) => (
            <Card key={item.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.tenBaiKiemTra}
                        </h3>
                        <p className="text-sm text-blue-600">{item.lopHoc}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(item.diem, item.diemToiDa)}`}>
                          {item.diem}/{item.diemToiDa}
                        </div>
                        {getScoreBadge(item.diem, item.diemToiDa)}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.ngayLam).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        <span>Thời gian làm: {item.thoiGianLam} phút</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <Button
                      onClick={() => navigate(`/student/quiz/${item.id}/result`)}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockHistory.length === 0 && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch sử làm bài</h3>
              <p className="text-gray-600 mb-6">Bạn chưa hoàn thành bài kiểm tra nào</p>
              <Button onClick={() => navigate('/student/quiz')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Làm bài kiểm tra đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics Summary */}
        {mockHistory.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockHistory.length}
                  </div>
                  <div className="text-sm text-blue-700">Bài đã làm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(mockHistory.reduce((sum, item) => sum + item.diem, 0) / mockHistory.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-green-700">Điểm trung bình</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.max(...mockHistory.map(item => item.diem))}
                  </div>
                  <div className="text-sm text-purple-700">Điểm cao nhất</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizHistory; 