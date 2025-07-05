import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Clock,  
  Users,
  BookOpen,
  Play,
  Pause,

  Loader2,
  AlertCircle,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { simpleQuizService } from '../../../services/quiz.service.simple';

  

const QuizManagement: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');
  
  useEffect(() => {
    loadQuizzes();
  }, []);
  
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await simpleQuizService.getQuizzes({
        page: 1,
        size: 50 
      });
      
      console.log('Loaded quizzes:', response);
      
      const quizzesList = response.data || response.results || [];

      const transformedQuizzes = (quizzesList || []).map((quiz: any) => ({
        id: quiz.id,
        tenBaiKiemTra: quiz.title,
        moTa: quiz.description || '',
        soCauHoi: quiz.questions?.length || quiz.question_count || 0,
        thoiGianLamBai: quiz.time_limit || 0,
        diemToiDa: quiz.total_points || 0,
        trangThaiQuiz: quiz.status,
        ngayTao: quiz.created_at,
        ngayCapNhat: quiz.updated_at,
        ngayBatDau: quiz.start_time,
        ngayKetThuc: quiz.end_time,
        soSinhVienDaLam: 0, // TODO: Get from submissions
        tongSoSinhVien: 0, // TODO: Get from course enrollment
        lopHoc: { 
          tenLopHoc: quiz.courseSection?.section_name || quiz.subject?.subject_name || 'N/A' 
        },
        chuong: { 
          tenChuong: quiz.subject?.subject_name || 'N/A' 
        }
      }));
      
      setQuizzes(transformedQuizzes);
      
    } catch (err: any) {
      console.error('Error loading quizzes:', err);
      setError(err.message || 'Failed to load quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
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

  const getProgressPercentage = (daLam: number, tongSo: number) => {
    return tongSo > 0 ? Math.round((daLam / tongSo) * 100) : 0;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeStatus = (startTime: string | null, endTime: string | null) => {
    const now = new Date();
    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    if (start && end) {
      if (now < start) {
        return { status: 'upcoming', label: 'Sắp diễn ra', color: 'text-blue-600' };
      } else if (now >= start && now <= end) {
        return { status: 'active', label: 'Đang diễn ra', color: 'text-green-600' };
      } else {
        return { status: 'ended', label: 'Đã kết thúc', color: 'text-red-600' };
      }
    } else if (start && !end) {
      if (now < start) {
        return { status: 'upcoming', label: 'Sắp diễn ra', color: 'text-blue-600' };
      } else {
        return { status: 'active', label: 'Đang diễn ra', color: 'text-green-600' };
      }
    } else if (!start && end) {
      if (now <= end) {
        return { status: 'active', label: 'Còn thời gian', color: 'text-green-600' };
      } else {
        return { status: 'ended', label: 'Đã kết thúc', color: 'text-red-600' };
      }
    }
    
    return { status: 'no-time', label: 'Không giới hạn', color: 'text-gray-600' };
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.tenBaiKiemTra.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.lopHoc?.tenLopHoc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quiz.trangThaiQuiz === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePublishQuiz = async (quizId: number) => {
    try {
      await simpleQuizService.publishQuiz(quizId);
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === quizId ? { ...quiz, trangThaiQuiz: 'published' as const } : quiz
      ));
      console.log('Quiz published successfully');
    } catch (err: any) {
      console.error('Error publishing quiz:', err);
      alert('không thể xuất bảng khi không có câu hỏi');
    }
  };

  const handleCloseQuiz = async (quizId: number) => {
    try {
      await simpleQuizService.closeQuiz(quizId);
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === quizId ? { ...quiz, trangThaiQuiz: 'closed' as const } : quiz
      ));
      console.log('Quiz closed successfully');
    } catch (err: any) {
      console.error('Error closing quiz:', err);
      alert('Không thể đóng bài kiểm tra khi đang có sinh viên làm bài');
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này không?')) return;
    
    try {
      await simpleQuizService.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      console.log('Quiz deleted successfully');
    } catch (err: any) {
      console.error('Error deleting quiz:', err);
      alert('Không thể xóa bài kiểm tra khi đang có sinh viên làm bài');
    }
  };

  const handleDeleteClosedQuiz = async (quizId: number) => {
    const confirmed = confirm(
      'Bài kiểm tra này đã đóng và có thể có dữ liệu sinh viên.\n' +
      'Bạn có chắc chắn muốn xóa vĩnh viễn không?\n\n' +
      'Lưu ý: Hành động này không thể hoàn tác!'
    );
    
    if (!confirmed) return;
    
    try {
      // For closed quizzes, we might need special API endpoint or force delete
      await simpleQuizService.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      alert('Đã xóa bài kiểm tra thành công!');
    } catch (err: any) {
      console.error('Error deleting closed quiz:', err);
      // If normal delete fails, show option to force delete
      const forceDelete = confirm(
        'Không thể xóa bình thường do có dữ liệu sinh viên.\n' +
        'Bạn có muốn xóa gồm cả dữ liệu sinh viên không?\n\n' +
        '⚠️ Cảnh báo: Điều này sẽ xóa tất cả kết quả làm bài!'
      );
      
      if (forceDelete) {
        try {
          await simpleQuizService.forceDeleteQuiz(quizId);
          
          // For now, remove from frontend (you may need backend API update)
          setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
          alert('Đã force xóa bài kiểm tra và toàn bộ dữ liệu liên quan!');
        } catch (forceErr: any) {
          alert('Không thể force delete: ' + (forceErr.message || 'Unknown error'));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/20 p-3">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Quản lý bài kiểm tra</h1>
                  <p className="text-blue-100 text-lg mt-1">Tạo và quản lý các bài kiểm tra trắc nghiệm</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/teacher/quiz/add')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 px-6 py-3 text-lg font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo bài kiểm tra
              </Button>
            </div>
            
            {/* Statistics Row */}
            {!loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{quizzes.length}</div>
                      <div className="text-blue-100 text-sm">Tổng bài kiểm tra</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 rounded-lg p-2">
                      <Play className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{quizzes.filter(q => q.trangThaiQuiz === 'published').length}</div>
                      <div className="text-blue-100 text-sm">Đã xuất bản</div>
                    </div>
                  </div>
                </div>
                
                {/* <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-400/20 rounded-lg p-2">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {quizzes.filter(q => {
                          const timeStatus = getTimeStatus(q.ngayBatDau, q.ngayKetThuc);
                          return timeStatus.status === 'active';
                        }).length}
                      </div>
                      <div className="text-blue-100 text-sm">Đang diễn ra</div>
                    </div>
                  </div>
                </div> */}
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 rounded-lg p-2">
                      <Edit className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{quizzes.filter(q => q.trangThaiQuiz === 'draft').length}</div>
                      <div className="text-blue-100 text-sm">Bản nháp</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 rounded-lg p-2">
                      <Pause className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{quizzes.filter(q => q.trangThaiQuiz === 'closed').length}</div>
                      <div className="text-blue-100 text-sm">Đã đóng</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'draft', 'published', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'Tất cả' :
                     status === 'draft' ? 'Nháp' :
                     status === 'published' ? 'Đã xuất bản' : 'Đã đóng'}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Đang tải bài kiểm tra...</h3>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="shadow-lg border border-red-200">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={loadQuizzes}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
              >
                Thử lại
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quiz List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {quiz.tenBaiKiemTra}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{quiz.lopHoc?.tenLopHoc}</p>
                      <p className="text-sm text-blue-600">{quiz.chuong?.tenChuong}</p>
                      
                      {/* Time Status */}
                      {(() => {
                        const timeStatus = getTimeStatus(quiz.ngayBatDau, quiz.ngayKetThuc);
                        if (timeStatus.status !== 'no-time') {
                          return (
                            <div className={`text-xs font-medium mt-1 ${timeStatus.color}`}>
                              • {timeStatus.label}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(quiz.trangThaiQuiz)}
                    </div>
                  </div>

                  {/* Description */}
                  {quiz.moTa && (
                    <p className="text-gray-700 text-sm line-clamp-2">{quiz.moTa}</p>
                  )}

                  {/* Quiz Info */}
                  <div className="space-y-3">
                    {/* Row 1 - Main Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{quiz.soCauHoi}</span>
                        <span>câu hỏi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{quiz.thoiGianLamBai}</span>
                        <span>phút</span>
                      </div>
                    </div>
                    
                    {/* Row 2 - Points & Progress */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">{quiz.diemToiDa}</span>
                        <span>điểm</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">{quiz.soSinhVienDaLam}/{quiz.tongSoSinhVien}</span>
                      </div>
                    </div>
                    
                    {/* Row 3 - Schedule */}
                    {(quiz.ngayBatDau || quiz.ngayKetThuc) && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="space-y-1">
                          {quiz.ngayBatDau && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Bắt đầu:</span>
                              <span className="font-medium text-green-700">{formatDate(quiz.ngayBatDau)}</span>
                            </div>
                          )}
                          {quiz.ngayKetThuc && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Kết thúc:</span>
                              <span className="font-medium text-red-700">{formatDate(quiz.ngayKetThuc)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Row 4 - Created Date */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Tạo:</span>
                        <span className="font-medium">{formatDate(quiz.ngayTao)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar
                  {quiz.trangThaiQuiz === 'published' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiến độ làm bài</span>
                        <span className="font-medium">{getProgressPercentage(quiz.soSinhVienDaLam, quiz.tongSoSinhVien)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(quiz.soSinhVienDaLam, quiz.tongSoSinhVien)}%` }}
                        ></div>
                      </div>
                    </div>
                  )} */}

                  {/* Action Buttons */}
                   
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => navigate(`/teacher/quiz/${quiz.id}`)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => navigate(`/teacher/quiz/${quiz.id}/edit`)}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                    {quiz.trangThaiQuiz === 'published' && (
                      <button 
                        onClick={() => navigate(`/teacher/quiz/${quiz.id}/results`)}
                        className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Kết quả
                      </button>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {quiz.trangThaiQuiz === 'draft' && (
                      <button
                        onClick={() => handlePublishQuiz(quiz.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Xuất bản
                      </button>
                    )}
                    {quiz.trangThaiQuiz === 'published' && (
                      <button
                        onClick={() => handleCloseQuiz(quiz.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        Đóng bài thi
                      </button>
                    )}
                    {quiz.trangThaiQuiz === 'closed' && (
                      <button
                        onClick={() => handleDeleteClosedQuiz(quiz.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa bài thi
                      </button>
                    )}
                    {quiz.trangThaiQuiz !== 'closed' && (
                      <button 
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
                        ))}
            </div>
          )}

        {/* Empty State */}
        {!loading && !error && filteredQuizzes.length === 0 && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài kiểm tra nào</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Không tìm thấy bài kiểm tra phù hợp với tiêu chí tìm kiếm'
                  : 'Hãy tạo bài kiểm tra đầu tiên của bạn'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button
                  onClick={() => navigate('/teacher/quiz/add')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo bài kiểm tra đầu tiên
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizManagement; 