import { API_BASE_URL } from './api';
import { authService } from './auth.service';

interface Lecture {
  id: number;
  chapter_id: number;
  title: string;
  content?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  chapter?: {
    id: number;
    title: string;
    subject_id: number;
  };
  duration_formatted?: string;
}

interface CreateLectureData {
  chapter_id: number;
  title: string;
  content?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  order_index?: number;
  is_published?: boolean;
}

interface UpdateLectureData {
  chapter_id?: number;
  title?: string;
  content?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  order_index?: number;
  is_published?: boolean;
}

interface LectureQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  chapter_id?: number;
  is_published?: boolean;
}

class SimpleLectureService {
  private getHeaders(): Record<string, string> {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // ==================== LECTURE MANAGEMENT ====================
  
  // Get lectures with pagination and filtering
  async getLectures(params?: LectureQueryParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('size', params.limit.toString()); // Backend uses 'size' not 'limit'
      if (params?.search) queryParams.append('search', params.search);
      if (params?.chapter_id) queryParams.append('chapter_id', params.chapter_id.toString());
      if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/lectures${queryString ? `?${queryString}` : ''}`;
      
      console.log(`Getting lectures from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Get lectures response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        // Handle token expiration
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        throw new Error(result.message || 'Failed to fetch lectures');
      }
    } catch (error: any) {
      console.error('Get lectures error:', error);
      throw error;
    }
  }

  // Get lectures by chapter ID
  async getLecturesByChapter(chapterId: number): Promise<Lecture[]> {
    try {
      console.log(`Getting lectures for chapter ${chapterId}...`);
      
      const response = await this.getLectures({ chapter_id: chapterId, limit: 100 });
      
      if (response && response.data) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {
      console.error('Get lectures by chapter error:', error);
      throw error;
    }
  }

  // Get single lecture
  async getLecture(id: number): Promise<any> {
    try {
      console.log(`Getting lecture ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Get lecture response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        throw new Error(result.message || 'Failed to fetch lecture');
      }
    } catch (error: any) {
      console.error('Get lecture error:', error);
      throw error;
    }
  }

  // Create new lecture
  async createLecture(data: CreateLectureData): Promise<Lecture> {
    try {
      console.log('Creating lecture:', data);
      
      const response = await fetch(`${API_BASE_URL}/lectures`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create lecture response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        
        // Enhanced error logging for validation issues
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        
        throw new Error(result.message || 'Failed to create lecture');
      }
    } catch (error: any) {
      console.error('Create lecture error:', error);
      throw error;
    }
  }

  // Update lecture
  async updateLecture(id: number, data: UpdateLectureData): Promise<Lecture> {
    try {
      console.log(`Updating lecture ${id}:`, data);
      
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update lecture response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        
        // Enhanced error logging for validation issues
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        
        throw new Error(result.message || 'Failed to update lecture');
      }
    } catch (error: any) {
      console.error('Update lecture error:', error);
      throw error;
    }
  }

  // Delete lecture
  async deleteLecture(id: number): Promise<any> {
    try {
      console.log(`Deleting lecture ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Delete lecture response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        throw new Error(result.message || 'Failed to delete lecture');
      }
    } catch (error: any) {
      console.error('Delete lecture error:', error);
      throw error;
    }
  }

  // Get lecture attachments/materials
  async getLectureAttachments(lectureId: number): Promise<any> {
    try {
      console.log(`Getting attachments for lecture ${lectureId}...`);
      
      const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/attachments`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Get lecture attachments response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        throw new Error(result.message || 'Failed to fetch lecture attachments');
      }
    } catch (error: any) {
      console.error('Get lecture attachments error:', error);
      throw error;
    }
  }

  // ==================== VIDEO UPLOAD ====================
  
  // Upload video file for lecture
  async uploadVideo(lectureId: number, videoFile: File, onProgress?: (progress: number) => void): Promise<any> {
    try {
      console.log(`Uploading video for lecture ${lectureId}:`, videoFile.name);
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Authorization': token ? `Bearer ${token}` : ''
      };
      // Don't set Content-Type header for FormData, let browser set it with boundary
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Upload progress tracking
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
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
          reject(new Error('Network error during upload'));
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
  async uploadThumbnail(lectureId: number, imageFile: File, onProgress?: (progress: number) => void): Promise<any> {
    try {
      console.log(`Uploading thumbnail for lecture ${lectureId}:`, imageFile.name);
      
      const formData = new FormData();
      formData.append('thumbnail', imageFile);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Authorization': token ? `Bearer ${token}` : ''
      };
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Upload progress tracking
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
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
          reject(new Error('Network error during upload'));
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
    onVideoProgress?: (progress: number) => void,
    onThumbnailProgress?: (progress: number) => void
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

  // ==================== UTILITY METHODS ====================
  
  // Reorder lectures within a chapter
  async reorderLectures(chapterId: number, lectureOrders: { id: number; order_index: number }[]): Promise<any> {
    try {
      console.log(`Reordering lectures for chapter ${chapterId}:`, lectureOrders);
      
      // Update each lecture's order individually
      const updatePromises = lectureOrders.map(({ id, order_index }) => 
        this.updateLecture(id, { order_index })
      );
      
      const results = await Promise.all(updatePromises);
      console.log('Reorder lectures results:', results);
      
      return results;
    } catch (error: any) {
      console.error('Reorder lectures error:', error);
      throw error;
    }
  }

  // Toggle lecture publish status
  async togglePublishStatus(lectureId: number, isPublished: boolean): Promise<Lecture> {
    try {
      console.log(`Toggling lecture ${lectureId} publish status to:`, isPublished);
      
      return await this.updateLecture(lectureId, { is_published: isPublished });
    } catch (error: any) {
      console.error('Toggle publish status error:', error);
      throw error;
    }
  }

  // Get lecture statistics for chapter
  async getChapterLectureStats(chapterId: number): Promise<{ lecture_count: number; total_duration: number; published_count: number }> {
    try {
      const lectures = await this.getLecturesByChapter(chapterId);
      
      const lecture_count = lectures.length;
      const total_duration = lectures.reduce((total: number, lecture: any) => 
        total + (lecture.duration_minutes || 0), 0
      );
      const published_count = lectures.filter((lecture: any) => lecture.is_published).length;

      return { lecture_count, total_duration, published_count };
    } catch (error: any) {
      console.error('Get chapter lecture stats error:', error);
      return { lecture_count: 0, total_duration: 0, published_count: 0 };
    }
  }

  // Search lectures across chapters
  async searchLectures(searchTerm: string, chapterId?: number): Promise<Lecture[]> {
    try {
      const params: LectureQueryParams = {
        search: searchTerm,
        limit: 50
      };
      
      if (chapterId) {
        params.chapter_id = chapterId;
      }
      
      const response = await this.getLectures(params);
      
      if (response && response.data) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {
      console.error('Search lectures error:', error);
      throw error;
    }
  }
}

export const simpleLectureService = new SimpleLectureService(); 