import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { authService } from '../../../services/auth.service';
import SimpleQuizService from '../../../services/quiz.service.simple';

const QuizList: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Fetch available quizzes
      console.log('Fetching quizzes...');
      const response = await SimpleQuizService.getQuizzes();
      console.log('Quizzes response:', response);
      
      if (response && response.data) {
        // Process quiz data and determine status
        const processedQuizzes = response.data.map((quiz: any) => {
          const now = new Date();
          const startDate = quiz.start_time ? new Date(quiz.start_time) : null;
          const endDate = quiz.end_time ? new Date(quiz.end_time) : null;
          
          let status = 'available';
          if (startDate && now < startDate) {
            status = 'upcoming';
          } else if (endDate && now > endDate) {
            status = 'expired';
          } else if (quiz.status === 'draft') {
            status = 'upcoming';
          }

          return {
            id: quiz.quiz_id || quiz.id,
            tenBaiKiemTra: quiz.title || quiz.quiz_title || 'Bài kiểm tra',
            moTa: quiz.description || quiz.instructions || '',
            thoiGianLamBai: quiz.duration || quiz.time_limit || 60,
            soCauHoi: quiz.question_count || quiz.total_questions || 0,
            ngayBatDau: quiz.start_time || new Date().toISOString(),
            ngayKetThuc: quiz.end_time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            trangThai: status,
            lopHoc: quiz.subject_name || quiz.class_name || 'Chưa xác định',
            diemToiDa: quiz.max_score || quiz.total_marks || quiz.soCauHoi || 10,
            isPublished: quiz.status === 'published'
          };
        }).filter((quiz: any) => quiz.isPublished); // Only show published quizzes to students

        setQuizzes(processedQuizzes);
      } else {
        setQuizzes([]);
      }
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      setError('Không thể tải danh sách bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách bài kiểm tra...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-blue-100 text-lg mt-1">
                  Chào mừng {user?.userName || user?.email}, danh sách các bài kiểm tra của bạn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
                <Button 
                  onClick={fetchQuizzes}
                  variant="outline"
                  size="sm"
                  className="ml-auto border-red-300 text-red-700 hover:bg-red-100"
                >
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 opacity-80" />
                <div>
                  <div className="text-2xl font-bold">{quizzes.length}</div>
                  <div className="text-blue-100 text-sm">Tổng bài kiểm tra</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 opacity-80" />
                <div>
                  <div className="text-2xl font-bold">
                    {quizzes.filter(q => q.trangThai === 'available').length}
                  </div>
                  <div className="text-green-100 text-sm">Có thể làm</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 opacity-80" />
                <div>
                  <div className="text-2xl font-bold">
                    {quizzes.filter(q => q.trangThai === 'upcoming').length}
                  </div>
                  <div className="text-yellow-100 text-sm">Sắp diễn ra</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 opacity-80" />
                <div>
                  <div className="text-2xl font-bold">
                    {quizzes.filter(q => q.trangThai === 'completed').length}
                  </div>
                  <div className="text-purple-100 text-sm">Đã hoàn thành</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Grid */}
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
                          {quiz.tenBaiKiemTra}
                        </h3>
                        <p className="text-sm text-blue-600">{quiz.lopHoc}</p>
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
                          Làm bài ngay
                        </Button>
                      ) : quiz.trangThai === 'upcoming' ? (
                        <Button disabled className="w-full" variant="outline">
                          <Clock className="w-4 h-4 mr-2" />
                          Chưa đến giờ làm bài
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
                          Hết thời gian làm bài
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài kiểm tra nào</h3>
              <p className="text-gray-600 mb-4">
                Hiện tại chưa có bài kiểm tra nào được giao cho bạn hoặc chưa có bài kiểm tra nào được xuất bản.
              </p>
              <Button onClick={fetchQuizzes} variant="outline">
                Làm mới danh sách
              </Button>
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
                  <p className="text-sm text-blue-700">Xem lại các bài kiểm tra đã hoàn thành và kết quả</p>
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