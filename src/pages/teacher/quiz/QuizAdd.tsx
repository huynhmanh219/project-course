import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Clock, FileText, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleQuizService } from '../../../services/quiz.service.simple';
import { authService } from '../../../services/auth.service';

const QuizAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    time_limit: '',
    total_points: '',
    start_time: '',
    end_time: '',
    instructions: '',
    attempts_allowed: 3,
    show_results: true,
    show_correct_answers: true,
    shuffle_questions: false,
    shuffle_answers: false
  });

  useEffect(() => {
    loadSubjects();
  }, []);

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
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
        }
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

      const quizData = {
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

      const response = await simpleQuizService.createQuiz(quizData);
      
      alert('Tạo bài kiểm tra thành công!');
      navigate('/teacher/quiz');
      
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      alert('Lỗi tạo bài kiểm tra: ' + (error.message || 'Unknown error'));
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
                  <h1 className="text-4xl font-bold tracking-tight">Tạo bài kiểm tra mới</h1>
                  <p className="text-blue-100 text-lg mt-1">Thiết lập bài kiểm tra trắc nghiệm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
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
                    placeholder="Nhập tên bài kiểm tra..."
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
                    placeholder="Mô tả về bài kiểm tra..."
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
                      placeholder="60"
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
                      placeholder="10"
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
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Tạo bài kiểm tra
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-blue-800">
              <BookOpen className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Lưu ý:</p>
                <p className="text-sm mt-1">
                  Sau khi tạo bài kiểm tra, bạn có thể thêm câu hỏi và xuất bản để sinh viên có thể làm bài.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizAdd; 