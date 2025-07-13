import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Clock, FileText, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleQuizService } from '../../../services/quiz.service.simple';
import { PermissionUtils } from '../../../utils/permissions';
import { authService } from '../../../services/auth.service';

const QuizEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    time_limit: '',
    total_points: '',
    start_time: '',
    end_time: '',
    instructions: '',
    attempts_allowed: 1,
    show_results: true,
    show_correct_answers: true,
    shuffle_questions: false,
    shuffle_answers: false
  });

  useEffect(() => {
    if (id) {
      loadQuizData();
      loadSubjects();
    }
  }, [id]);

  const loadQuizData = async () => {
    try {
      setLoadingQuiz(true);
      setError(null);
      
      const quizData = await simpleQuizService.getQuiz(parseInt(id!));
      
      const permissionCheck = PermissionUtils.canEditQuiz(quizData);
      if (!permissionCheck.canEdit) {
        PermissionUtils.redirectIfNoPermission(false, permissionCheck.reason);
        return;
      }
      
      setFormData({
        title: quizData.title || '',
        description: quizData.description || '',
        subject_id: quizData.subject_id?.toString() || '',
        time_limit: quizData.time_limit?.toString() || '',
        total_points: quizData.total_points?.toString() || '',
        start_time: quizData.start_time ? new Date(quizData.start_time).toISOString().slice(0, 16) : '',
        end_time: quizData.end_time ? new Date(quizData.end_time).toISOString().slice(0, 16) : '',
        instructions: quizData.instructions || '',
        attempts_allowed: quizData.attempts_allowed || 1,
        show_results: quizData.show_results ?? true,
        show_correct_answers: quizData.show_correct_answers ?? true,
        shuffle_questions: quizData.shuffle_questions || false,
        shuffle_answers: quizData.shuffle_answers || false
      });
      
    } catch (err: any) {
      console.error('Error loading quiz:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      
      const token = await authService.getValidToken();
      
      const response = await fetch('http://localhost:3000/api/courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success' && result.data?.courses) {
        setSubjects(result.data.courses);
      } else {
        console.error('Failed to load subjects:', result);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.title || !formData.subject_id || !formData.time_limit || !formData.total_points) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const updateData = {
        title: formData.title,
        description: formData.description,
        subject_id: parseInt(formData.subject_id),
        time_limit: parseInt(formData.time_limit),
        total_points: parseFloat(formData.total_points),
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
        instructions: formData.instructions,
        attempts_allowed: formData.attempts_allowed,
        show_results: formData.show_results,
        show_correct_answers: formData.show_correct_answers,
        shuffle_questions: formData.shuffle_questions,
        shuffle_answers: formData.shuffle_answers
      };

      const response = await simpleQuizService.updateQuiz(parseInt(id!), updateData);
      
      alert('Cập nhật bài kiểm tra thành công!');
      navigate('/teacher/quiz');
      
    } catch (error: any) {
      console.error('Error updating quiz:', error);
      alert('Lỗi cập nhật bài kiểm tra: ' + ('không được sửa thông tin khi đã xuất bản'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
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
                  <h1 className="text-4xl font-bold tracking-tight">Chỉnh sửa bài kiểm tra</h1>
                  <p className="text-blue-100 text-lg mt-1">Cập nhật thông tin bài kiểm tra</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingQuiz && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Đang tải dữ liệu bài kiểm tra...</h3>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loadingQuiz && (
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
        )}

        {/* Form Card */}
        {!loadingQuiz && !error && (
          <Card className="shadow-xl border border-gray-200 bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {/* Subject Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Môn học <span className="text-red-500">*</span>
                  </label>
                  {loadingSubjects ? (
                    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-xl bg-gray-50">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-gray-500">Đang tải môn học...</span>
                    </div>
                  ) : (
                    <select
                      name="subject_id"
                      value={formData.subject_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    >
                      <option value="">Chọn môn học...</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.subject_code} - {subject.subject_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Tên bài kiểm tra <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      Thời gian làm bài (phút) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="time_limit"
                      value={formData.time_limit}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      Điểm tối đa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="total_points"
                      value={formData.total_points}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      Ngày bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      Ngày kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base transition-all duration-200"
                  onClick={() => navigate('/teacher/quiz')}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
                          </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizEdit; 