import { API_BASE_URL } from './api';
import { authService } from './auth.service';

interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

class MediaUploadService {
  private getHeaders(): Record<string, string> {
    const token = authService.getToken();
    return {
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Upload video file for lecture
  async uploadVideo(lectureId: number, videoFile: File, onProgress?: (progress: UploadProgress) => void): Promise<any> {
    try {
      console.log(`Uploading video for lecture ${lectureId}:`, videoFile.name);
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const headers = this.getHeaders();
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Upload progress tracking
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress({
              progress,
              loaded: e.loaded,
              total: e.total
            });
          }
        });
        
        xhr.addEventListener('load', () => {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log('Upload video response:', result);
            
            if (xhr.status === 200) {
              resolve(result.data || result);
            } else {
              if (xhr.status === 401) {
                authService.logout();
                window.location.href = '/login';
                return;
              }
              reject(new Error(result.message || 'Failed to upload video'));
            }
          } catch (parseError) {
            reject(new Error('Invalid response from server'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during video upload'));
        });
        
        xhr.open('POST', `${API_BASE_URL}/lectures/${lectureId}/upload-video`);
        
        // Set headers
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
        
        xhr.send(formData);
      });
    } catch (error: any) {
      console.error('Upload video error:', error);
      throw error;
    }
  }

  // Upload thumbnail image for lecture
  async uploadThumbnail(lectureId: number, imageFile: File, onProgress?: (progress: UploadProgress) => void): Promise<any> {
    try {
      console.log(`Uploading thumbnail for lecture ${lectureId}:`, imageFile.name);
      
      const formData = new FormData();
      formData.append('thumbnail', imageFile);
      
      const headers = this.getHeaders();
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Upload progress tracking
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress({
              progress,
              loaded: e.loaded,
              total: e.total
            });
          }
        });
        
        xhr.addEventListener('load', () => {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log('Upload thumbnail response:', result);
            
            if (xhr.status === 200) {
              resolve(result.data || result);
            } else {
              if (xhr.status === 401) {
                authService.logout();
                window.location.href = '/login';
                return;
              }
              reject(new Error(result.message || 'Failed to upload thumbnail'));
            }
          } catch (parseError) {
            reject(new Error('Invalid response from server'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during thumbnail upload'));
        });
        
        xhr.open('POST', `${API_BASE_URL}/lectures/${lectureId}/upload-thumbnail`);
        
        // Set headers
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
        
        xhr.send(formData);
      });
    } catch (error: any) {
      console.error('Upload thumbnail error:', error);
      throw error;
    }
  }

  // Upload both video and thumbnail simultaneously
  async uploadVideoAndThumbnail(
    lectureId: number, 
    videoFile: File, 
    thumbnailFile: File,
    onVideoProgress?: (progress: UploadProgress) => void,
    onThumbnailProgress?: (progress: UploadProgress) => void
  ): Promise<{video: any, thumbnail: any}> {
    try {
      console.log(`Uploading video and thumbnail for lecture ${lectureId}`);
      
      // Upload both files simultaneously
      const [videoResult, thumbnailResult] = await Promise.all([
        this.uploadVideo(lectureId, videoFile, onVideoProgress),
        this.uploadThumbnail(lectureId, thumbnailFile, onThumbnailProgress)
      ]);
      
      return {
        video: videoResult,
        thumbnail: thumbnailResult
      };
    } catch (error: any) {
      console.error('Upload video and thumbnail error:', error);
      throw error;
    }
  }

  // Validate video file
  validateVideoFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Định dạng video không được hỗ trợ. Vui lòng chọn file MP4, AVI, MOV, WMV, FLV hoặc WebM.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File video quá lớn. Vui lòng chọn file nhỏ hơn 500MB.'
      };
    }

    return { valid: true };
  }

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Định dạng ảnh không được hỗ trợ. Vui lòng chọn file JPG, PNG, GIF hoặc WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 10MB.'
      };
    }

    return { valid: true };
  }

  // Extract video duration
  async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const durationInMinutes = Math.ceil(video.duration / 60);
        URL.revokeObjectURL(video.src);
        resolve(durationInMinutes);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Cannot read video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  }

  // Create preview URL for files
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Cleanup preview URL
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const mediaUploadService = new MediaUploadService(); 