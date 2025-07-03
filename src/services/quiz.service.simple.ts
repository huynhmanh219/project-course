import { API_BASE_URL } from './api';
import { authService } from './auth.service';

class SimpleQuizService {
  private async getHeaders(): Promise<any> {
    try {
      const token = await authService.getValidToken();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    } catch (error) {
      throw error;
    }
  }

  private handleResponse(response: Response, result: any): any {
    if (response.ok) {
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

  async getQuizzes(params?: any): Promise<any> {
    try {
      
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

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuiz(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async createQuiz(data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async updateQuiz(id: number, data: any): Promise<any> {
    try {   
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async deleteQuiz(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizQuestions(id: number, includeAnswers: boolean = true): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const url = `${API_BASE_URL}/quizzes/${id}/questions${includeAnswers ? '?include_answers=true' : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async startQuiz(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/start`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async publishQuiz(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/publish`, {
        method: 'POST',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async closeQuiz(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/close`, {
        method: 'POST',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizResults(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/results`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizStatistics(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/statistics`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async createQuestion(data: any): Promise<any> {
    try {     
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuestion(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async updateQuestion(id: number, data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async deleteQuestion(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async createQuizAttempt(data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizAttempt(id: number): Promise<any> {
    try {   

      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async submitAnswer(attemptId: number, data: any): Promise<any> {
    try {      
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/answer`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async submitQuizAttempt(attemptId: number): Promise<any> {
    try {      
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/submit`, {
        method: 'POST',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async getAttemptResult(id: number): Promise<any> {
    try {      
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${id}/result`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async getMyAttempts(params?: any): Promise<any> {
    try {      
      
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

    return this.handleResponse(response, result);
    } catch (error: any) {      
      throw error;
    }
  }

  async getQuizProgress(attemptId: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/progress`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async flagQuestion(attemptId: number, questionId: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${attemptId}/flag`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ question_id: questionId })
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizHistory(params?: any): Promise<any> {
    try {      
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

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizResult(quizId: number, submissionId: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/${submissionId}/result`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async submitQuiz(quizId: number, data: any): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quiz-attempts/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }

  async getQuizById(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      throw error;
    }
  }
  async forceDeleteQuiz(id: number): Promise<any> {
    try {
      
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}/force`, {
        method: 'DELETE',
        headers
      });
      const result = await response.json();

      return this.handleResponse(response, result);
    } catch (error: any) {
      
      throw error;
    }
  }
}

export const simpleQuizService = new SimpleQuizService();
export default simpleQuizService; 