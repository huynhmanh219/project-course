// Simple User Service - No complex types, use 'any' for simplicity
import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleUserService {
  // Helper to get auth headers
  private getHeaders(): any {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`
    };
  }

  // ==================== TEACHERS ====================
  
  // Get teachers list
  async getTeachers(params?: any): Promise<any> {
    try {
      console.log('Getting teachers list...');
      
      let url = `${API_BASE_URL}/users/teachers`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Teachers response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get teachers');
      }
    } catch (error: any) {
      console.error('Get teachers error:', error);
      throw error;
    }
  }

  // Get single teacher
  async getTeacher(id: number): Promise<any> {
    try {
      console.log(`Getting teacher ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/users/teachers/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Teacher response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get teacher');
      }
    } catch (error: any) {
      console.error('Get teacher error:', error);
      throw error;
    }
  }

  // Create teacher
  async createTeacher(data: any): Promise<any> {
    try {
      console.log('Creating teacher:', data);
      
      const response = await fetch(`${API_BASE_URL}/users/teachers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create teacher response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to create teacher');
      }
    } catch (error: any) {
      console.error('Create teacher error:', error);
      throw error;
    }
  }

  // ==================== STUDENTS ====================
  
  // Get students list
  async getStudents(params?: any): Promise<any> {
    try {
      console.log('Getting students list...');
      
      let url = `${API_BASE_URL}/users/students`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Students response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get students');
      }
    } catch (error: any) {
      console.error('Get students error:', error);
      throw error;
    }
  }

  // Get single student
  async getStudent(id: number): Promise<any> {
    try {
      console.log(`Getting student ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/users/students/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Student response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get student');
      }
    } catch (error: any) {
      console.error('Get student error:', error);
      throw error;
    }
  }

  // Create student
  async createStudent(data: any): Promise<any> {
    try {
      console.log('Creating student:', data);
      
      const response = await fetch(`${API_BASE_URL}/users/students`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create student response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        // Enhanced error logging for validation issues
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        throw new Error(result.message || 'Failed to create student');
      }
    } catch (error: any) {
      console.error('Create student error:', error);
      throw error;
    }
  }

  // Update student
  async updateStudent(id: number, data: any): Promise<any> {
    try {
      console.log(`Updating student ${id}:`, data);
      
      const response = await fetch(`${API_BASE_URL}/users/students/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update student response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        // Enhanced error logging for validation issues
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          result.errors.forEach((error: any, index: number) => {
            console.error(`Validation Error ${index + 1}:`, error);
          });
        }
        throw new Error(result.message || 'Failed to update student');
      }
    } catch (error: any) {
      console.error('Update student error:', error);
      throw error;
    }
  }

  // Delete student
  async deleteStudent(id: number): Promise<any> {
    try {
      console.log(`Deleting student ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/users/students/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Delete student response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to delete student');
      }
    } catch (error: any) {
      console.error('Delete student error:', error);
      throw error;
    }
  }

  // ==================== ROLES ====================
  
  // Get roles list
  async getRoles(): Promise<any> {
    try {
      console.log('Getting roles list...');
      
      const response = await fetch(`${API_BASE_URL}/users/roles`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Roles response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get roles');
      }
    } catch (error: any) {
      console.error('Get roles error:', error);
      throw error;
    }
  }
}

// Export singleton
export const simpleUserService = new SimpleUserService();
export default simpleUserService; 