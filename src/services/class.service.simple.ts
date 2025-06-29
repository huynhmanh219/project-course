// Simple Class Service - API integration for Classes/Course Sections
import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleClassService {
  // Helper to get auth headers with token validation
  private async getHeaders(): Promise<any> {
    let token = authService.getToken();
    
    // Check if token exists
    if (!token) {
      console.log('No token found, redirecting to login...');
      window.location.href = '/login';
      throw new Error('No authentication token');
    }
    
    // Simple token expiration check
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        console.log('Token expired, redirecting to login...');
        localStorage.clear(); // Clear all data
        window.location.href = '/login';
        throw new Error('Token expired');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.clear(); // Clear all data
      window.location.href = '/login';
      throw new Error('Invalid token');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // ==================== CLASSES/COURSE SECTIONS ====================
  
  // Get my classes (for current lecturer)
  async getMyClasses(params?: any): Promise<any> {
    try {
      console.log('Getting my classes...');
      
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('No user found');
      }
      
      console.log('Current user:', user);
      
      // Extract lecturer ID from user object
      let lecturerId = null;
      
      // Try different possible structures
      if (user.lecturerId) {
        lecturerId = user.lecturerId;
      } else if (user.lecturer && user.lecturer.id) {
        lecturerId = user.lecturer.id;
      } else if (user.profile && user.profile.id) {
        lecturerId = user.profile.id;
      } else if (user.role === 'lecturer' && user.id) {
        // If user is lecturer, their account ID might map to lecturer ID
        // We'll let the backend handle this case by using account ID as lecturer filter
        lecturerId = user.id;
      }
      
      if (!lecturerId) {
        throw new Error('Cannot determine lecturer ID for current user');
      }
      
      console.log('Using lecturer_id:', lecturerId);
      
      let url = `${API_BASE_URL}/courses/classes?lecturer_id=${lecturerId}`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `&${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('My classes response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { classes: [...], pagination: {...} } }
        return {
          data: result.data.classes || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get my classes');
      }
    } catch (error: any) {
      console.error('Get my classes error:', error);
      
      // Handle token expiration specifically
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  // Get classes list
  async getClasses(params?: any): Promise<any> {
    try {
      console.log('Getting classes list...');
      
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
      console.log('Classes response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { classes: [...], pagination: {...} } }
        return {
          data: result.data.classes || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get classes');
      }
    } catch (error: any) {
      console.error('Get classes error:', error);
      
      // Handle token expiration specifically
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  // Get single class
  async getClass(id: number): Promise<any> {
    try {
      console.log(`Getting class ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${id}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Class response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { class: {...} } }
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get class');
      }
    } catch (error: any) {
      console.error('Get class error:', error);
      throw error;
    }
  }

  // Create class
  async createClass(data: any): Promise<any> {
    try {
      console.log('Creating class:', data);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create class response:', result);

      if (response.ok && result.status === 'success') {
        return result.data;
      } else {
        // Handle validation errors specifically
        if (result.message === 'Validation failed' && result.errors) {
          const error = new Error(result.message);
          (error as any).validationErrors = result.errors;
          throw error;
        } else {
          throw new Error(result.message || 'Failed to create class');
        }
      }
    } catch (error: any) {
      console.error('Create class error:', error);
      throw error;
    }
  }

  // Update class
  async updateClass(id: number, data: any): Promise<any> {
    try {
      console.log(`Updating class ${id}:`, data);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${id}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update class response:', result);

      if (response.ok && result.status === 'success') {
        return result.data;
      } else {
        // Handle validation errors specifically
        if (result.message === 'Validation failed' && result.errors) {
          console.error('Validation errors:', result.errors);
          const error = new Error(result.message);
          (error as any).validationErrors = result.errors;
          throw error;
        } else {
          throw new Error(result.message || 'Failed to update class');
        }
      }
    } catch (error: any) {
      console.error('Update class error:', error);
      throw error;
    }
  }

  // Delete class
  async deleteClass(id: number): Promise<any> {
    try {
      console.log(`Deleting class ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${id}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Delete class response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', message: 'Class deleted successfully' }
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete class');
      }
    } catch (error: any) {
      console.error('Delete class error:', error);
      throw error;
    }
  }

  // ==================== STUDENT ENROLLMENT ====================
  
  // Get students in a class
  async getClassStudents(classId: number, params?: any): Promise<any> {
    try {
      console.log(`Getting students in class ${classId}...`);
      
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
      console.log('Class students response:', result);

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
      console.error('Get class students error:', error);
      throw error;
    }
  }

  // Enroll students to class
  async enrollStudents(classId: number, studentIds: number[]): Promise<any> {
    try {
      console.log(`Enrolling students to class ${classId}:`, studentIds);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${classId}/students`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ student_ids: studentIds })
      });

      const result = await response.json();
      console.log('Enroll students response:', result);

      if (response.ok && result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to enroll students');
      }
    } catch (error: any) {
      console.error('Enroll students error:', error);
      throw error;
    }
  }

  // Remove student from class
  async removeStudentFromClass(classId: number, studentId: number): Promise<any> {
    try {
      console.log(`Removing student ${studentId} from class ${classId}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Remove student response:', result);

      if (response.ok && result.status === 'success') {
        return result;
      } else {
        throw new Error(result.message || 'Failed to remove student from class');
      }
    } catch (error: any) {
      console.error('Remove student error:', error);
      throw error;
    }
  }

  // Get student's classes
  async getStudentClasses(studentId: number, params?: any): Promise<any> {
    try {
      console.log(`Getting classes for student ${studentId}...`);
      
      let url = `${API_BASE_URL}/courses/students/${studentId}/classes`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Student classes response:', result);

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.enrollments || [],
          pagination: result.data.pagination,
          student: result.data.student
        };
      } else {
        throw new Error(result.message || 'Failed to get student classes');
      }
    } catch (error: any) {
      console.error('Get student classes error:', error);
      throw error;
    }
  }
}

// Export singleton
export const simpleClassService = new SimpleClassService();
export default simpleClassService; 