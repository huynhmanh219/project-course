import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, BookOpen, Upload, Tag, Video, Image, AlertCircle, CheckCircle, Loader, Download, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleMaterialService, type UpdateMaterialData, type Material } from '../../../services/material.service.simple';
import { simpleChapterService } from '../../../services/chapter.service.simple';
import { simpleCourseService } from '../../../services/course.service.simple';

interface Subject {
  id: number;
  subject_name: string;
  subject_code: string;
}

interface Chapter {
  id: number;
  title: string;
  subject_id: number;
}

const MaterialEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    material_type: 'document' as 'document' | 'video' | 'image',
    subject_id: '',
    chapter_id: '',
    is_public: true
  });
  
  // Original material data
  const [originalMaterial, setOriginalMaterial] = useState<Material | null>(null);
  
  // File handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingMaterial, setLoadingMaterial] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
  // Data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  // UI states
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Load material details on mount
  useEffect(() => {
    if (id) {
      loadMaterial(Number(id));
      loadSubjects();
    } else {
      setError('ID tài liệu không hợp lệ');
      setLoadingMaterial(false);
    }
  }, [id]);

  // Load chapters when subject changes
  useEffect(() => {
    if (formData.subject_id) {
      loadChapters(Number(formData.subject_id));
    } else {
      setChapters([]);
      setFormData(prev => ({ ...prev, chapter_id: '' }));
    }
  }, [formData.subject_id]);

  const loadMaterial = async (materialId: number) => {
    try {
      setLoadingMaterial(true);
      setError('');
      
      console.log(`Loading material ${materialId}...`);
      const material = await simpleMaterialService.getMaterialDetails(materialId);
      console.log('Material details:', material);
      
      setOriginalMaterial(material);
      setFormData({
        title: material.title || '',
        description: material.description || '',
        material_type: (material.material_type === 'document' || material.material_type === 'video' || material.material_type === 'image') 
          ? material.material_type 
          : 'document',
        subject_id: material.subject_id ? String(material.subject_id) : '',
        chapter_id: material.chapter_id ? String(material.chapter_id) : '',
        is_public: material.is_public !== undefined ? material.is_public : true
      });
      
    } catch (err: any) {
      console.error('Error loading material:', err);
      setError('Không thể tải thông tin tài liệu: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoadingMaterial(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      
      console.log('Loading subjects...');
      const response = await simpleCourseService.getCourses({ page: 1, size: 100 });
      console.log('Subjects response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setSubjects(response.data);
        console.log(`Loaded ${response.data.length} subjects`);
      } else if (response && response.items && Array.isArray(response.items)) {
        setSubjects(response.items);
        console.log(`Loaded ${response.items.length} subjects`);
      } else {
        console.error('Invalid subjects response format:', response);
        setSubjects([]);
      }
    } catch (err: any) {
      console.error('Error loading subjects:', err);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadChapters = async (subjectId: number) => {
    try {
      setLoadingChapters(true);
      console.log(`Loading chapters for subject ${subjectId}...`);
      
      const response = await simpleChapterService.getChapters({ 
        subject_id: subjectId, 
        page: 1, 
        limit: 100 
      });
      console.log('Chapters response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setChapters(response.data);
        console.log(`Loaded ${response.data.length} chapters`);
      } else if (response && response.items && Array.isArray(response.items)) {
        setChapters(response.items);
        console.log(`Loaded ${response.items.length} chapters`);
      } else {
        console.log('No chapters found or invalid format');
        setChapters([]);
      }
    } catch (err: any) {
      console.error('Error loading chapters:', err);
      setChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Vui lòng nhập tên tài liệu';
    if (!formData.subject_id) return 'Vui lòng chọn môn học';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('ID tài liệu không hợp lệ');
      return;
    }
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setUploadProgress(0);

      // Update material metadata
      const updateData: UpdateMaterialData = {
        title: formData.title,
        description: formData.description,
        material_type: formData.material_type,
        is_public: formData.is_public
      };

      await simpleMaterialService.updateMaterial(Number(id), updateData);

      // If there's a new file, upload it
      if (selectedFile) {
        // TODO: Implement file replacement API endpoint
        console.log('File replacement not implemented yet:', selectedFile.name);
      }

      setSuccess('Tài liệu đã được cập nhật thành công!');
      setTimeout(() => {
        navigate('/teacher/materials');
      }, 2000);

    } catch (err: any) {
      console.error('Submit error:', err);
      setError('Lỗi cập nhật tài liệu: ' + (err.message || 'Lỗi không xác định'));
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (originalMaterial && originalMaterial.id) {
      try {
        await simpleMaterialService.downloadMaterial(originalMaterial.id, originalMaterial.file_name);
      } catch (err: any) {
        setError('Lỗi tải xuống: ' + err.message);
      }
    }
  };

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'image': return Image;
      default: return FileText;
    }
  };

  const getAcceptedFileTypes = (type: string): string => {
    switch (type) {
      case 'document': return '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt';
      case 'video': return '.mp4,.avi,.mov,.wmv,.flv,.webm';
      case 'image': return '.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp';
      default: return '*';
    }
  };

  const getFileTypesDescription = (type: string): string => {
    switch (type) {
      case 'document': return 'PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT';
      case 'video': return 'MP4, AVI, MOV, WMV, FLV, WEBM';
      case 'image': return 'JPG, JPEG, PNG, GIF, BMP, SVG, WEBP';
      default: return 'Tất cả định dạng';
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loadingMaterial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải thông tin tài liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/teacher/materials')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Chỉnh sửa tài liệu</h1>
                  <p className="text-blue-100 text-lg mt-1">Cập nhật thông tin tài liệu học tập</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Current File Info */}
        {originalMaterial && (
          <Card className="shadow-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 Thông tin file hiện tại</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên file:</p>
                  <p className="font-medium text-gray-800">{originalMaterial.file_name || 'Không có file'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kích thước:</p>
                  <p className="font-medium text-gray-800">{formatFileSize(originalMaterial.file_size) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Loại:</p>
                  <p className="font-medium text-gray-800">{originalMaterial.material_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tạo:</p>
                  <p className="font-medium text-gray-800">
                    {originalMaterial.created_at ? new Date(originalMaterial.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
              {originalMaterial.file_name && (
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleDownload}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống
                  </Button>
                  {originalMaterial.material_type === 'image' && (
                    <Button variant="outline" onClick={handleDownload}>
                      <Eye className="w-4 h-4 mr-2" />
                      Xem trước
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Form */}
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Material Type Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  Loại tài liệu <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'document', label: 'Tài liệu' },
                    { value: 'video', label: 'Video' },
                    { value: 'image', label: 'Hình ảnh' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange('material_type', value)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        formData.material_type === value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Định dạng hỗ trợ: {getFileTypesDescription(formData.material_type)}
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Môn học <span className="text-red-500">*</span>
                  </label>
                  {loadingSubjects ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-gray-500">Đang tải môn học...</span>
                    </div>
                  ) : (
                    <select
                      value={formData.subject_id}
                      onChange={(e) => handleInputChange('subject_id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                      required
                    >
                      <option value="">Chọn môn học...</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.subject_code} - {subject.subject_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Chương (tùy chọn)
                  </label>
                  {loadingChapters ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-gray-500">Đang tải chương...</span>
                    </div>
                  ) : (
                    <select
                      value={formData.chapter_id}
                      onChange={(e) => handleInputChange('chapter_id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                      disabled={!formData.subject_id}
                    >
                      <option value="">Không gán vào chương cụ thể</option>
                      {chapters.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Tên tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Nhập tên tài liệu"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về tài liệu"
                />
              </div>

              {/* File Replace */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  Thay đổi file (tùy chọn)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept={getAcceptedFileTypes(formData.material_type)}
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {selectedFile && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      🆕 File mới: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-500">Để trống nếu không muốn thay đổi file hiện tại</p>
              </div>

              {/* Upload Progress */}
              {loading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đang cập nhật...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Public/Private Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Quyền truy cập</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_public"
                      checked={formData.is_public === true}
                      onChange={() => handleInputChange('is_public', true)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">🌐 Công khai</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_public"
                      checked={formData.is_public === false}
                      onChange={() => handleInputChange('is_public', false)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">🔒 Riêng tư</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => navigate('/teacher/materials')}
                  className="px-8 py-3 hover:bg-gray-100 font-semibold"
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Lưu thay đổi
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

export default MaterialEdit; 