import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  BarChart3, 
  Plus, 
  BookOpen, 
  Clock, 
  Users, 
  Hash,
  HelpCircle,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Trash2,
  Upload
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { simpleQuizService } from '../../../services/quiz.service.simple';
import { PermissionUtils } from '../../../utils/permissions';
import { authService } from '../../../services/auth.service';

const QuizDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing,setImporting]=useState(false);

  useEffect(() => {
    if (id) {
      loadQuizData();
      loadQuestions();
    }
  }, [id]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = authService.getCurrentUser();
      
      const quizData = await simpleQuizService.getQuiz(parseInt(id!));
    
      const permissionCheck = PermissionUtils.canAccessQuiz(quizData);
      if (!permissionCheck.canAccess) {
        PermissionUtils.redirectIfNoPermission(false, permissionCheck.reason);
        return;
      }

      setQuiz(quizData);
      
    } catch (err: any) {
      console.error('Error loading quiz:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);
      
      const questionsData = await simpleQuizService.getQuizQuestions(parseInt(id!), true);
      setQuestions(questionsData || []);
      
    } catch (err: any) {
      console.error('Error loading questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number, questionText: string) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa câu hỏi này?\n\n"${questionText.substring(0, 100)}..."`
    );
    
    if (!confirmed) return;

    try {
      
      await simpleQuizService.deleteQuestion(questionId);
      
      await loadQuestions();
      
      alert('Xóa câu hỏi thành công!');
      
    } catch (error: any) {
      console.error('Error deleting question:', error);
      alert('Lỗi xóa câu hỏi: ' + (error.message || 'Unknown error'));
    }
  };

  const handleImportClick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setImporting(true);
      await simpleQuizService.importQuestions(parseInt(id!), e.target.files[0]);
      alert('Import thành công!');
      await loadQuestions();
    } catch (err: any) {
      alert(err.message || 'Lỗi import');
    } finally {
      setImporting(false);
      e.target.value='';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Trắc nghiệm';
      case 'true_false': return 'Đúng/Sai';
      case 'short_answer': return 'Trả lời ngắn';
      case 'essay': return 'Tự luận';
      default: return type;
    }
  };

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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Không giới hạn';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Đang tải dữ liệu...</h3>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg border border-red-200">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={loadQuizData}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
              >
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
                  variant="secondary"
            onClick={() => navigate('/teacher/quiz')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/20 p-3">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">{quiz?.title}</h1>
                    <p className="text-blue-100 text-lg mt-1">Chi tiết bài kiểm tra</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(quiz?.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin bài kiểm tra</h2>
                
                {quiz?.description && (
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700">Mô tả:</label>
                    <p className="text-gray-600 mt-1">{quiz.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Môn học:</span>
                    <span>{quiz?.subject?.subject_name || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Thời gian:</span>
                    <span>{quiz?.time_limit || 0} phút</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-4 h-4" />
                    <span className="font-medium">Tổng điểm:</span>
                    <span>{quiz?.total_points || 0} điểm</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Số lần làm:</span>
                    <span>{quiz?.attempts_allowed || 1} lần</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Giảng viên:</span>
                    <span>{quiz?.lecturer?.first_name + ' ' + quiz?.lecturer?.last_name || quiz?.lecturer?.lecturer_name || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-4 h-4" />
                    <span className="font-medium">Mã GV:</span>
                    <span>{quiz?.lecturer?.lecturer_id || quiz?.lecturer_id || 'N/A'}</span>
                  </div>
                </div>

                {(quiz?.start_time || quiz?.end_time) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Bắt đầu:</label>
                        <p className="text-gray-600">{formatDateTime(quiz?.start_time)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Kết thúc:</label>
                        <p className="text-gray-600">{formatDateTime(quiz?.end_time)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div>
            <Card className="shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hành động</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(`/teacher/quiz/${id}/edit`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa thông tin
                  </Button>
                  
                  <Button
                    onClick={() => navigate(`/teacher/quiz/${id}/questions/add`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi
                  </Button>
                  
                  {quiz?.status === 'published' && (
                    <Button
                      onClick={() => navigate(`/teacher/quiz/${id}/results`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Xem kết quả
          </Button>
                  )}

                  {/* Import CSV */}
                  {PermissionUtils.canManageQuestions(quiz).canManage && (
                    <Button
                      onClick={handleImportClick}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                      disabled={importing}
                    >
                      {importing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Import CSV
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Questions List */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Danh sách câu hỏi</h2>
              {PermissionUtils.canManageQuestions(quiz).canManage ? (
                <Button
                  onClick={() => navigate(`/teacher/quiz/${id}/questions/add`)}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm câu hỏi
                </Button>
              ) : (
                <Button
                  disabled
                  className="bg-gray-400 text-white flex items-center gap-2 cursor-not-allowed"
                  title={PermissionUtils.canManageQuestions(quiz).reason}
                >
                  <Plus className="w-4 h-4" />
                  Thêm câu hỏi
                </Button>
              )}
            </div>

            {loadingQuestions ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600">Đang tải câu hỏi...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có câu hỏi nào</h3>
                <p className="text-gray-600 mb-4">Hãy thêm câu hỏi đầu tiên cho bài kiểm tra này</p>
                {PermissionUtils.canManageQuestions(quiz).canManage ? (
                  <Button
                    onClick={() => navigate(`/teacher/quiz/${id}/questions/add`)}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi đầu tiên
                  </Button>
                ) : (
                  <div className="text-gray-500">
                    <p className="text-sm">{PermissionUtils.canManageQuestions(quiz).reason}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Câu {index + 1}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {getQuestionTypeLabel(question.question_type)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.points} điểm
                            </Badge>
                          </div>
                          
                          <p className="text-gray-900 font-medium mb-3">
                            {question.question_text}
                          </p>

                          {question.answers && question.answers.length > 0 && (
                            <div className="space-y-2">
                              {question.answers.map((answer: any, answerIndex: number) => (
                                <div key={answer.id} className="flex items-center gap-2 text-sm">
                                  {answer.is_correct ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className={answer.is_correct ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                    {String.fromCharCode(65 + answerIndex)}. {answer.answer_text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Giải thích:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {PermissionUtils.canManageQuestions(quiz).canManage ? (
                            <>
                              <Button
                                onClick={() => navigate(`/teacher/quiz/${id}/questions/${question.id}/edit`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteQuestion(question.id, question.question_text)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                disabled
                                className="bg-gray-400 text-white p-2 cursor-not-allowed"
                                title={PermissionUtils.canManageQuestions(quiz).reason}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                disabled
                                className="bg-gray-400 text-white p-2 cursor-not-allowed"
                                title={PermissionUtils.canManageQuestions(quiz).reason}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            )}
          </CardContent>
        </Card>
      </div>
      <input type="file" ref={fileRef} accept=".csv" className="hidden" onChange={onFileChange} />
    </div>
  );
};

export default QuizDetail; 