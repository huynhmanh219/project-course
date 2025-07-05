import { API_BASE_URL } from './api';
import { authService } from './auth.service';

interface Chapter {
  id: number;
  subject_id: number;
  title: string;
  description?: string;
  order_index: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  subject?: {
    id: number;
    name: string;
    code: string;
  };
  lecture_count?: number;
  total_duration?: number;
}

interface CreateChapterData {
  subject_id: number;
  title: string;
  description?: string;
  order_index?: number;
  status?: 'active' | 'inactive';
}

interface UpdateChapterData {
  subject_id?: number;
  title?: string;
  description?: string;
  order_index?: number;
  status?: 'active' | 'inactive';
}

interface ChapterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject_id?: number;
  status?: 'active' | 'inactive';
  sort?: 'created_at' | 'title' | 'order_index';
  order?: 'asc' | 'desc';
}

class SimpleChapterService {
  private getHeaders(): Record<string, string> {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async getChapters(params?: ChapterQueryParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) {
        queryParams.append('page', String(Number(params.page)));
      }
      if (params?.limit) {
        queryParams.append('limit', String(Number(params.limit)));
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.subject_id) {
        queryParams.append('subject_id', String(Number(params.subject_id)));
      }
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      if (params?.sort) {
        queryParams.append('sort', params.sort);
      }
      if (params?.order) {
        queryParams.append('order', params.order);
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/lectures/chapters${queryString ? `?${queryString}` : ''}`;
      
      console.log(`Getting chapters from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Get chapters response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        
        throw new Error(result.message || 'Failed to fetch chapters');
      }
    } catch (error: any) {
      console.error('Get chapters error:', error);
      throw error;
    }
  }

  async getChaptersBySubject(subjectId: number): Promise<Chapter[]> {
    try {
      console.log(`Getting chapters for subject ${subjectId}...`);
      
      const response = await this.getChapters({ 
        subject_id: subjectId, 
        limit: 100,
        sort: 'order_index',
        order: 'asc'
      });
      
      if (response && response.data) {
        return response.data;
      } else if (response && response.items) {
        return response.items;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {
      console.error('Get chapters by subject error:', error);
      throw error;
    }
  }

  async getChapter(id: number): Promise<any> {
    try {
      console.log(`Getting chapter ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/lectures/chapters/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Get chapter response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        throw new Error(result.message || 'Failed to fetch chapter');
      }
    } catch (error: any) {
      console.error('Get chapter error:', error);
      throw error;
    }
  }

  async createChapter(data: CreateChapterData): Promise<Chapter> {
    try {
      console.log('Creating chapter:', data);
      
      const response = await fetch(`${API_BASE_URL}/lectures/chapters`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result: any = await response.json();
      console.log('Create chapter response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        
        throw new Error(result.message || 'Failed to create chapter');
      }
    } catch (error: any) {
      console.error('Create chapter error:', error);
      throw error;
    }
  }

  async updateChapter(id: number, data: UpdateChapterData): Promise<Chapter> {
    try {
      console.log(`Updating chapter ${id}:`, data);
      
      const response = await fetch(`${API_BASE_URL}/lectures/chapters/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update chapter response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        
        throw new Error(result.message || 'Failed to update chapter');
      }
    } catch (error: any) {
      console.error('Update chapter error:', error);
      throw error;
    }
  }

  async deleteChapter(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/lectures/chapters/${id}`, {
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
          throw new Error('Authentication required');
        }
        throw new Error(result.message || 'Failed to delete chapter');
      }
    } catch (error: any) {
      console.error('Delete chapter error:', error);
      throw error;
    }
  }

  async getChapterLectures(chapterId: number): Promise<any> {
    try {
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', '1');
      queryParams.append('size', '50'); 
      
      const url = `${API_BASE_URL}/lectures/chapters/${chapterId}/lectures?${queryParams.toString()}`;
      
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
          throw new Error('Authentication required');
        }
        throw new Error(result.message || 'Failed to fetch chapter lectures');
      }
    } catch (error: any) {
      console.error('Get chapter lectures error:', error);
      throw error;
    }
  }

  async reorderChapters( chapterOrders: { id: number; order_index: number }[]): Promise<any> {
    try {
        
      const updatePromises = chapterOrders.map(({ id, order_index }) => 
        this.updateChapter(id, { order_index })
      );
      
      const results = await Promise.all(updatePromises);
      
      return results;
    } catch (error: any) {
      console.error('Reorder chapters error:', error);
      throw error;
    }
  }


  async getChapterStats(chapterId: number): Promise<{ lecture_count: number; total_duration: number }> {
    try {
      const lectures = await this.getChapterLectures(chapterId);
      
      let lectureList: any[] = [];
      
      if (lectures && lectures.data) {
        lectureList = lectures.data;
      } else if (lectures && lectures.items) {
        lectureList = lectures.items;
      }
      
      if (lectureList.length > 0) {
        const lecture_count = lectureList.length;
        const total_duration = lectureList.reduce((total: number, lecture: any) => 
          total + (lecture.duration_minutes || 0), 0
        );
        
        return { lecture_count, total_duration };
      }
      
      return { lecture_count: 0, total_duration: 0 };
    } catch (error: any) {
      return { lecture_count: 0, total_duration: 0 };
    }
  }


  async searchChapters(searchTerm: string, subjectId?: number): Promise<Chapter[]> {
    try {
      const params: ChapterQueryParams = {
        search: searchTerm,
        limit: 50
      };
      
      if (subjectId) {
        params.subject_id = subjectId;
      }
      
      const response = await this.getChapters(params);
      
      if (response && response.data) {
        return response.data;
      } else if (response && response.items) {
        return response.items;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error: any) {  
      throw error;
    }
  }
}

export const simpleChapterService = new SimpleChapterService();
