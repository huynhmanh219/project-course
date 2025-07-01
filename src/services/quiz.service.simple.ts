// Simple Quiz Service - No complex types, use 'any' for simplicity
import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleQuizService {
  // Helper to get auth headers with token refresh
  private async getHeaders(): Promise<any> {
    try {
      const token = await authService.getValidToken();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    } catch (error) {
      console.error('Failed to get valid token:', error);
      throw error;
    }
  }

  // Helper to handle API response
  private handleResponse(response: Response, result: any): any {
    if (response.ok) {
      // For paginated endpoints, return the nested data structure
      if (result.success && result.data) {
        return result.data;
      }
      return result.data || result;
    } else {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        return;
      }
      throw new Error(result.message || `API request failed with status ${response.status}`);
    }
  }

  // ==================== QUIZ MANAGEMENT ====================
  
  // Get quizzes list
  async getQuizzes(params?: any): Promise<any> {
    try {
      console.log('Getting quizzes list...');
      
      let url = `${API_BASE_URL}/quizzes`;
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
      console.log('Quizzes response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quizzes error:', error);
      throw error;
    }
  }

  // Get single quiz
  async getQuiz(id: number): Promise<any> {
    try {
      console.log(`Getting quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quiz error:', error);
      throw error;
    }
  }

  // Create quiz (teachers only)
  async createQuiz(data: any): Promise<any> {
    try {
      console.log('Creating quiz:', data);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Create quiz error:', error);
      throw error;
    }
  }

  // Update quiz (teachers only)
  async updateQuiz(id: number, data: any): Promise<any> {
    try {
      console.log(`Updating quiz ${id}:`, data);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Update quiz error:', error);
      throw error;
    }
  }

  // Delete quiz (teachers only)
  async deleteQuiz(id: number): Promise<any> {
    try {
      console.log(`Deleting quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();
      console.log('Delete quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Delete quiz error:', error);
      throw error;
    }
  }

  // Get quiz questions
  async getQuizQuestions(id: number, includeAnswers: boolean = false): Promise<any> {
    try {
      console.log(`Getting questions for quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const url = `${API_BASE_URL}/quizzes/${id}/questions${includeAnswers ? '?include_answers=true' : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Quiz questions response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quiz questions error:', error);
      throw error;
    }
  }

  // Start quiz (students only)
  async startQuiz(id: number): Promise<any> {
    try {
      console.log(`Starting quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/start`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Start quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Start quiz error:', error);
      throw error;
    }
  }

  // Publish quiz (teachers only)
  async publishQuiz(id: number): Promise<any> {
    try {
      console.log(`Publishing quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/publish`, {
        method: 'POST',
        headers
      });

      const result = await response.json();
      console.log('Publish quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Publish quiz error:', error);
      throw error;
    }
  }

  // Close quiz (teachers only)
  async closeQuiz(id: number): Promise<any> {
    try {
      console.log(`Closing quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/close`, {
        method: 'POST',
        headers
      });

      const result = await response.json();
      console.log('Close quiz response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Close quiz error:', error);
      throw error;
    }
  }

  // Get quiz results (teachers only)
  async getQuizResults(id: number): Promise<any> {
    try {
      console.log(`Getting results for quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/results`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Quiz results response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quiz results error:', error);
      throw error;
    }
  }

  // Get quiz statistics (teachers only)
  async getQuizStatistics(id: number): Promise<any> {
    try {
      console.log(`Getting statistics for quiz ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/statistics`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Quiz statistics response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quiz statistics error:', error);
      throw error;
    }
  }

  // ==================== QUESTION MANAGEMENT ====================

  // Create question (teachers only)
  async createQuestion(data: any): Promise<any> {
    try {
      console.log('Creating question:', data);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create question response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Create question error:', error);
      throw error;
    }
  }

  // Get question details
  async getQuestion(id: number): Promise<any> {
    try {
      console.log(`Getting question ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Question response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get question error:', error);
      throw error;
    }
  }

  // Update question (teachers only)
  async updateQuestion(id: number, data: any): Promise<any> {
    try {
      console.log(`Updating question ${id}:`, data);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Update question response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Update question error:', error);
      throw error;
    }
  }

  // Delete question (teachers only)
  async deleteQuestion(id: number): Promise<any> {
    try {
      console.log(`Deleting question ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();
      console.log('Delete question response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Delete question error:', error);
      throw error;
    }
  }

  // ==================== QUIZ ATTEMPTS ====================
  
  // Create quiz attempt (students only)
  async createQuizAttempt(data: any): Promise<any> {
    try {
      console.log('Creating quiz attempt:', data);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create quiz attempt response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Create quiz attempt error:', error);
      throw error;
    }
  }

  // Get quiz attempt details
  async getQuizAttempt(id: number): Promise<any> {
    try {
      console.log(`Getting quiz attempt ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Quiz attempt response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quiz attempt error:', error);
      throw error;
    }
  }

  // Submit answer (students only)
  async submitAnswer(attemptId: number, data: any): Promise<any> {
    try {
      console.log(`Submitting answer for attempt ${attemptId}:`, data);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/answer`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Submit answer response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Submit answer error:', error);
      throw error;
    }
  }

  // Submit entire quiz attempt (students only)
  async submitQuizAttempt(attemptId: number): Promise<any> {
    try {
      console.log(`Submitting quiz attempt ${attemptId}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/submit`, {
        method: 'POST',
        headers
      });

      const result = await response.json();
      console.log('Submit quiz attempt response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Submit quiz attempt error:', error);
      throw error;
    }
  }

  // Get attempt result
  async getAttemptResult(id: number): Promise<any> {
    try {
      console.log(`Getting result for attempt ${id}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}/result`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Attempt result response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get attempt result error:', error);
      throw error;
    }
  }

  // Get my attempts (students only)
  async getMyAttempts(params?: any): Promise<any> {
    try {
      console.log('Getting my quiz attempts...');
      
      let url = `${API_BASE_URL}/quiz-attempts/my-attempts`;
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
      console.log('My attempts response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get my attempts error:', error);
      throw error;
    }
  }

  // Get quiz progress
  async getQuizProgress(attemptId: number): Promise<any> {
    try {
      console.log(`Getting progress for attempt ${attemptId}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/progress`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      console.log('Quiz progress response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Get quiz progress error:', error);
      throw error;
    }
  }

  // Flag question for review (students only)
  async flagQuestion(attemptId: number, questionId: number): Promise<any> {
    try {
      console.log(`Flagging question ${questionId} for attempt ${attemptId}...`);
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/flag`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ question_id: questionId })
      });

      const result = await response.json();
      console.log('Flag question response:', result);

      return this.handleResponse(response, result);
    } catch (error: any) {
      console.error('Flag question error:', error);
      throw error;
    }
  }
}

// Export singleton
export const simpleQuizService = new SimpleQuizService();
export default simpleQuizService; 