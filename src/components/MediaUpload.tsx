import React, { useState } from 'react';
import { Upload, Video, Image, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface MediaUploadProps {
  onVideoSelect?: (file: File | null) => void;
  onThumbnailSelect?: (file: File | null) => void;
  videoProgress?: number;
  thumbnailProgress?: number;
  uploading?: boolean;
  className?: string;
}

interface FileValidation {
  valid: boolean;
  error?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  onVideoSelect,
  onThumbnailSelect,
  videoProgress = 0,
  thumbnailProgress = 0,
  uploading = false,
  className = ""
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ video?: string; thumbnail?: string }>({});

  const validateVideo = (file: File): FileValidation => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Định dạng video không được hỗ trợ. Chọn MP4, AVI, MOV, WMV, FLV hoặc WebM.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File video quá lớn. Vui lòng chọn file nhỏ hơn 500MB.'
      };
    }

    return { valid: true };
  };

  const validateImage = (file: File): FileValidation => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Định dạng ảnh không được hỗ trợ. Chọn JPG, PNG, GIF hoặc WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 10MB.'
      };
    }

    return { valid: true };
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateVideo(file);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, video: validation.error }));
        return;
      }

      setVideoFile(file);
      setErrors(prev => ({ ...prev, video: undefined }));
      
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      onVideoSelect?.(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImage(file);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, thumbnail: validation.error }));
        return;
      }

      setThumbnailFile(file);
      setErrors(prev => ({ ...prev, thumbnail: undefined }));
      
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      onThumbnailSelect?.(file);
    }
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    setErrors(prev => ({ ...prev, video: undefined }));
    onVideoSelect?.(null);
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setErrors(prev => ({ ...prev, thumbnail: undefined }));
    onThumbnailSelect?.(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Video className="w-4 h-4" />
          Video bài giảng
        </label>
        
        {!videoFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="space-y-2">
              <p className="text-gray-600">Kéo thả video vào đây hoặc</p>
              <Button variant="outline" className="relative">
                <Upload className="w-4 h-4 mr-2" />
                Chọn video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Button>
              <p className="text-xs text-gray-500">
                Hỗ trợ: MP4, AVI, MOV, WMV, FLV, WebM. Tối đa: 500MB
              </p>
            </div>
          </div>
        ) : (
          <Card className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{videoFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(videoFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeVideo}
                  disabled={uploading}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {uploading && videoProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đang upload video...</span>
                    <span>{videoProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {videoProgress === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Video đã upload thành công!</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {errors.video && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.video}</span>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Image className="w-4 h-4" />
          Ảnh thumbnail (tuỳ chọn)
        </label>
        
        {!thumbnailFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="space-y-2">
              <p className="text-gray-600">Kéo thả ảnh thumbnail vào đây hoặc</p>
              <Button variant="outline" className="relative">
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Button>
              <p className="text-xs text-gray-500">
                Hỗ trợ: JPG, PNG, GIF, WebP. Tối đa: 10MB
              </p>
            </div>
          </div>
        ) : (
          <Card className="relative">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {thumbnailPreview && (
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{thumbnailFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(thumbnailFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeThumbnail}
                  disabled={uploading}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {uploading && thumbnailProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đang upload thumbnail...</span>
                    <span>{thumbnailProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${thumbnailProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {thumbnailProgress === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thumbnail đã upload thành công!</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {errors.thumbnail && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.thumbnail}</span>
          </div>
        )}
      </div>
        
      {(videoFile || thumbnailFile) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Files sẵn sàng upload:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              {videoFile && <p>✓ Video: {videoFile.name}</p>}
              {thumbnailFile && <p>✓ Thumbnail: {thumbnailFile.name}</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUpload; 