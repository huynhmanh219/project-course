import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Eye, Calendar, BookOpen, AlertCircle, Clock, Trophy, Target, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { authService } from '../../../services/auth.service';
import { simpleQuizService } from '../../../services/quiz.service.simple';

const QuizHistory: React.FC = () => {
  const navigate = useNavigate();
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      const response = await simpleQuizService.getMyAttempts({
        page: 1,
        size: 100, 
        status: 'submitted' 
      });
      
      if (response && response.results) {
        const processedHistory = response.results.map((submission: any) => ({
          id: submission.id,
          quizId: submission.quiz_id,
          tenBaiKiemTra: submission.quiz?.title || 'Bài kiểm tra',
          lopHoc: submission.quiz?.subject?.subject_name || 'Chưa xác định',
          ngayLam: submission.submitted_at || submission.created_at,
          diem: parseFloat(submission.score || 0),
          diemToiDa: parseFloat(submission.max_score || submission.quiz?.total_points || 100),
          thoiGianLam: Math.floor((submission.time_spent || 0) / 60), 
          trangThai: submission.status,
          percentage: parseFloat(submission.percentage || 0),
          passed: submission.passed,
          grade: submission.grade,
          time_spent_formatted: submission.time_spent_formatted
        }));
        
        setHistory(processedHistory);
      } else {
        setHistory([]);
      }
    } catch (error: any) {
      setError('Không thể tải lịch sử làm bài');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-700">Giỏi</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-700">Khá</Badge>;
    if (percentage >= 40) return <Badge className="bg-orange-100 text-orange-700">Trung bình</Badge>;
    return <Badge className="bg-red-100 text-red-700">Cần cải thiện</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-600">
                Xem lại các bài kiểm tra đã hoàn thành 
                {user && ` - ${user.userName || user.email}`}
              </p>
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
                  onClick={loadQuizHistory}
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

        {/* History List */}
        <div className="space-y-4">
          {history.map((item) => {
            const dateTime = formatDateTime(item.ngayLam);
            const isPassed = item.percentage >= 60;
            
            return (
              <Card key={item.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-1 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.tenBaiKiemTra}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">{item.lopHoc}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className={`text-3xl font-bold ${getScoreColor(item.percentage)}`}>
                              {item.diem.toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-lg">/{item.diemToiDa}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`text-sm font-medium ${getScoreColor(item.percentage)}`}>
                              {item.percentage.toFixed(1)}%
                            </div>
                            {getScoreBadge(item.percentage)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{dateTime.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{dateTime.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <History className="w-4 h-4 text-gray-400" />
                          <span>{item.time_spent_formatted || `${item.thoiGianLam} phút`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium">Đạt</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium">Chưa đạt</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => navigate(`/student/quiz/${item.quizId}/result/${item.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {history.length === 0 && !loading && (
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
        {history.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">Thống kê tổng quan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="rounded-lg bg-white/20 p-4">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                    <div className="text-3xl font-bold">
                      {history.length}
                    </div>
                    <div className="text-sm text-white/80">Bài đã làm</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="rounded-lg bg-white/20 p-4">
                    <Target className="w-8 h-8 mx-auto mb-2 text-green-300" />
                    <div className="text-3xl font-bold">
                      {(history.reduce((sum, item) => sum + item.percentage, 0) / history.length).toFixed(1)}%
                    </div>
                    <div className="text-sm text-white/80">TB phần trăm</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="rounded-lg bg-white/20 p-4">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
                    <div className="text-3xl font-bold">
                      {history.filter(item => item.percentage >= 60).length}
                    </div>
                    <div className="text-sm text-white/80">Bài đạt</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="rounded-lg bg-white/20 p-4">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-orange-300" />
                    <div className="text-3xl font-bold">
                      {Math.round(history.reduce((sum, item) => sum + item.thoiGianLam, 0) / history.length)}
                    </div>
                    <div className="text-sm text-white/80">TB thời gian (phút)</div>
                  </div>
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