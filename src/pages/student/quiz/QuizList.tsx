import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { authService } from '../../../services/auth.service';
import { simpleQuizService } from '../../../services/quiz.service.simple';

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
      const response = await simpleQuizService.getQuizzes();
      
      if (response && (response.results || response.data)) {
        const quizData = response.results || response.data;
        
        // Process quiz data and check attempt status for each quiz
        const processedQuizzes = await Promise.all(
          quizData.map(async (quiz: any) => {
            const now = new Date();
            const startDate = quiz.start_time ? new Date(quiz.start_time) : null;
            const endDate = quiz.end_time ? new Date(quiz.end_time) : null;
            
            let status = 'available';
            let hasInProgress = false;
            let hasCompleted = false;
            let questionCount = quiz.question_count || quiz.total_questions || 0;
            
            // Try to fetch question count separately if not available
            if (questionCount === 0) {
              try {
                const quizId = quiz.quiz_id || quiz.id;
                const questionsResponse = await simpleQuizService.getQuizQuestions(quizId, false);
                if (questionsResponse && questionsResponse.length) {
                  questionCount = questionsResponse.length;
                }
              } catch (questionError) {
                // Silently continue if question count fetch fails
              }
            }
            
            // Check time-based availability first
            if (startDate && now < startDate) {
              status = 'upcoming';
            } else if (endDate && now > endDate) {
              status = 'expired';
            } else if (quiz.status !== 'published') {
              status = 'upcoming';
            }
            
            // Check student's attempt status for this quiz using proper API
            try {
              const quizId = quiz.quiz_id || quiz.id;
              
              let allAttemptsResponse;
              
              // Try main API first, then fallback to direct debug route
              try {
                allAttemptsResponse = await simpleQuizService.getMyAttempts({
                  quiz_id: quizId,
                  page: 1,
                  size: 20 // Use size parameter which is now supported
                });
              } catch (mainApiError) {
                console.warn(`Main API failed for quiz ${quizId}, trying debug route:`, mainApiError);
                
                // Fallback to debug route - completely bypass middleware
                try {
                  const response = await fetch(`http://localhost:3000/api/debug-direct?quiz_id=${quizId}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  const result = await response.json();
                  if (result.success) {
                    allAttemptsResponse = { data: result.data };
                  } else {
                    allAttemptsResponse = { data: [] };
                  }
                } catch (debugError) {
                  console.error(`Debug route also failed for quiz ${quizId}:`, debugError);
                  allAttemptsResponse = { data: [] }; // Continue with empty data
                }
              }
              
              // handleResponse unwraps the data, so allAttemptsResponse is the pagination object
              // which contains results/data field with the actual attempts array
              if (allAttemptsResponse && (allAttemptsResponse.results || allAttemptsResponse.data)) {
                const attempts = allAttemptsResponse.results || allAttemptsResponse.data;
                
                if (attempts.length > 0) {
                  // Check for completed attempts (submitted or graded)
                  const completedAttempts = attempts.filter((attempt: any) => 
                    attempt.status === 'submitted' || attempt.status === 'graded'
                  );
                  
                  // Check for in-progress attempts
                  const inProgressAttempts = attempts.filter((attempt: any) => 
                    attempt.status === 'in_progress'
                  );
                  
                  hasCompleted = completedAttempts.length > 0;
                  hasInProgress = inProgressAttempts.length > 0;
                  
                  const validAttempts = attempts.filter((attempt: any) => 
                    ['in_progress', 'submitted', 'graded'].includes(attempt.status)
                  );
                  
                  // FIXED: Prioritize completed status over in-progress
                  // Only show in-progress if there are NO completed attempts
                  if (hasCompleted) {
                    // If has any completed attempts, show as completed
                    status = 'completed';
                  } else if (hasInProgress) {
                    // Only show in-progress if no completed attempts exist
                    status = 'in_progress';
                  } else if (validAttempts.length >= (quiz.attempts_allowed || 3)) {
                    status = 'completed';    // Max attempts reached, show results only
                  }
                  
                  // If no completed/in-progress but has other attempts, keep 'available'
                }
              }
            } catch (attemptError) {
              console.error(`Error checking attempts for quiz ${quiz.quiz_id || quiz.id}:`, attemptError);
              // Continue without attempt info if API fails
            }

            return {
              id: quiz.quiz_id || quiz.id,
              tenBaiKiemTra: quiz.title || quiz.quiz_title || 'Bài kiểm tra',
              moTa: quiz.description || quiz.instructions || '',
              thoiGianLamBai: quiz.duration || quiz.time_limit || 60,
              soCauHoi: questionCount,
              ngayBatDau: quiz.start_time || new Date().toISOString(),
              ngayKetThuc: quiz.end_time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              trangThai: status,
              lopHoc: quiz.courseSection?.section_name || quiz.subject?.subject_name || 
                     quiz.course_section_name || quiz.courseSectionName || quiz.course_name || quiz.courseName || 
                     quiz.subject_name || quiz.subjectName || quiz.class_code || quiz.classCode || 
                     quiz.class_name || quiz.className || quiz.section_name || quiz.sectionName || 
                     quiz.course?.name || quiz.subject?.name || quiz.courseSection?.name || 'Chưa xác định',
              diemToiDa: quiz.max_score || quiz.total_marks || quiz.total_points || questionCount || 10,
              isPublished: quiz.status === 'published',
              hasInProgress,
              hasCompleted
            };
          })
        );

        // Only show published quizzes to students
        const publishedQuizzes = processedQuizzes.filter((quiz: any) => quiz.isPublished);
        setQuizzes(publishedQuizzes);
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
        return <Badge className="bg-purple-100 text-purple-700">Đã hoàn thành</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-700">Đang làm</Badge>;
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
                    {quizzes.filter(q => q.trangThai === 'in_progress').length}
                  </div>
                  <div className="text-yellow-100 text-sm">Đang làm</div>
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
                      ) : quiz.trangThai === 'in_progress' ? (
                        <Button
                          onClick={() => navigate(`/student/quiz/${quiz.id}/take`)}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Tiếp tục làm bài
                        </Button>
                      ) : quiz.trangThai === 'upcoming' ? (
                        <Button disabled className="w-full" variant="outline">
                          <Clock className="w-4 h-4 mr-2" />
                          Chưa đến giờ làm bài
                        </Button>
                      ) : quiz.trangThai === 'completed' ? (
                        <div className="space-y-2">
                          <Button
                            onClick={() => navigate(`/student/quiz/${quiz.id}/result`)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Xem kết quả
                          </Button>
                          {/* Optionally allow retake if quiz allows multiple attempts */}
                        </div>
                      ) : (
                        <Button disabled className="w-full" variant="outline">
                          <AlertCircle className="w-4 h-4 mr-2" />
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
              {/* <Button
                variant="outline"
                onClick={() => navigate('/student/quiz/history')}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Xem lịch sử
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizList; 