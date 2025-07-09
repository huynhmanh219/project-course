import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import DocumentEditor from '../../../components/DocumentEditor';
import { simpleLectureService, simpleChapterService, simpleCourseService } from '../../../services';

interface Course {
  id: number;
  subject_name: string;
  subject_code: string;
}

interface Chapter {
  id: number;
  title: string;
  subject_id: number;
}

interface Lecture {
  id: number;
  title: string;
  content: string;
  duration_minutes?: number;
  is_published: boolean;
}

const LectureEdit: React.FC = () => {
  const { courseId, chapterId, lectureId } = useParams<{ 
    courseId: string; 
    chapterId: string; 
    lectureId: string; 
  }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    duration_minutes: '',
    is_published: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (courseId && chapterId && lectureId) {
      loadData();
    }
  }, [courseId, chapterId, lectureId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [courseResponse, chapterResponse, lectureResponse] = await Promise.all([
        simpleCourseService.getCourse(Number(courseId)),
        simpleChapterService.getChapter(Number(chapterId)),
        simpleLectureService.getLecture(Number(lectureId))
      ]);

      console.log('Course info response:', courseResponse);
      console.log('Chapter info response:', chapterResponse);
      console.log('Lecture info response:', lectureResponse);
      
      if (courseResponse.course) {
        setCourse(courseResponse.course);
      }

      if (chapterResponse) {
        setChapter(chapterResponse);
      }

      if (lectureResponse) {
        setLecture(lectureResponse);
        setFormData({
          title: lectureResponse.title || '',
          content: lectureResponse.content || '',
          duration_minutes: lectureResponse.duration_minutes?.toString() || '',
          is_published: lectureResponse.is_published || false
        });
      } else {
        setError('Không tìm thấy thông tin bài giảng');
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Lỗi khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleContentChange = useCallback((content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
    
    if (formErrors.content) {
      setFormErrors(prev => ({
        ...prev,
        content: ''
      }));
    }
  }, [formErrors.content]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Tiêu đề bài giảng là bắt buộc';
    } else if (formData.title.length > 255) {
      errors.title = 'Tiêu đề không được vượt quá 255 ký tự';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Nội dung bài giảng là bắt buộc';
    }
    
    const duration = parseInt(formData.duration_minutes);
    if (formData.duration_minutes && (isNaN(duration) || duration < 1)) {
      errors.duration_minutes = 'Thời lượng phải là số nguyên dương';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!lecture) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        is_published: formData.is_published
      };
      
      console.log('Updating lecture:', updateData);
      
      const updatedLecture = await simpleLectureService.updateLecture(Number(lectureId), updateData);
      console.log('Lecture updated:', updatedLecture);
      
      setSuccess('Bài giảng đã được cập nhật thành công!');
      
      setTimeout(() => {
        navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating lecture:', error);
      setError(error.message || 'Lỗi khi cập nhật bài giảng');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin bài giảng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !lecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-800 mb-4">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`)} 
                  variant="outline"
                >
                  Quay về danh sách bài giảng
                </Button>
                <Button onClick={loadData} className="bg-red-600 hover:bg-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline" 
            onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex-1">
            <nav className="text-sm text-gray-500 mb-2">
              <span>Môn học</span> <ChevronRight className="w-4 h-4 inline mx-1" /> 
              <span>{course?.subject_name}</span> <ChevronRight className="w-4 h-4 inline mx-1" />
              <span>Chương: {chapter?.title}</span> <ChevronRight className="w-4 h-4 inline mx-1" />
              <span className="text-gray-800 font-medium">Chỉnh sửa bài giảng</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa: {lecture?.title}</h1>
          </div>
        </div>

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{success}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Tiêu đề bài giảng *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="VD: Bài 1: Giới thiệu về lập trình"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={saving}
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="duration_minutes" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4" />
                      Thời lượng đọc (phút)
                    </label>
                    <input
                      type="number"
                      id="duration_minutes"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleInputChange}
                      placeholder="VD: 15"
                      min="1"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.duration_minutes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={saving}
                    />
                    {formErrors.duration_minutes && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.duration_minutes}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">Ước tính thời gian đọc nội dung</p>
                  </div>
                      
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      {formData.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      Trạng thái xuất bản
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        disabled={saving}
                      />
                      <span className="text-sm text-gray-700">
                        {formData.is_published ? 'Xuất bản ngay' : 'Lưu nháp'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Content */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Nội dung bài giảng *
                </h3>
                <p className="text-gray-600">
                  Chỉnh sửa nội dung chi tiết với nhiều đoạn văn, tiêu đề và danh sách
                </p>
                {formErrors.content && (
                  <p className="text-red-600 text-sm mt-2">{formErrors.content}</p>
                )}
              </div>
              
              <DocumentEditor
                initialContent={formData.content}
                onChange={handleContentChange}
                disabled={saving}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`)}
                  disabled={saving}
                >
                  Hủy
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Cập nhật bài giảng
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default LectureEdit;
