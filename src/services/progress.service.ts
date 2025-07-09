
import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class ProgressService {
  private async getHeaders() {
    const token = await authService.getValidToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async startLecture(lectureId: number) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/progress/lectures/${lectureId}/start`, {
        method: 'POST',
        headers
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error starting lecture:', error);
      throw error;
    }
  }

  async updateLecture(lectureId: number, payload: { time_delta: number; scrolled_to_bottom?: boolean }) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/progress/lectures/${lectureId}/progress`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating lecture progress:', error);
      throw error;
    }
  }

  async getSectionProgress(sectionId: number) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/progress/course-sections/${sectionId}/progress`, {
        method: 'GET',
        headers
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting section progress:', error);
      throw error;
    }
  }

  async getLectureProgress(lectureId: number) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/progress/lectures/${lectureId}/progress`, {
        method: 'GET',
        headers
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting lecture progress:', error);
      return null;
    }
  }
}

export const progressService = new ProgressService(); 