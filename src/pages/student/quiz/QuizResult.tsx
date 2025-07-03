import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  Trophy,
  AlertCircle,
  BarChart3,
  Target,
  Award,
  Calendar,
  FileText,
  User
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { simpleQuizService } from '../../../services/quiz.service.simple';

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const { quizId, submissionId } = useParams();
  
  const [result, setResult] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quizId) {
      loadQuizResult();
    }
  }, [quizId, submissionId]);

  const loadQuizResult = async () => {
    try {
      setLoading(true);
      setError('');

      if (!quizId) {
        setError('ID bài kiểm tra không hợp lệ');
        return;
      }

      const quizResponse = await simpleQuizService.getQuiz(parseInt(quizId!));
      
      if (quizResponse && (quizResponse.id || quizResponse.quiz_id || quizResponse.data)) {
        const data = quizResponse.data || quizResponse;
        
        setQuiz({
          id: data.quiz_id || data.id,
          title: data.title || data.quiz_title,
          description: data.description,
          duration: data.duration || data.time_limit,
          totalQuestions: data.question_count || data.total_questions,
          maxScore: data.max_score || data.total_marks
        });
      }

      if (submissionId) {
        try {
          const resultResponse = await simpleQuizService.getAttemptResult(parseInt(submissionId));
          
          if (resultResponse && (resultResponse.score !== undefined || resultResponse.data)) {
            const data = resultResponse.data || resultResponse;
            
            const correctAnswers = data.responses?.filter((r: any) => r.is_correct === true || r.is_correct === 1).length || 0;
            const totalQuestions = data.responses?.length || 0;
            
            const score = parseFloat(data.score || 0);
            const maxScore = parseFloat(data.max_score || 10);
            const percentage = maxScore > 0 ? (score / maxScore * 100) : parseFloat(data.percentage || 0);
            
            if (totalQuestions === 0) {
              try {
                const attemptsResponse = await fetch(`http://localhost:3000/api/debug-direct?quiz_id=${quizId}`, {
                  headers: { 'Content-Type': 'application/json' }
                });
                
                const attemptsResult = await attemptsResponse.json();
                if (attemptsResult.success && attemptsResult.data.length > 0) {
                  const validSubmissions = attemptsResult.data.filter((s: any) => 
                    s.status === 'submitted' && parseFloat(s.score || 0) > 0
                  );
                  
                  if (validSubmissions.length > 0) {
                    const bestSubmission = validSubmissions.reduce((best: any, current: any) => 
                      parseFloat(current.score || 0) > parseFloat(best.score || 0) ? current : best
                    );
                    
                    const betterResponse = await simpleQuizService.getAttemptResult(bestSubmission.id);
                    if (betterResponse && (betterResponse.score !== undefined || betterResponse.data)) {
                      const betterData = betterResponse.data || betterResponse;
                      const betterCorrectAnswers = betterData.responses?.filter((r: any) => r.is_correct === true || r.is_correct === 1).length || 0;
                      const betterTotalQuestions = betterData.responses?.length || 0;
                      
                      setResult({
                        submissionId: betterData.id || bestSubmission.id,
                        score: parseFloat(betterData.score || 0),
                        maxScore: parseFloat(betterData.max_score || 10),
                        correctAnswers: betterCorrectAnswers,
                        totalQuestions: betterTotalQuestions > 0 ? betterTotalQuestions : Math.ceil(parseFloat(betterData.max_score || 10)),
                        timeTaken: betterData.time_spent || 0,
                        submittedAt: betterData.submitted_at || betterData.createdAt,
                        percentage: parseFloat(betterData.percentage || 0),
                        answers: betterData.responses || [],
                        questions: betterData.quiz?.questions || [],
                        quiz: betterData.quiz
                      });
                      
                      return; // Exit early
                    }
                  }
                }
              } catch (searchError) {
                console.error('Error searching for better submission:', searchError);
              }
            }
            
            setResult({
              submissionId: data.id || submissionId,
              score: score,
              maxScore: maxScore,
              correctAnswers: correctAnswers,
              totalQuestions: totalQuestions > 0 ? totalQuestions : Math.ceil(maxScore),
              timeTaken: data.time_spent || 0,
              submittedAt: data.submitted_at || data.createdAt,
              percentage: percentage,
              answers: data.responses || [],
              questions: data.quiz?.questions || [],
              quiz: data.quiz
            });
          }
        } catch (resultError) {
          console.error('Error loading quiz result:', resultError);
          setError('Không thể tải kết quả bài kiểm tra. Vui lòng thử lại.');
        }
      } else {
        try {
          const attemptsResponse = await fetch(`http://localhost:3000/api/debug-direct?quiz_id=${quizId}`, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          const attemptsResult = await attemptsResponse.json();
          if (attemptsResult.success && attemptsResult.data.length > 0) {
            const completedSubmissions = attemptsResult.data.filter((s: any) => 
              s.status === 'submitted'
            );
            
            if (completedSubmissions.length > 0) {
              const bestSubmission = completedSubmissions.reduce((best: any, current: any) => {
                const bestScore = parseFloat(best.score || 0);
                const currentScore = parseFloat(current.score || 0);
                
                if (currentScore > bestScore) return current;
                if (currentScore === bestScore) {
                  return new Date(current.submitted_at) > new Date(best.submitted_at) ? current : best;
                }
                return best;
              });
              
              const resultResponse = await simpleQuizService.getAttemptResult(bestSubmission.id);
              
              if (resultResponse && (resultResponse.score !== undefined || resultResponse.data)) {
                const data = resultResponse.data || resultResponse;
                
                const correctAnswers = data.responses?.filter((r: any) => r.is_correct === true || r.is_correct === 1).length || 0;
                const totalQuestions = data.responses?.length || 0;
                
                const score = parseFloat(data.score || 0);
                const maxScore = parseFloat(data.max_score || 10);
                const percentage = maxScore > 0 ? (score / maxScore * 100) : parseFloat(data.percentage || 0);
                
                setResult({
                  submissionId: data.id || bestSubmission.id,
                  score: score,
                  maxScore: maxScore,
                  correctAnswers: correctAnswers,
                  totalQuestions: totalQuestions > 0 ? totalQuestions : Math.ceil(parseFloat(data.max_score || 10)),
                  timeTaken: data.time_spent || 0,
                  submittedAt: data.submitted_at || data.createdAt,
                  percentage: percentage,
                  answers: data.responses || [],
                  questions: data.quiz?.questions || [],
                  quiz: data.quiz
                });
                
                return;
              }
            }
          }
          
          // If no submissions found, show error
          setError('Bạn chưa hoàn thành bài kiểm tra này.');
          
        } catch (searchError) {
          console.error('Error searching for submissions:', searchError);
          setError('Không thể tìm thấy kết quả bài kiểm tra.');
        }
      }
    } catch (error: any) {
      console.error('Error loading quiz result:', error);
      setError('Không thể tải kết quả bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', label: 'Xuất sắc', icon: Trophy };
    if (percentage >= 80) return { grade: 'B', label: 'Giỏi', icon: Award };
    if (percentage >= 70) return { grade: 'C', label: 'Khá', icon: Target };
    if (percentage >= 60) return { grade: 'D', label: 'Trung bình', icon: BarChart3 };
    return { grade: 'F', label: 'Cần cải thiện', icon: AlertCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải kết quả</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/student/quiz')} className="w-full">
                Quay lại danh sách
              </Button>
              <Button onClick={loadQuizResult} variant="outline" className="w-full">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 mb-4">Không tìm thấy kết quả cho bài kiểm tra này.</p>
            <Button onClick={() => navigate('/student/quiz')} className="w-full">
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradeInfo = getGrade(result.percentage);
  const GradeIcon = gradeInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/student/quiz')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
          <div>
          <h1 className="text-2xl font-bold">Kết quả bài kiểm tra</h1>
            <p className="text-gray-600">{quiz.title}</p>
          </div>
        </div>

        {/* Main Result Card */}
        <Card className={`shadow-2xl border-2 ${getScoreBackground(result.percentage)}`}>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                result.percentage >= 80 ? 'bg-green-100' : 
                result.percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <GradeIcon className={`w-10 h-10 ${getScoreColor(result.percentage)}`} />
              </div>
              
              <div>
                <div className={`text-6xl font-bold ${getScoreColor(result.percentage)} mb-2`}>
                  {result.score}/{result.maxScore}
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-1">
                  {result.percentage.toFixed(1)}%
                </div>
                <Badge className={`text-lg px-4 py-2 ${
                  result.percentage >= 80 ? 'bg-green-100 text-green-700' :
                  result.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {gradeInfo.grade} - {gradeInfo.label}
                </Badge>
              </div>

              <p className="text-gray-600 text-lg">
                Bạn đã trả lời đúng <span className="font-semibold text-green-600">{result.correctAnswers}</span> trên <span className="font-semibold">{result.totalQuestions}</span> câu hỏi
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTime(result.timeTaken)}
                  </div>
                  <div className="text-sm text-gray-600">Thời gian làm bài</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Câu trả lời đúng</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.totalQuestions - result.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Câu trả lời sai</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Information */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bài kiểm tra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Tên bài kiểm tra: <span className="font-medium">{quiz.title}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Thời gian cho phép: <span className="font-medium">{quiz.duration} phút</span></span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Thời gian nộp bài: <span className="font-medium">{new Date(result.submittedAt).toLocaleString('vi-VN')}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Tổng số câu: <span className="font-medium">{result.totalQuestions}</span></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích kết quả</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Câu trả lời đúng</span>
                  <span>{result.correctAnswers}/{result.totalQuestions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Điểm số đạt được</span>
                  <span>{result.score}/{result.maxScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      result.percentage >= 80 ? 'bg-green-500' :
                      result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Detailed Review Section */}
        {result.answers && result.answers.length > 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Chi tiết câu trả lời
              </h3>
              
              <div className="space-y-6">
                {result.answers.map((answer: any, index: number) => (
                  <div key={answer.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                          Câu {index + 1}
                        </span>
                        {answer.is_correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {answer.points_earned || 0} / {answer.question?.points || 1} điểm
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Câu hỏi:</h4>
                        <p className="text-gray-700">{answer.question?.question_text}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Câu trả lời của bạn:</h4>
                        <div className={`p-3 rounded-lg ${
                          answer.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className={answer.is_correct ? 'text-green-700' : 'text-red-700'}>
                            {answer.selectedAnswer?.answer_text || answer.answer_text || 'Không có câu trả lời'}
                          </p>
                        </div>
                      </div>
                      
                      {!answer.is_correct && answer.question?.explanation && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Giải thích:</h4>
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-blue-700">{answer.question.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/student/quiz')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Làm bài khác
          </Button>
          
          {/* <Button 
            variant="outline"
            onClick={() => navigate('/student/quiz/history')}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8"
          >
            <Clock className="w-4 h-4 mr-2" />
            Xem lịch sử
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 
