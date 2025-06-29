// Simple Quiz Service - No complex types, use 'any' for simplicity
import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleQuizService {
  // Helper to get auth headers
  private getHeaders(): any {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`
    };
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
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quizzes response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quizzes');
      }
    } catch (error: any) {
      console.error('Get quizzes error:', error);
      throw error;
    }
  }

  // Get single quiz
  async getQuiz(id: number): Promise<any> {
    try {
      console.log(`Getting quiz ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quiz response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quiz');
      }
    } catch (error: any) {
      console.error('Get quiz error:', error);
      throw error;
    }
  }

  // Create quiz (teachers only)
  async createQuiz(data: any): Promise<any> {
    try {
      console.log('Creating quiz:', data);
      
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create quiz response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to create quiz');
      }
    } catch (error: any) {
      console.error('Create quiz error:', error);
      throw error;
    }
  }

  // Get quiz questions
  async getQuizQuestions(id: number): Promise<any> {
    try {
      console.log(`Getting questions for quiz ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/questions`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quiz questions response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quiz questions');
      }
    } catch (error: any) {
      console.error('Get quiz questions error:', error);
      throw error;
    }
  }

  // Start quiz (students only)
  async startQuiz(id: number): Promise<any> {
    try {
      console.log(`Starting quiz ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/start`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Start quiz response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to start quiz');
      }
    } catch (error: any) {
      console.error('Start quiz error:', error);
      throw error;
    }
  }

  // Publish quiz (teachers only)
  async publishQuiz(id: number): Promise<any> {
    try {
      console.log(`Publishing quiz ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/publish`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Publish quiz response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to publish quiz');
      }
    } catch (error: any) {
      console.error('Publish quiz error:', error);
      throw error;
    }
  }

  // Get quiz results (teachers only)
  async getQuizResults(id: number): Promise<any> {
    try {
      console.log(`Getting results for quiz ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/results`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quiz results response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quiz results');
      }
    } catch (error: any) {
      console.error('Get quiz results error:', error);
      throw error;
    }
  }

  // Get quiz statistics (teachers only)
  async getQuizStatistics(id: number): Promise<any> {
    try {
      console.log(`Getting statistics for quiz ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/statistics`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quiz statistics response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quiz statistics');
      }
    } catch (error: any) {
      console.error('Get quiz statistics error:', error);
      throw error;
    }
  }

  // ==================== QUIZ ATTEMPTS ====================
  
  // Create quiz attempt (students only)
  async createQuizAttempt(data: any): Promise<any> {
    try {
      console.log('Creating quiz attempt:', data);
      
      const response = await fetch(`${API_BASE_URL}/quiz-attempts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Create quiz attempt response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to create quiz attempt');
      }
    } catch (error: any) {
      console.error('Create quiz attempt error:', error);
      throw error;
    }
  }

  // Get quiz attempt details
  async getQuizAttempt(id: number): Promise<any> {
    try {
      console.log(`Getting quiz attempt ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quiz attempt response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quiz attempt');
      }
    } catch (error: any) {
      console.error('Get quiz attempt error:', error);
      throw error;
    }
  }

  // Submit answer (students only)
  async submitAnswer(attemptId: number, data: any): Promise<any> {
    try {
      console.log(`Submitting answer for attempt ${attemptId}:`, data);
      
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/answer`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Submit answer response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to submit answer');
      }
    } catch (error: any) {
      console.error('Submit answer error:', error);
      throw error;
    }
  }

  // Get attempt result
  async getAttemptResult(id: number): Promise<any> {
    try {
      console.log(`Getting result for attempt ${id}...`);
      
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}/result`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Attempt result response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get attempt result');
      }
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
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('My attempts response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get my attempts');
      }
    } catch (error: any) {
      console.error('Get my attempts error:', error);
      throw error;
    }
  }

  // Get quiz progress
  async getQuizProgress(attemptId: number): Promise<any> {
    try {
      console.log(`Getting progress for attempt ${attemptId}...`);
      
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/progress`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();
      console.log('Quiz progress response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        throw new Error(result.message || 'Failed to get quiz progress');
      }
    } catch (error: any) {
      console.error('Get quiz progress error:', error);
      throw error;
    }
  }
}

// Export singleton
export const simpleQuizService = new SimpleQuizService();
export default simpleQuizService; 