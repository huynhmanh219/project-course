import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
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
  const [attemptId, setAttemptId] = useState<number | null>(null);

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
      setError(''); // Reset error state
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        console.error('No current user found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Loading quiz data for ID:', quizId, 'User:', currentUser.email);
      
      // Add timeout for API calls
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 second timeout
      });

      try {
        // Fetch quiz details with timeout
        console.log('Fetching quiz details...');
        const quizResponse = await Promise.race([
          SimpleQuizService.getQuizById(parseInt(quizId!)),
          timeoutPromise
        ]);
                console.log('Quiz response:', quizResponse);
        console.log('Quiz response type:', typeof quizResponse);
        console.log('Quiz response keys:', Object.keys(quizResponse || {}));

        if (!quizResponse) {
          throw new Error('No response from quiz API');
        }

        // handleResponse already unwraps the data, so quizResponse IS the quiz data
        const quizData = quizResponse;
        if (!quizData || !quizData.id) {
          throw new Error('Quiz data is empty or invalid');
        }
        
        // Check if quiz is available for taking
        const now = new Date();
        const startDate = quizData.start_time ? new Date(quizData.start_time) : null;
        const endDate = quizData.end_time ? new Date(quizData.end_time) : null;
        
        console.log('Quiz timing check:', {
          now: now.toISOString(),
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          status: quizData.status
        });
        
        if (startDate && now < startDate) {
          setError('Bài kiểm tra chưa đến thời gian làm bài');
          return;
        }
        
        if (endDate && now > endDate) {
          setError('Bài kiểm tra đã hết thời gian làm bài');
          return;
        }

        if (quizData.status !== 'published') {
          setError(`Bài kiểm tra chưa được xuất bản (Status: ${quizData.status})`);
          return;
        }

        const processedQuiz = {
          id: quizData.quiz_id || quizData.id,
          tenBaiKiemTra: quizData.title || quizData.quiz_title || 'Bài kiểm tra',
          moTa: quizData.description || quizData.instructions || '',
          thoiGianLamBai: quizData.duration || quizData.time_limit || 60,
          soCauHoi: quizData.question_count || quizData.total_questions || 0,
          diemToiDa: quizData.max_score || quizData.total_marks || 10,
          ngayBatDau: quizData.start_time,
          ngayKetThuc: quizData.end_time,
          attempts_allowed: quizData.attempts_allowed || 1
        };
        
        console.log('Processed quiz:', processedQuiz);
        setQuiz(processedQuiz);
        
        const duration = (processedQuiz.thoiGianLamBai) * 60; 
        setTimeRemaining(duration);

        try {
          console.log('Checking existing quiz attempts...');
          const debugResponse = await fetch(`http://localhost:3000/api/debug-direct?quiz_id=${processedQuiz.id}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const debugResult = await debugResponse.json();
          console.log('Debug API response:', debugResult);
          const myAttempts = debugResult.success ? debugResult.data : [];
          console.log('My attempts for this quiz:', myAttempts);
          
          if (myAttempts && Array.isArray(myAttempts) && myAttempts.length > 0) {
            const inProgressAttempt = myAttempts.find((attempt: any) => attempt.status === 'in_progress');
            
            if (inProgressAttempt) {
              console.log('Found in-progress attempt, resuming:', inProgressAttempt.id);
              setAttemptId(inProgressAttempt.id);
              
              const startTime = new Date(inProgressAttempt.started_at);
              const now = new Date();
              const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
              const remainingTime = Math.max(0, (processedQuiz.thoiGianLamBai * 60) - elapsedSeconds);
              setTimeRemaining(remainingTime);
              
              if (remainingTime <= 0) {
                console.log('Time expired, auto-submitting...');
                await SimpleQuizService.submitQuizAttempt(inProgressAttempt.id);
                navigate(`/student/quiz/${quizId}/result?submission=${inProgressAttempt.id}`);
                return;
              }
            } else {
              const completedAttempt = myAttempts.find((attempt: any) => 
                attempt.status === 'submitted' || attempt.status === 'graded'
              );
              
              if (completedAttempt) {
                console.log('Found completed attempt, redirecting to results:', completedAttempt.id);
                navigate(`/student/quiz/${quizId}/result?submission=${completedAttempt.id}`);
                return;
              }
              
              const attemptsAllowed = quizData.attempts_allowed || 1;
              if (myAttempts.length >= attemptsAllowed) {
                setError(`Bạn đã sử dụng hết ${attemptsAllowed} lượt làm bài cho quiz này.`);
                return;
              }
              
              console.log(`Creating new attempt (${myAttempts.length + 1}/${attemptsAllowed})...`);
              const attemptData = {
                quiz_id: processedQuiz.id
              };
              const attemptResponse = await SimpleQuizService.createQuizAttempt(attemptData);
              console.log('Quiz attempt created:', attemptResponse);
              
              if (attemptResponse && attemptResponse.submission_id) {
                setAttemptId(attemptResponse.submission_id);
                console.log('Attempt ID set to:', attemptResponse.submission_id);
              } else {
                throw new Error('Failed to create quiz attempt');
              }
            }
          } else {
            console.log('No existing attempts, creating new quiz attempt...');
            const attemptData = {
              quiz_id: processedQuiz.id
            };
            const attemptResponse = await SimpleQuizService.createQuizAttempt(attemptData);
            console.log('Quiz attempt created:', attemptResponse);
            
            if (attemptResponse && attemptResponse.submission_id) {
              setAttemptId(attemptResponse.submission_id);
              console.log('Attempt ID set to:', attemptResponse.submission_id);
            } else {
              throw new Error('Failed to create quiz attempt');
            }
          }
        } catch (attemptError: any) {
          console.error('Error managing quiz attempt:', attemptError);
          
          if (attemptError.message.includes('Maximum attempts reached')) {
            setError('Bạn đã hết lượt làm bài cho quiz này. Vui lòng xem kết quả từ lần làm trước.');
          } else {
            setError('Không thể bắt đầu bài kiểm tra. Vui lòng thử lại.');
          }
          return;
        }
        
        console.log('Fetching quiz questions...');
        try {
          const questionsResponse = await Promise.race([
            SimpleQuizService.getQuizQuestions(parseInt(quizId!)),
            timeoutPromise
          ]);
          console.log('Questions response:', questionsResponse);
          
          if (!questionsResponse) {
            throw new Error('No response from questions API');
          }

          const questionsData = questionsResponse;
          if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
            console.warn('Questions API response invalid or empty, trying fallback...');
            const mockQuestions = [{
              id: 1,
              noiDungCauHoi: 'Đây là câu hỏi demo (API chưa hoạt động)',
              loaiCauHoi: 'multiple_choice',
              diemSo: 1,
              thuTu: 1,
              answers: [
                { id: 1, noiDungDapAn: 'Lựa chọn A', laDapAnDung: false, thuTu: 1 },
                { id: 2, noiDungDapAn: 'Lựa chọn B', laDapAnDung: true, thuTu: 2 },
                { id: 3, noiDungDapAn: 'Lựa chọn C', laDapAnDung: false, thuTu: 3 },
                { id: 4, noiDungDapAn: 'Lựa chọn D', laDapAnDung: false, thuTu: 4 }
              ]
            }];
            setQuestions(mockQuestions);
            console.log('Using mock questions for demo');
            return;
          }

          const processedQuestions = questionsData.map((q: any, index: number) => ({
            id: q.question_id || q.id || index + 1,
            noiDungCauHoi: q.question_text || q.content || q.question || `Câu hỏi ${index + 1}`,
            loaiCauHoi: q.question_type || 'multiple_choice',
            diemSo: q.marks || q.points || 1,
            thuTu: q.order || q.question_number || q.sort_order || (index + 1),
            answers: q.answers ? q.answers.map((a: any, aIndex: number) => ({
              id: a.answer_id || a.id || aIndex + 1,
              noiDungDapAn: a.answer_text || a.content || a.text || `Lựa chọn ${String.fromCharCode(65 + aIndex)}`,
              laDapAnDung: a.is_correct || false,
              thuTu: a.order || a.option_number || (aIndex + 1)
            })) : []
          }));
          
          processedQuestions.sort((a: any, b: any) => a.thuTu - b.thuTu);
          console.log('Processed questions:', processedQuestions.length);
          setQuestions(processedQuestions);
          
        } catch (questionsError: any) {
          console.error('Error loading questions:', questionsError);
          console.log('Trying alternative questions API...');
          
          try {
            const alternativeResponse = await SimpleQuizService.getQuiz(parseInt(quizId!));
            if (alternativeResponse && alternativeResponse.questions) {
              console.log('Got questions from alternative API');
              const altQuestions = alternativeResponse.questions.map((q: any, index: number) => ({
                id: q.question_id || q.id || index + 1,
                noiDungCauHoi: q.question_text || q.content || q.question || `Câu hỏi ${index + 1}`,
                loaiCauHoi: q.question_type || 'multiple_choice',
                diemSo: q.marks || q.points || 1,
                thuTu: q.order || q.question_number || q.sort_order || (index + 1),
                answers: q.answers ? q.answers.map((a: any, aIndex: number) => ({
                  id: a.answer_id || a.id || aIndex + 1,
                  noiDungDapAn: a.answer_text || a.content || a.text || `Lựa chọn ${String.fromCharCode(65 + aIndex)}`,
                  laDapAnDung: a.is_correct || false,
                  thuTu: a.order || a.option_number || (aIndex + 1)
                })) : []
              }));
              setQuestions(altQuestions);
            } else {
              throw new Error('Alternative API also failed');
            }
          } catch (altError) {
            console.error('Alternative questions API also failed:', altError);
            setError('Không thể tải câu hỏi của bài kiểm tra. Vui lòng thử lại sau.');
          }
        }
      } catch (quizError: any) {
        console.error('Error loading quiz details:', quizError);
        if (quizError.message === 'Request timeout') {
          setError('Quá thời gian tải dữ liệu. Vui lòng kiểm tra kết nối mạng và thử lại.');
        } else {
          setError('Không thể tải thông tin bài kiểm tra. Vui lòng thử lại.');
        }
      }
    } catch (error: any) {
      console.error('General error in loadQuizData:', error);
      setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
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
    if (isSubmitting || !attemptId) return;
    
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
      console.log('Submitting quiz answers before final submission...');
      
      for (const [questionId, answerId] of Object.entries(answers)) {
        try {
          const answerData = {
            question_id: parseInt(questionId),
            answer_id: answerId
          };
          await SimpleQuizService.submitAnswer(attemptId, answerData);
          console.log(`Submitted answer for question ${questionId}`);
        } catch (answerError: any) {
          console.error(`Error submitting answer for question ${questionId}:`, answerError);
        }
      }

      console.log('Submitting final quiz attempt...');
      
      const submitResponse = await SimpleQuizService.submitQuizAttempt(attemptId);
      console.log('Final submit response:', submitResponse);

      if (submitResponse) {
        navigate(`/student/quiz/${quizId}/result?submission=${attemptId}`);
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
        <Card className="max-w-lg w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải bài kiểm tra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            
            <div className="text-left bg-gray-100 p-3 rounded-lg mb-4 text-sm">
              <h4 className="font-semibold mb-2">Thông tin debug:</h4>
              <p><strong>Quiz ID:</strong> {quizId}</p>
              <p><strong>Attempt ID:</strong> {attemptId || 'Chưa tạo'}</p>
              <p><strong>User:</strong> {user?.email || 'Chưa đăng nhập'}</p>
              <p><strong>Time:</strong> {new Date().toLocaleString('vi-VN')}</p>
              <p><strong>API Base:</strong> http://localhost:3000/api</p>
            </div>
            
            <div className="space-y-2">
              <Button onClick={() => navigate('/student/quiz')} className="w-full">
                Quay lại danh sách
              </Button>
              <Button onClick={loadQuizData} variant="outline" className="w-full">
                Thử lại
              </Button>
              <Button 
                onClick={() => {
                  console.log('Testing API connectivity...');
                  fetch('http://localhost:3000/api/ping')
                    .then(res => res.json())
                    .then(data => console.log('API Test:', data))
                    .catch(err => console.error('API Test Failed:', err));
                }}
                variant="outline" 
                size="sm"
                className="w-full text-xs border-gray-300"
              >
                Test API Connection
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
        {showNavigator && (
          <Card className="w-80 shadow-lg border border-gray-200 h-fit">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Điều hướng câu hỏi</h3>
              
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
