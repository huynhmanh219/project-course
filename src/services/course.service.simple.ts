// Simple Course Service - Fixed token expiration and data format
import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleCourseService {
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

  // ==================== SUBJECTS/COURSES ====================
  
  // Get courses/subjects list
  async getCourses(params?: any): Promise<any> {
    try {
      console.log('Getting courses list...');
      
      let url = `${API_BASE_URL}/courses`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Courses response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { courses: [...], pagination: {...} } }
        // Frontend expects: { data: [...] }
        return {
          data: result.data.courses || [], // Extract courses array
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get courses');
      }
    } catch (error: any) {
      console.error('Get courses error:', error);
      
      // Handle token expiration specifically
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  // Get single course
  async getCourse(id: number): Promise<any> {
    try {
      console.log(`Getting course ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Course response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { course: {...} } }
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get course');
      }
    } catch (error: any) {
      console.error('Get course error:', error);
      throw error;
    }
  }

  // Create course
  async createCourse(data: any): Promise<any> {
    try {
      console.log('Creating course:', data);
      
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create course response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        // Handle validation errors specifically
        if (result.message === 'Validation failed' && result.errors) {
          const error = new Error(result.message);
          (error as any).validationErrors = result.errors;
          throw error;
        } else {
          throw new Error(result.message || 'Failed to create course');
        }
      }
    } catch (error: any) {
      console.error('Create course error:', error);
      throw error;
    }
  }

  // Update course
  async updateCourse(id: number, data: any): Promise<any> {
    try {
      console.log(`Updating course ${id}:`, data);
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update course response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        // Handle validation errors specifically
        if (result.message === 'Validation failed' && result.errors) {
          const error = new Error(result.message);
          (error as any).validationErrors = result.errors;
          throw error;
        } else {
          throw new Error(result.message || 'Failed to update course');
        }
      }
    } catch (error: any) {
      console.error('Update course error:', error);
      throw error;
    }
  }

  // Delete course
  async deleteCourse(id: number): Promise<any> {
    try {
      console.log(`Deleting course ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Delete course response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', message: 'Course deleted successfully' }
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete course');
      }
    } catch (error: any) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

  // ==================== LECTURERS ====================
  
  // Get lecturers list (using teachers API)
  async getLecturers(params?: any): Promise<any> {
    try {
      console.log('Getting lecturers list...');
      
      let url = `${API_BASE_URL}/users/teachers`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Lecturers response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns { data: { teachers: [...], pagination: {...} } }
        // Frontend expects array of lecturers/teachers
        return result.data.teachers || [];
      } else {
        throw new Error(result.message || 'Failed to get lecturers');
      }
    } catch (error: any) {
      console.error('Get lecturers error:', error);
      throw error;
    }
  }

  // ==================== CLASSES ====================
  
  // Get classes by subject/course ID
  async getClassesBySubject(subjectId: number): Promise<any> {
    try {
      console.log(`Getting classes for subject ${subjectId}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes?subject_id=${subjectId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Classes by subject response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { classes: [...], pagination: {...} } }
        return result.data.classes || [];
      } else {
        throw new Error(result.message || 'Failed to get classes');
      }
    } catch (error: any) {
      console.error('Get classes by subject error:', error);
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

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get classes');
      }
    } catch (error: any) {
      console.error('Get classes error:', error);
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

      if (response.ok) {
        return result.data || result;
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

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to create class');
      }
    } catch (error: any) {
      console.error('Create class error:', error);
      throw error;
    }
  }

  // ==================== ENROLLMENT ====================
  
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

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get class students');
      }
    } catch (error: any) {
      console.error('Get class students error:', error);
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

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get student classes');
      }
    } catch (error: any) {
      console.error('Get student classes error:', error);
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
        body: JSON.stringify({ studentIds })
      });

      const result = await response.json();
      console.log('Enroll students response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to enroll students');
      }
    } catch (error: any) {
      console.error('Enroll students error:', error);
      throw error;
    }
  }
}

// Export singleton
export const simpleCourseService = new SimpleCourseService();
export default simpleCourseService; 