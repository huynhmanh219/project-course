import { API_BASE_URL } from './api';
import authService from './auth.service';

class SimpleClassService {
  private async getHeaders(): Promise<any> {
    const token = await authService.getValidToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
  
  async getMyStudentClasses(params?: any): Promise<any> {
    try {
      
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('No user found');
      }
      
      if (user.role !== 'student') {
        throw new Error('Only students can access their own classes');
      }
      
      let url = `${API_BASE_URL}/students/me/classes`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.enrollments || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get my classes');
      }
    } catch (error: any) {
      
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  async getClass(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${id}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get class');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getClassLectures(classId: number, params?: any): Promise<any> {
    try {
      
      let url = `${API_BASE_URL}/courses/classes/${classId}/lectures`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.lectures || [],
          pagination: result.data.pagination,
          class: result.data.class
        };
      } else {
        throw new Error(result.message || 'Failed to get class lectures');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getClassMaterials(classId: number, params?: any): Promise<any> {
    try {
      
      let url = `${API_BASE_URL}/courses/classes/${classId}/materials`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.materials || [],
          pagination: result.data.pagination,
          class: result.data.class
        };
      } else {
        throw new Error(result.message || 'Failed to get class materials');
      }
    } catch (error: any) {  
      throw error;
    }
  }

  async getClasses(params?: any): Promise<any> {
    try {
      
      let url = `${API_BASE_URL}/courses/classes`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.classes || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get classes');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async createClass(data: any): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/classes`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return result.data;
        } else {
          throw new Error(result.message || 'Failed to create class');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async updateClass(id: number, data: any): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${id}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return result.data;
        } else {
          throw new Error(result.message || 'Failed to update class');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async deleteClass(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${id}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const result = await response.json();   

      if (response.ok && result.status === 'success') {
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete class');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getClassStudents(classId: number, params?: any): Promise<any> {
    try {
      
      let url = `${API_BASE_URL}/courses/classes/${classId}/students`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.students || [],
          pagination: result.data.pagination,
          class: result.data.class
        };
      } else {
        throw new Error(result.message || 'Failed to get class students');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async enrollStudents(classId: number, studentIds: number[]): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${classId}/students`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ student_ids: studentIds })
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to enroll students');
      }
    } catch (error: any) {
      throw error;
    }
  }
    
  async removeStudentFromClass(classId: number, studentId: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return result;
      } else {
        throw new Error(result.message || 'Failed to remove student from class');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getMyClasses(params?: any): Promise<any> {
    try {   
      
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('No user found');
      }
      
      if (user.role !== 'lecturer') {
        throw new Error('Only lecturers can access their own classes');
      }
      
      let url = `${API_BASE_URL}/lecturers/me/classes`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.classes || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get my classes');
      }
    } catch (error: any) {
      
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  async getCurrentLecturerProfile(): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        const userData = result.data.user;
        
        if (userData.role === 'lecturer' && userData.profile) {
        return {
            account_id: userData.id,
            lecturer_id: userData.profile.id,
            profile: userData.profile
        };
      } else {
          throw new Error('User is not a lecturer or profile not found');
        }
      } else {
        throw new Error(result.message || 'Failed to get user profile');
      }
    } catch (error: any) {
      throw error;
    }
  }
}

export const simpleClassService = new SimpleClassService();
export default simpleClassService; 