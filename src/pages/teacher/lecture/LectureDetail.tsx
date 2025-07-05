import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen, Calendar, Hash, FileText, Clock, GraduationCap, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleLectureService, simpleChapterService, simpleCourseService } from '../../../services';

interface Lecture {
  id: number;
  title: string;
  content?: string;
  chapter_id: number;
  duration_minutes?: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Chapter {
  id: number;
  title: string;
  subject_id: number;
}

interface Course {
  id: number;
  subject_name: string;
  subject_code: string;
}

const LectureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, chapterId, lectureId } = useParams<{ 
    courseId: string; 
    chapterId: string; 
    lectureId: string; 
  }>();
  
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  void isBookmarked;
  void setIsBookmarked;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId && chapterId && lectureId) {
      loadData();
    }
  }, [courseId, chapterId, lectureId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load course info
      const courseResponse = await simpleCourseService.getCourse(Number(courseId));
      if (courseResponse.course) {
        setCourse(courseResponse.course);
      }

      // Load chapter info
      const chapterResponse = await simpleChapterService.getChapter(Number(chapterId));
      if (chapterResponse) {
        setChapter(chapterResponse);
      }

      // Load lecture info
      const lectureResponse = await simpleLectureService.getLecture(Number(lectureId));
      if (lectureResponse) {
        setLecture(lectureResponse);
      } else {
        setError('Không tìm thấy bài giảng');
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Lỗi khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: boolean) => {
    return status 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error || 'Không tìm thấy bài giảng'}</div>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-3">Chi tiết bài giảng</h1>
                  <p className="text-blue-100 text-lg">Quản lý và xem nội dung bài giảng</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{lecture.duration_minutes || 0}</div>
                  <div className="text-blue-100 text-sm">Phút đọc</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">#{lecture.order_index}</div>
                  <div className="text-blue-100 text-sm">Thứ tự</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures/${lecture.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture Info Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                    <BookOpen className="text-white w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(lecture.is_published)}`}>
                        {lecture.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Bài {lecture.order_index}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{lecture.title}</h2>
                    <div className="text-gray-600 mb-4">
                      <span className="text-sm">Thuộc chương: </span>
                      <span className="font-semibold">{chapter?.title}</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Content Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-gradient-to-tr from-green-500 to-emerald-500 p-3 shadow-lg">
                    <FileText className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Nội dung bài giảng</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  {lecture.content ? (
                    <div className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                      {lecture.content}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-8">
                      Chưa có nội dung bài giảng
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 shadow-lg">
                    <GraduationCap className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thông tin môn học</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Tên môn học</p>
                    <p className="text-gray-800 font-bold">{course?.subject_name}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Mã môn học</p>
                    <p className="text-gray-800 font-bold">{course?.subject_code}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Chương</p>
                    <p className="text-gray-800 font-bold">{chapter?.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 p-2 shadow-lg">
                    <Calendar className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thời gian</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày tạo</p>
                      <p className="font-semibold text-gray-800">{formatDate(lecture.created_at)}</p>
                    </div>
                  </div>
                  {lecture.updated_at && lecture.updated_at !== lecture.created_at && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                        <p className="font-semibold text-gray-800">{formatDate(lecture.updated_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-2 shadow-lg">
                    <Star className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thống kê</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">{lecture.duration_minutes || 0}</p>
                    <p className="text-xs text-gray-600">Phút đọc</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {lecture.content ? Math.ceil(lecture.content.length / 100) : 0}
                    </p>
                    <p className="text-xs text-gray-600">Độ dài nội dung</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetail;
