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

  
  async getLectures(params?: LectureQueryParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('size', params.limit.toString()); 
      if (params?.search) queryParams.append('search', params.search);
      if (params?.chapter_id) queryParams.append('chapter_id', params.chapter_id.toString());
      if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/lectures${queryString ? `?${queryString}` : ''}`;
      
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        throw new Error(result.message || 'Failed to fetch lectures');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getLecturesByChapter(chapterId: number): Promise<Lecture[]> {
    try {
      
      const response = await this.getLectures({ chapter_id: chapterId, limit: 100 });
      
      if (response && response.data) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {
      throw error;
    }
  }

  async getLecture(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

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
      throw error;
    }
  }

  
  async createLecture(data: CreateLectureData): Promise<Lecture> {
    try {

      const response = await fetch(`${API_BASE_URL}/lectures`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return null as any;
        }
        
        if (result.errors && Array.isArray(result.errors)) {
          // result.errors.forEach((error: any, index: number) => {
          // });
        }
        
        throw new Error(result.message || 'Failed to create lecture');
      }
    } catch (error: any) {
      throw error;
    }
  }

  
  async updateLecture(id: number, data: UpdateLectureData): Promise<Lecture> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return null as any;
        }
        
        if (result.errors && Array.isArray(result.errors)) {
          // result.errors.forEach((error: any, index: number) => {
          // });
        }
        
        throw new Error(result.message || 'Failed to update lecture');
      }
    } catch (error: any) {
      throw error;
    }
  }

  
  async deleteLecture(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      const result = await response.json();

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
      throw error;
    }
  }

  
  async getLectureAttachments(lectureId: number): Promise<any> {
    try {   
      
      const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/attachments`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

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
      throw error;
    }
  }

  
  async uploadVideo(lectureId: number, videoFile: File, onProgress?: (progress: number) => void): Promise<any> {
    try {
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Authorization': token ? `Bearer ${token}` : ''
      };
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
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
          reject(new Error('Network error during upload'));
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

  async uploadThumbnail(lectureId: number, imageFile: File, onProgress?: (progress: number) => void): Promise<any> {
    try {
      
      const formData = new FormData();
      formData.append('thumbnail', imageFile);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Authorization': token ? `Bearer ${token}` : ''
      };
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
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
          reject(new Error('Network error during upload'));
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
    onVideoProgress?: (progress: number) => void,
    onThumbnailProgress?: (progress: number) => void
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

  
  async reorderLectures( lectureOrders: { id: number; order_index: number }[]): Promise<any> {
    try {
      
      const updatePromises = lectureOrders.map(({ id, order_index }) => 
        this.updateLecture(id, { order_index })
      );
      
      const results = await Promise.all(updatePromises);
      
      return results;
    } catch (error: any) {
      throw error;
    }
  }

  async togglePublishStatus(lectureId: number, isPublished: boolean): Promise<Lecture> {
    try {
      
      return await this.updateLecture(lectureId, { is_published: isPublished });
    } catch (error: any) {
      throw error;
    }
  }

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
      return { lecture_count: 0, total_duration: 0, published_count: 0 };
    }
  }

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
      throw error;
    }
  }
}

export const simpleLectureService = new SimpleLectureService(); 