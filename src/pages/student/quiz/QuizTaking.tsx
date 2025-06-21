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
  EyeOff
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

// Mock data cho bài thi
const mockQuiz = {
  id: 1,
  tenBaiKiemTra: 'Kiểm tra Chương 1 - Giới thiệu Toán cao cấp',
  moTa: 'Bài kiểm tra 15 phút về kiến thức cơ bản',
  thoiGianLamBai: 15, // minutes
  soCauHoi: 10,
  diemToiDa: 10,
  ngayBatDau: '2024-01-15T08:00:00',
  ngayKetThuc: '2024-01-15T23:59:59'
};

const mockQuestions = [
  {
    id: 1,
    noiDungCauHoi: 'Định nghĩa nào sau đây đúng về giới hạn của hàm số?',
    loaiCauHoi: 'single_choice' as const,
    diemSo: 1,
    thuTu: 1,
    answers: [
      { id: 1, noiDungDapAn: 'Giá trị mà hàm số tiến tới khi biến độc lập tiến tới một giá trị nào đó', laDapAnDung: true, thuTu: 1 },
      { id: 2, noiDungDapAn: 'Giá trị lớn nhất của hàm số', laDapAnDung: false, thuTu: 2 },
      { id: 3, noiDungDapAn: 'Giá trị nhỏ nhất của hàm số', laDapAnDung: false, thuTu: 3 },
      { id: 4, noiDungDapAn: 'Đạo hàm của hàm số tại một điểm', laDapAnDung: false, thuTu: 4 }
    ]
  },
  {
    id: 2,
    noiDungCauHoi: 'Phép tính đạo hàm của hàm số f(x) = x² + 3x + 2 là:',
    loaiCauHoi: 'single_choice' as const,
    diemSo: 1,
    thuTu: 2,
    answers: [
      { id: 5, noiDungDapAn: 'f\'(x) = x + 3', laDapAnDung: false, thuTu: 1 },
      { id: 6, noiDungDapAn: 'f\'(x) = 2x + 3', laDapAnDung: true, thuTu: 2 },
      { id: 7, noiDungDapAn: 'f\'(x) = 2x + 6', laDapAnDung: false, thuTu: 3 },
      { id: 8, noiDungDapAn: 'f\'(x) = x² + 3', laDapAnDung: false, thuTu: 4 }
    ]
  },
  {
    id: 3,
    noiDungCauHoi: 'Tích phân ∫x dx bằng:',
    loaiCauHoi: 'single_choice' as const,
    diemSo: 1,
    thuTu: 3,
    answers: [
      { id: 9, noiDungDapAn: 'x²/2 + C', laDapAnDung: true, thuTu: 1 },
      { id: 10, noiDungDapAn: 'x² + C', laDapAnDung: false, thuTu: 2 },
      { id: 11, noiDungDapAn: 'x + C', laDapAnDung: false, thuTu: 3 },
      { id: 12, noiDungDapAn: '2x + C', laDapAnDung: false, thuTu: 4 }
    ]
  }
];

const QuizTaking: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(mockQuiz.thoiGianLamBai * 60); // seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showNavigator, setShowNavigator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
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
  }, []);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      // Save progress to server
      console.log('Auto-saving progress:', answers);
    }, 30000);

    return () => clearInterval(autoSave);
  }, [answers]);

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
    
    setIsSubmitting(true);
    try {
      // Submit quiz logic here
      console.log('Submitting quiz with answers:', answers);
      // Redirect to results page
      navigate(`/student/quiz/${quizId}/result`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
    }
  };

  const getQuestionStatus = (questionId: number) => {
    if (answers[questionId]) return 'answered';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    return 'unanswered';
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">{mockQuiz.tenBaiKiemTra}</h1>
              <p className="text-blue-100 text-sm">{mockQuiz.soCauHoi} câu hỏi • {mockQuiz.diemToiDa} điểm</p>
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
                  <span>Đã trả lời: {answeredCount}/{mockQuestions.length}</span>
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
                {mockQuestions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-medium border-2 transition-all
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
                        Câu {currentQuestionIndex + 1}/{mockQuestions.length}
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
                  {currentQuestion.answers.map((answer) => (
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
                  ))}
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
                {answeredCount}/{mockQuestions.length} câu đã trả lời
              </span>
              
              {currentQuestionIndex === mockQuestions.length - 1 ? (
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
                  onClick={() => setCurrentQuestionIndex(Math.min(mockQuestions.length - 1, currentQuestionIndex + 1))}
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