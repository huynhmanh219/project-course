import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleUserService {
  private async getHeaders(): Promise<any> {
    const token = await authService.getValidToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }


  // Get teachers list
  async getTeachers(params?: any): Promise<any> {
    try {
      
      let url = `${API_BASE_URL}/users/teachers`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get teachers');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Get single teacher
  async getTeacher(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/teachers/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get teacher');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Create teacher
  async createTeacher(data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/teachers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          // result.errors.forEach((error: any, index: number) => {
          // });
        }
        
        throw new Error(result.message || 'Failed to create teacher');
      }
    } catch (error: any) {    
      throw error;
    }
  }

  // Update teacher
  async updateTeacher(id: number, data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/teachers/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          // result.errors.forEach((error: any, index: number) => {
          // });
        }
        throw new Error(result.message || 'Failed to update teacher');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Delete teacher
  async deleteTeacher(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/teachers/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to delete teacher');
      }
    } catch (error: any) {      
      throw error;
    }
  }

    
  
  // Get students list
  async getStudents(params?: any): Promise<any> {
    try {
      
      let url = `${API_BASE_URL}/users/students`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get students');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Get single student
  async getStudent(id: number): Promise<any> {
    try {   
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/students/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get student');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Create student
  async createStudent(data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data || result;
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          // result.errors.forEach((error: any, index: number) => {
          // });
        }
        throw new Error(result.message || 'Failed to create student');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Update student
  async updateStudent(id: number, data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/students/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data || result;
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          // result.errors.forEach((error: any, index: number) => {
          // });
        }
        throw new Error(result.message || 'Failed to update student');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  // Delete student
  async deleteStudent(id: number): Promise<any> {
    try {

      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/students/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to delete student');
      }
    } catch (error: any) {      
      throw error;
    }
  }

  async getRoles(): Promise<any> {
    try {
          
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/users/roles`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get roles');
      }
      } catch (error: any) {      
      throw error;
    }
  }
}

export const simpleUserService = new SimpleUserService();
export default simpleUserService;