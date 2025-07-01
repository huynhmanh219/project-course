import { API_BASE_URL } from './api';
import authService from './auth.service';

class SimpleClassService {
  // Get headers with authorization
  private async getHeaders(): Promise<any> {
    const token = await authService.getValidToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
  
  // Get current student's enrolled classes
  async getMyStudentClasses(params?: any): Promise<any> {
    try {
      console.log('📚 Getting my classes as student...');
      
      // Get current user
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
      console.log('📋 My student classes response:', result);

      if (response.ok && result.status === 'success') {
        // Backend returns: { status: 'success', data: { enrollments: [...], pagination: {...} } }
        return {
          data: result.data.enrollments || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get my classes');
      }
    } catch (error: any) {
      console.error('❌ Get my student classes error:', error);
      
      // Handle token expiration specifically
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  // Get class details for student
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
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get class');
      }
    } catch (error: any) {
      console.error('Get class error:', error);
      throw error;
    }
  }

  // Get lectures in a class (for students)
  async getClassLectures(classId: number, params?: any): Promise<any> {
    try {
      console.log(`Getting lectures for class ${classId}...`);
      
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
      console.log('Class lectures response:', result);

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
      console.error('Get class lectures error:', error);
      throw error;
    }
  }

  // Get materials in a class (for students)
  async getClassMaterials(classId: number, params?: any): Promise<any> {
    try {
      console.log(`Getting materials for class ${classId}...`);
      
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
      console.log('Class materials response:', result);

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
      console.error('Get class materials error:', error);
      throw error;
    }
  }

  // ==================== LECTURER FUNCTIONS ====================
  
  // Get classes list (for lecturers)
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
        return {
          data: result.data.classes || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get classes');
      }
    } catch (error: any) {
      console.error('Get classes error:', error);
      throw error;
    }
  }

  // Create class (for lecturers)
  async createClass(data: any): Promise<any> {
    try {
      console.log('🚀 Creating class with data:', data);
      
      const response = await fetch(`${API_BASE_URL}/courses/classes`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('📋 Create class response:', result);

      if (response.ok && result.status === 'success') {
        return result.data;
        } else {
          throw new Error(result.message || 'Failed to create class');
      }
    } catch (error: any) {
      console.error('💥 Create class error:', error);
      throw error;
    }
  }

  // Update class (for lecturers)
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
          throw new Error(result.message || 'Failed to update class');
      }
    } catch (error: any) {
      console.error('Update class error:', error);
      throw error;
    }
  }

  // Delete class (for lecturers)
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
        return result;
      } else {
        throw new Error(result.message || 'Failed to delete class');
      }
    } catch (error: any) {
      console.error('Delete class error:', error);
      throw error;
    }
  }

  // Get students in a class (for lecturers)
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

  // Enroll students to class (for lecturers)
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

  // Remove student from class (for lecturers)
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

  // Get my classes (for lecturers)
  async getMyClasses(params?: any): Promise<any> {
    try {
      console.log('Getting my classes as lecturer...');
      
      // Get current user
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
      console.log('My lecturer classes response:', result);

      if (response.ok && result.status === 'success') {
        return {
          data: result.data.classes || [],
          pagination: result.data.pagination
        };
      } else {
        throw new Error(result.message || 'Failed to get my classes');
      }
    } catch (error: any) {
      console.error('Get my lecturer classes error:', error);
      
      // Handle token expiration specifically
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      throw error;
    }
  }

  // Get current lecturer profile
  async getCurrentLecturerProfile(): Promise<any> {
    try {
      console.log('🔍 Getting current lecturer profile...');
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      const result = await response.json();
      console.log('👤 Current user profile response:', result);

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
      console.error('❌ Error getting lecturer profile:', error);
      throw error;
    }
  }
}

// Export singleton
export const simpleClassService = new SimpleClassService();
export default simpleClassService; 