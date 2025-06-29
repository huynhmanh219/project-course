import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  BookOpen, 
  Edit, 
  ArrowLeft, 
  Plus, 
  PlayCircle, 
  Clock, 
  ChevronRight,
  Book,
  Video,
  GraduationCap,
  Calendar,
  Award,
  Settings,
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleCourseService, simpleChapterService } from '../../../services';

interface Chapter {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  order_index: number;
  status: string;
  lecture_count?: number;
  total_duration?: number;
  lectures?: any[];
}

interface Course {
  id: number;
  subject_name: string;
  subject_code: string;
  description?: string;
  credits: number;
  lecturer: {
    first_name: string;
    last_name: string;
  };
  semester?: string;
  academic_year?: string;
  status: string;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingChapters, setLoadingChapters] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseDetail();
    }
  }, [id]);

  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      setError('');

      // Load course info
      const courseResponse = await simpleCourseService.getCourse(Number(id));
      console.log('Course detail response:', courseResponse);
      
      if (courseResponse.course) {
        setCourse(courseResponse.course);
        
        // Load chapters for this course
        await loadChapters(courseResponse.course.id);
      } else {
        setError('Không tìm thấy thông tin môn học');
      }

    } catch (error: any) {
      console.error('Error loading course detail:', error);
      setError(error.message || 'Lỗi khi tải thông tin môn học');
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async (subjectId: number) => {
    try {
      setLoadingChapters(true);
      console.log(`Loading chapters for subject ${subjectId}...`);
      
      const chaptersData = await simpleChapterService.getChaptersBySubject(subjectId);
      console.log('Chapters data:', chaptersData);
      console.log('Chapters data type:', typeof chaptersData);
      console.log('Is array:', Array.isArray(chaptersData));
      console.log('Chapters length:', chaptersData?.length);
      
      if (Array.isArray(chaptersData)) {
        console.log('Processing chapters with stats...');
        // Load lecture stats for each chapter
        const chaptersWithStats = await Promise.all(
          chaptersData.map(async (chapter: Chapter) => {
            try {
              console.log(`Loading stats for chapter ${chapter.id}: ${chapter.title}`);
              const stats = await simpleChapterService.getChapterStats(chapter.id);
              console.log(`Stats for chapter ${chapter.id}:`, stats);
              return {
                ...chapter,
                lecture_count: stats.lecture_count,
                total_duration: stats.total_duration
              };
            } catch (statsError) {
              console.warn(`Failed to load stats for chapter ${chapter.id}:`, statsError);
              return {
                ...chapter,
                lecture_count: 0,
                total_duration: 0
              };
            }
          })
        );
        
        console.log('Final chapters with stats:', chaptersWithStats);
        setChapters(chaptersWithStats);
      } else {
        console.log('Chapters data is not an array, setting empty array');
        setChapters([]);
      }
    } catch (error: any) {
      console.error('Error loading chapters:', error);
      console.error('Error details:', error.message, error.stack);
      setChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const confirmMessage = `Bạn có chắc chắn muốn xóa chương "${chapter.title}" không?\n\nHành động này sẽ xóa tất cả bài giảng trong chương và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await simpleChapterService.deleteChapter(chapterId);
        
        // Remove from local state
        setChapters(chapters.filter(c => c.id !== chapterId));
        alert('Đã xóa chương thành công!');
      } catch (error: any) {
        console.error('Error deleting chapter:', error);
        alert(`Lỗi khi xóa chương: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin môn học...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-800 mb-4">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/teacher/courses')} variant="outline">
                  Quay về danh sách môn học
                </Button>
                <Button onClick={loadCourseDetail} className="bg-red-600 hover:bg-red-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Không tìm thấy thông tin môn học</p>
              <Button onClick={() => navigate('/teacher/courses')} variant="outline">
                Quay về danh sách môn học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const ChapterCard: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {chapter.title}
              </h3>
              {chapter.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {chapter.description}
                </p>
              )}
            </div>
            <div className="ml-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${chapter.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <Book className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              <span>{chapter.lecture_count || 0} bài giảng</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{chapter.total_duration || 0} phút</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate(`/teacher/courses/${id}/chapters/${chapter.id}/lectures`)}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Xem bài giảng
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/teacher/courses/${id}/chapters/${chapter.id}/edit`)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleDeleteChapter(chapter.id)}
            >
              ×
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/teacher/courses')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex-1">
            <nav className="text-sm text-gray-500">
              <span>Môn học</span> <ChevronRight className="w-4 h-4 inline mx-1" /> 
              <span className="text-gray-800 font-medium">{course.subject_name}</span>
            </nav>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-8 h-8" />
                  <div>
                    <h1 className="text-3xl font-bold">{course.subject_name}</h1>
                    <p className="text-blue-100 text-lg">{course.subject_code}</p>
                  </div>
                </div>
                
                {course.description && (
                  <p className="text-blue-100 mb-4 max-w-2xl">
                    {course.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{course.credits} tín chỉ</span>
                  </div>
                  {course.semester && (
                    <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{course.semester}</span>
                    </div>
                  )}
                  {course.academic_year && (
                    <div className="bg-white/20 px-3 py-1 rounded-full">
                      <span>{course.academic_year}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-blue-100">
                  <Users className="w-4 h-4" />
                  <span>Giảng viên: {course.lecturer?.first_name} {course.lecturer?.last_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => navigate(`/teacher/courses/edit/${id}`)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt môn học
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chapters'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chương học ({chapters.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6 text-center">
                      <Book className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-blue-700">{chapters.length}</div>
                      <p className="text-blue-600 font-medium">Chương học</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6 text-center">
                      <Video className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-green-700">
                        {chapters.reduce((total, chapter) => total + (chapter.lecture_count || 0), 0)}
                      </div>
                      <p className="text-green-600 font-medium">Bài giảng</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-purple-700">
                        {Math.round(chapters.reduce((total, chapter) => total + (chapter.total_duration || 0), 0) / 60)}h
                      </div>
                      <p className="text-purple-600 font-medium">Tổng thời lượng</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Course Overview */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Mô tả môn học</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {course.description || 'Chưa có mô tả cho môn học này.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'chapters' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh sách chương</h2>
                    <p className="text-gray-600">Quản lý nội dung theo từng chương học</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/teacher/courses/${id}/chapters/add`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo chương mới
                  </Button>
                </div>

                {loadingChapters ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách chương...</p>
                  </div>
                ) : chapters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chapters
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((chapter) => (
                        <ChapterCard key={chapter.id} chapter={chapter} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Chưa có chương nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Bắt đầu tạo chương đầu tiên cho môn học này
                    </p>
                    <Button 
                      onClick={() => navigate(`/teacher/courses/${id}/chapters/add`)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo chương đầu tiên
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 