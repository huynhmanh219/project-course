import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleCourseService {
  private async getHeaders(): Promise<any> {
    let token = authService.getToken();
    
    if (!token) {
      window.location.href = '/login';
      throw new Error('No authentication token');
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        localStorage.clear(); 
        window.location.href = '/login';
        throw new Error('Token expired');
      }
    } catch (error) {
      localStorage.clear(); 
      window.location.href = '/login';
      throw new Error('Invalid token');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }


  async getCourses(params?: any): Promise<any> {
    try {
      
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

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.courses || [], 
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get courses');
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

  async getCourse(id: number): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get course');
      }
    } catch (error: any) {
      throw error;
    }
  }

  async createCourse(data: any): Promise<any> {
    try {
      
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return result.data || result;
      } else {
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
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete course');
      }
    } catch (error: any) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

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
        return result.data.teachers || [];
      } else {
        throw new Error(result.message || 'Failed to get lecturers');
      }
    } catch (error: any) {
      console.error('Get lecturers error:', error);
      throw error;
    }
  }

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
        return result.data.classes || [];
      } else {
        throw new Error(result.message || 'Failed to get classes');
      }
    } catch (error: any) {
      console.error('Get classes by subject error:', error);
      throw error;
    }
  }
  
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


  async removeStudentFromClass(classId: number, studentId: number): Promise<any> {
    try {
      console.log(`Removing student ${studentId} from class ${classId}...`);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('Remove student response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to remove student from class');
      }
    } catch (error: any) {
      console.error('Remove student error:', error);
      throw error;
    }
  }
}


export const simpleCourseService = new SimpleCourseService();
export default simpleCourseService; 