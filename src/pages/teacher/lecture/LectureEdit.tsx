import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Video, 
  FileText, 
  Clock,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  CheckCircle2,
  Play,
  RefreshCw,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
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
  chapter_id: number;
  title: string;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const LectureEdit: React.FC = () => {
  const { courseId, chapterId, lectureId } = useParams<{ courseId: string; chapterId: string; lectureId: string }>();
  const navigate = useNavigate();
  
  // States
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    duration_minutes: '',
    is_published: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

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
      console.log('Course info response:', courseResponse);
      
      if (courseResponse.course) {
        setCourse(courseResponse.course);
      }

      // Load chapter info
      const chapterResponse = await simpleChapterService.getChapter(Number(chapterId));
      console.log('Chapter info response:', chapterResponse);
      
      if (chapterResponse) {
        setChapter(chapterResponse);
      }

      // Load lecture info
      const lectureResponse = await simpleLectureService.getLecture(Number(lectureId));
      console.log('Lecture info response:', lectureResponse);
      
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
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
      if (!allowedTypes.includes(file.type)) {
        setError('Định dạng video không được hỗ trợ. Vui lòng chọn file MP4, AVI, MOV, WMV hoặc FLV.');
        return;
      }

      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        setError('File video quá lớn. Vui lòng chọn file nhỏ hơn 500MB.');
        return;
      }

      setVideoFile(file);
      setError('');
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      // Try to extract video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const durationInMinutes = Math.ceil(video.duration / 60);
        setFormData(prev => ({
          ...prev,
          duration_minutes: durationInMinutes.toString()
        }));
        URL.revokeObjectURL(video.src);
      };
      video.src = previewUrl;
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Tiêu đề bài giảng là bắt buộc';
    } else if (formData.title.length > 255) {
      errors.title = 'Tiêu đề không được vượt quá 255 ký tự';
    }
    
    if (formData.content.length > 2000) {
      errors.content = 'Nội dung không được vượt quá 2000 ký tự';
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
    if (!lecture || !chapter || !course) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim() || undefined,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        is_published: formData.is_published
      };
      
      console.log('Updating lecture:', updateData);
      
      const updatedLecture = await simpleLectureService.updateLecture(lecture.id, updateData);
      console.log('Lecture updated:', updatedLecture);
      
      // Upload video if selected
      if (videoFile) {
        setUploading(true);
        setUploadProgress(0);
        
        try {
          await simpleLectureService.uploadVideo(
            lecture.id, 
            videoFile,
            (progress) => setUploadProgress(progress)
          );
          console.log('Video uploaded successfully');
        } catch (uploadError: any) {
          console.error('Video upload error:', uploadError);
          setError(`Bài giảng đã được cập nhật nhưng upload video thất bại: ${uploadError.message}`);
          setUploading(false);
          return;
        }
        
        setUploading(false);
      }
      
      setSuccess('Bài giảng đã được cập nhật thành công!');
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating lecture:', error);
      setError(error.message || 'Lỗi khi cập nhật bài giảng');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-800 mb-4">{error}</p>
              <Button onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`)} variant="outline">
                Quay về danh sách bài giảng
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
              <span className="text-gray-800 font-medium">Chỉnh sửa: {lecture?.title}</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài giảng</h1>
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

        {/* Upload Progress */}
        {uploading && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-800">
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Đang upload video...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-700">{uploadProgress}% hoàn thành</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Video Info */}
        {lecture && lecture.video_url && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-blue-800">
                <Video className="w-5 h-5" />
                <span className="font-medium">Video hiện tại đã được upload</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Upload video mới sẽ thay thế video cũ
              </p>
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
                  <Video className="w-4 h-4" />
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
                  disabled={saving || uploading}
                />
                {formErrors.title && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Nội dung bài giảng
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Mô tả nội dung, mục tiêu học tập và các kiến thức sẽ học trong bài giảng này..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    formErrors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={saving || uploading}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.content && (
                    <p className="text-red-600 text-sm">{formErrors.content}</p>
                  )}
                  <p className="text-gray-500 text-sm ml-auto">
                    {formData.content.length}/2000 ký tự
                  </p>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label htmlFor="video" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4" />
                  Video bài giảng
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    id="video"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving || uploading}
                  />
                  <p className="text-sm text-gray-500">
                    Hỗ trợ: MP4, AVI, MOV, WMV, FLV. Kích thước tối đa: 500MB
                  </p>
                  
                  {videoPreview && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Play className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{videoFile?.name}</span>
                        <span className="text-gray-500">
                          ({Math.round((videoFile?.size || 0) / (1024 * 1024))}MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration */}
                <div>
                  <label htmlFor="duration_minutes" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4" />
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    placeholder="VD: 30"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.duration_minutes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={saving || uploading}
                  />
                  {formErrors.duration_minutes && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.duration_minutes}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">Sẽ tự động phát hiện nếu upload video</p>
                </div>

                {/* Publish Status */}
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
                      disabled={saving || uploading}
                    />
                    <span className="text-sm text-gray-700">
                      {formData.is_published ? 'Đã xuất bản' : 'Lưu nháp'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lectures`)}
                  disabled={saving || uploading}
                  className="flex-1 md:flex-none"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                >
                  {saving || uploading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      {uploading ? 'Đang upload...' : 'Đang cập nhật...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Cập nhật bài giảng
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

export default LectureEdit; 