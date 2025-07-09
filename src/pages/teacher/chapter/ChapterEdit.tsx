import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Book, 
  FileText, 
  Hash,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleChapterService, simpleCourseService } from '../../../services';

interface Course {
  id: number;
  subject_name: string;
  subject_code: string;
}

interface Chapter {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  order_index: number;
  status: 'active' | 'inactive';
}

const ChapterEdit: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  

  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: '',
    status: 'active'
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (courseId && chapterId) {
      loadData();
    }
  }, [courseId, chapterId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
     
      const courseResponse = await simpleCourseService.getCourse(Number(courseId));
     
      
      if (courseResponse.course) {
        setCourse(courseResponse.course);
      }

     
      const chapterResponse = await simpleChapterService.getChapter(Number(chapterId));
     
      
      if (chapterResponse) {
        setChapter(chapterResponse);
        setFormData({
          title: chapterResponse.title || '',
          description: chapterResponse.description || '',
          order_index: chapterResponse.order_index?.toString() || '1',
          status: chapterResponse.status || 'active'
        });
      } else {
        setError('Không tìm thấy thông tin chương');
      }
    } catch (error: any) {
     
      setError(error.message || 'Lỗi khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
   
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Tiêu đề chương là bắt buộc';
    } else if (formData.title.length > 255) {
      errors.title = 'Tiêu đề không được vượt quá 255 ký tự';
    }
    
    if (formData.description.length > 1000) {
      errors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }
    
    const orderIndex = parseInt(formData.order_index);
    if (!formData.order_index || isNaN(orderIndex) || orderIndex < 1) {
      errors.order_index = 'Thứ tự phải là số nguyên dương';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!chapter || !course) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        order_index: parseInt(formData.order_index),
        status: formData.status as 'active' | 'inactive'
      };
      
      
      const updatedChapter = await simpleChapterService.updateChapter(chapter.id, updateData);
      console.log('Chapter updated:', updatedChapter);
      
      setSuccess('Chương đã được cập nhật thành công!');
      
     
      setTimeout(() => {
        navigate(`/teacher/courses/${courseId}`);
      }, 1500);
      
    } catch (error: any) {
     
      setError(error.message || 'Lỗi khi cập nhật chương');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-800 mb-4">{error}</p>
              <Button onClick={() => navigate(`/teacher/courses/${courseId}`)} variant="outline">
                Quay về môn học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/teacher/courses/${courseId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa chương</h1>
            {course && chapter && (
              <p className="text-gray-600">
                Môn học: <span className="font-medium">{course.subject_name}</span> ({course.subject_code})
              </p>
            )}
          </div>
        </div>

        {/* Success Message */}
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

        {/* Error Message */}
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

        {/* Form */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Book className="w-4 h-4" />
                  Tiêu đề chương *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="VD: Chương 1: Giới thiệu về lập trình"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={saving}
                />
                {formErrors.title && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Mô tả chương
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả nội dung và mục tiêu của chương này..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={saving}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.description && (
                    <p className="text-red-600 text-sm">{formErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-sm ml-auto">
                    {formData.description.length}/1000 ký tự
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Index */}
                <div>
                  <label htmlFor="order_index" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4" />
                    Thứ tự *
                  </label>
                  <input
                    type="number"
                    id="order_index"
                    name="order_index"
                    value={formData.order_index}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.order_index ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={saving}
                  />
                  {formErrors.order_index && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.order_index}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    {formData.status === 'active' ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/teacher/courses/${courseId}`)}
                  disabled={saving}
                  className="flex-1 md:flex-none"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Cập nhật chương
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChapterEdit; 