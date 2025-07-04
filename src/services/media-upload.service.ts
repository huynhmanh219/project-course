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

  async uploadVideo(lectureId: number, videoFile: File, onProgress?: (progress: UploadProgress) => void): Promise<any> {
    try {
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const headers = this.getHeaders();
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
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
        
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
        
        xhr.send(formData);
      });
    } catch (error: any) {
      throw error;
    }
  }

  async uploadThumbnail(lectureId: number, imageFile: File, onProgress?: (progress: UploadProgress) => void): Promise<any> {
    try {
      
      const formData = new FormData();
      formData.append('thumbnail', imageFile);
      
      const headers = this.getHeaders();
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
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
        
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
        
        xhr.send(formData);
      });
    } catch (error: any) {
      throw error;
    }
  }

  async uploadVideoAndThumbnail(
    lectureId: number, 
    videoFile: File, 
    thumbnailFile: File,
    onVideoProgress?: (progress: UploadProgress) => void,
    onThumbnailProgress?: (progress: UploadProgress) => void
  ): Promise<{video: any, thumbnail: any}> {
    try {
      
      const [videoResult, thumbnailResult] = await Promise.all([
        this.uploadVideo(lectureId, videoFile, onVideoProgress),
        this.uploadThumbnail(lectureId, thumbnailFile, onThumbnailProgress)
      ]);
      
      return {
        video: videoResult,
        thumbnail: thumbnailResult
      };
    } catch (error: any) {      
      throw error;
    }
  }

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

  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }


  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const mediaUploadService = new MediaUploadService(); 