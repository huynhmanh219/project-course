import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { authService } from '../../../services/auth.service';
import SimpleQuizService from '../../../services/quiz.service.simple';

const QuizTaking: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  // State management
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showNavigator, setShowNavigator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (quizId) {
      loadQuizData();
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (quiz && Object.keys(answers).length > 0) {
      const autoSave = setInterval(() => {
        saveProgress();
      }, 30000);

      return () => clearInterval(autoSave);
    }
  }, [answers, quiz]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      console.log('Loading quiz data for ID:', quizId);
      
      // Fetch quiz details
      const quizResponse = await SimpleQuizService.getQuizById(parseInt(quizId!));
      console.log('Quiz response:', quizResponse);
      
      if (quizResponse && quizResponse.data) {
        const quizData = quizResponse.data;
        
        // Check if quiz is available for taking
        const now = new Date();
        const startDate = quizData.start_time ? new Date(quizData.start_time) : null;
        const endDate = quizData.end_time ? new Date(quizData.end_time) : null;
        
        if (startDate && now < startDate) {
          setError('Bài kiểm tra chưa đến thời gian làm bài');
          return;
        }
        
        if (endDate && now > endDate) {
          setError('Bài kiểm tra đã hết thời gian làm bài');
          return;
        }

        if (quizData.status !== 'published') {
          setError('Bài kiểm tra chưa được xuất bản');
          return;
        }

        setQuiz({
          id: quizData.quiz_id || quizData.id,
          tenBaiKiemTra: quizData.title || quizData.quiz_title || 'Bài kiểm tra',
          moTa: quizData.description || quizData.instructions || '',
          thoiGianLamBai: quizData.duration || quizData.time_limit || 60,
          soCauHoi: quizData.question_count || quizData.total_questions || 0,
          diemToiDa: quizData.max_score || quizData.total_marks || 10,
          ngayBatDau: quizData.start_time,
          ngayKetThuc: quizData.end_time
        });
        
        // Set initial timer
        const duration = (quizData.duration || quizData.time_limit || 60) * 60; // Convert to seconds
        setTimeRemaining(duration);
        
        // Fetch quiz questions
        try {
          const questionsResponse = await SimpleQuizService.getQuizQuestions(parseInt(quizId!));
          console.log('Questions response:', questionsResponse);
          
          if (questionsResponse && questionsResponse.data) {
            const processedQuestions = questionsResponse.data.map((q: any) => ({
              id: q.question_id || q.id,
              noiDungCauHoi: q.question_text || q.content || q.question,
              loaiCauHoi: q.question_type || 'single_choice',
              diemSo: q.marks || q.points || 1,
              thuTu: q.order || q.question_number || q.sort_order || 1,
              answers: q.answers ? q.answers.map((a: any) => ({
                id: a.answer_id || a.id,
                noiDungDapAn: a.answer_text || a.content || a.text,
                laDapAnDung: a.is_correct || false,
                thuTu: a.order || a.option_number || 1
              })) : []
            }));
            
            // Sort questions by order
            processedQuestions.sort((a: any, b: any) => a.thuTu - b.thuTu);
            setQuestions(processedQuestions);
          } else {
            setError('Không thể tải câu hỏi của bài kiểm tra');
          }
        } catch (questionsError) {
          console.error('Error loading questions:', questionsError);
          setError('Lỗi khi tải câu hỏi');
        }
      } else {
        setError('Không tìm thấy bài kiểm tra');
      }
    } catch (error: any) {
      console.error('Error loading quiz:', error);
      setError('Không thể tải dữ liệu bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      console.log('Auto-saving progress:', answers);
      // TODO: Implement auto-save API call
      // await SimpleQuizService.saveProgress(quizId, answers);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // 5 minutes
    if (timeRemaining <= 600) return 'text-yellow-600'; // 10 minutes
    return 'text-green-600';
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleQuestionFlag = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    // Confirmation dialog
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài không?`
      );
      if (!confirmed) return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting quiz with answers:', answers);
      
      // Prepare submission data
      const submissionData = {
        quiz_id: quiz.id,
        student_id: user?.id || user?.student_id,
        answers: Object.entries(answers).map(([questionId, answerId]) => ({
          question_id: parseInt(questionId),
          answer_id: answerId,
          selected_answer: answerId
        })),
        time_taken: (quiz.thoiGianLamBai * 60) - timeRemaining,
        submitted_at: new Date().toISOString()
      };

      // Submit quiz
      const submitResponse = await SimpleQuizService.submitQuiz(quiz.id, submissionData);
      console.log('Submit response:', submitResponse);

      if (submitResponse && submitResponse.data) {
        // Redirect to results page with submission ID
        const submissionId = submitResponse.data.submission_id || submitResponse.data.id;
        navigate(`/student/quiz/${quizId}/result?submission=${submissionId}`);
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      alert('Lỗi khi nộp bài: ' + (error.message || 'Vui lòng thử lại'));
      setIsSubmitting(false);
    }
  };

  const getQuestionStatus = (questionId: number) => {
    if (answers[questionId]) return 'answered';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    return 'unanswered';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải bài kiểm tra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/student/quiz')} className="w-full">
                Quay lại danh sách
              </Button>
              <Button onClick={loadQuizData} variant="outline" className="w-full">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bài kiểm tra trống</h3>
            <p className="text-gray-600 mb-4">Bài kiểm tra này chưa có câu hỏi nào.</p>
            <Button onClick={() => navigate('/student/quiz')} className="w-full">
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">{quiz.tenBaiKiemTra}</h1>
              <p className="text-blue-100 text-sm">{questions.length} câu hỏi • {quiz.diemToiDa} điểm</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-blue-100">Thời gian còn lại</div>
            </div>
            <Button
              onClick={() => setShowNavigator(!showNavigator)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {showNavigator ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showNavigator ? 'Ẩn' : 'Hiện'} điều hướng
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        {/* Question Navigator Sidebar */}
        {showNavigator && (
          <Card className="w-80 shadow-lg border border-gray-200 h-fit">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Điều hướng câu hỏi</h3>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Đã trả lời: {answeredCount}/{questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Đã đánh dấu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Chưa trả lời</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`
                        relative w-10 h-10 rounded-lg text-sm font-medium border-2 transition-all
                        ${currentQuestionIndex === index ? 'border-blue-600' : 'border-transparent'}
                        ${status === 'answered' ? 'bg-green-500 text-white' :
                          status === 'flagged' ? 'bg-yellow-500 text-white' :
                          'bg-gray-300 text-gray-700'}
                        hover:scale-105
                      `}
                    >
                      {index + 1}
                      {flaggedQuestions.has(question.id) && (
                        <Flag className="w-3 h-3 absolute -top-1 -right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Question Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Câu {currentQuestionIndex + 1}/{questions.length}
                      </Badge>
                      <Badge variant="secondary">
                        {currentQuestion.diemSo} điểm
                      </Badge>
                      <Button
                        onClick={() => handleQuestionFlag(currentQuestion.id)}
                        variant="ghost"
                        size="sm"
                        className={`p-2 ${flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : 'text-gray-400'}`}
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
                      {currentQuestion.noiDungCauHoi}
                    </h3>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.answers && currentQuestion.answers.length > 0 ? (
                    currentQuestion.answers.map((answer: any) => (
                      <label
                        key={answer.id}
                        className={`
                          flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-blue-50
                          ${answers[currentQuestion.id] === answer.id 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={answer.id}
                          checked={answers[currentQuestion.id] === answer.id}
                          onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-900 leading-relaxed">
                          {answer.noiDungDapAn}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>Câu hỏi này chưa có lựa chọn nào</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Câu trước
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {answeredCount}/{questions.length} câu đã trả lời
              </span>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang nộp bài...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Nộp bài
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                >
                  Câu tiếp theo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Warning if time is running low */}
          {timeRemaining <= 300 && timeRemaining > 0 && (
            <Card className="border-yellow-300 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-yellow-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Cảnh báo: Chỉ còn {Math.floor(timeRemaining / 60)} phút {timeRemaining % 60} giây!
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTaking; 