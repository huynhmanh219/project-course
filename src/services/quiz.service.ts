import { api } from './api';
import { 
  Quiz, 
  Question, 
  Answer, 
  QuizSubmission, 
  QuizResult,
  QuizAttempt,
  QuizStatistics
} from './types';

export const quizService = {
  // ============ TEACHER FUNCTIONS ============
  
  // Quản lý đề thi
  async getAllQuizzes(lopHocId?: number): Promise<Quiz[]> {
    const response = await api.get('/quiz', {
      params: { lopHocId }
    });
    return response.data;
  },

  async getQuizById(id: number): Promise<Quiz> {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },

  async createQuiz(quizData: Omit<Quiz, 'ID' | 'Created_At'>): Promise<Quiz> {
    const response = await api.post('/quiz', quizData);
    return response.data;
  },

  async updateQuiz(id: number, quizData: Partial<Quiz>): Promise<Quiz> {
    const response = await api.put(`/quiz/${id}`, quizData);
    return response.data;
  },

  async deleteQuiz(id: number): Promise<void> {
    await api.delete(`/quiz/${id}`);
  },

  async publishQuiz(id: number): Promise<Quiz> {
    const response = await api.patch(`/quiz/${id}/publish`);
    return response.data;
  },

  async closeQuiz(id: number): Promise<Quiz> {
    const response = await api.patch(`/quiz/${id}/close`);
    return response.data;
  },

  // Quản lý câu hỏi
  async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
    const response = await api.get(`/quiz/${quizId}/questions`);
    return response.data;
  },

  async createQuestion(questionData: Omit<Question, 'ID' | 'Created_At'>): Promise<Question> {
    const response = await api.post('/quiz/questions', questionData);
    return response.data;
  },

  async updateQuestion(id: number, questionData: Partial<Question>): Promise<Question> {
    const response = await api.put(`/quiz/questions/${id}`, questionData);
    return response.data;
  },

  async deleteQuestion(id: number): Promise<void> {
    await api.delete(`/quiz/questions/${id}`);
  },

  // Quản lý đáp án
  async createAnswer(answerData: Omit<Answer, 'ID'>): Promise<Answer> {
    const response = await api.post('/quiz/answers', answerData);
    return response.data;
  },

  async updateAnswer(id: number, answerData: Partial<Answer>): Promise<Answer> {
    const response = await api.put(`/quiz/answers/${id}`, answerData);
    return response.data;
  },

  async deleteAnswer(id: number): Promise<void> {
    await api.delete(`/quiz/answers/${id}`);
  },

  // Xem kết quả và thống kê
  async getQuizResults(quizId: number): Promise<QuizResult[]> {
    const response = await api.get(`/quiz/${quizId}/results`);
    return response.data;
  },

  async getQuizStatistics(quizId: number): Promise<QuizStatistics> {
    const response = await api.get(`/quiz/${quizId}/statistics`);
    return response.data;
  },

  async exportQuizResults(quizId: number, format: 'excel' | 'pdf' = 'excel'): Promise<Blob> {
    const response = await api.get(`/quiz/${quizId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // ============ STUDENT FUNCTIONS ============
  
  // Xem danh sách bài thi
  async getAvailableQuizzes(sinhVienId: number): Promise<Quiz[]> {
    const response = await api.get('/quiz/available', {
      params: { sinhVienId }
    });
    return response.data;
  },

  async getStudentQuizHistory(sinhVienId: number): Promise<QuizAttempt[]> {
    const response = await api.get('/quiz/history', {
      params: { sinhVienId }
    });
    return response.data;
  },

  // Làm bài thi
  async startQuiz(quizId: number, sinhVienId: number): Promise<QuizSubmission> {
    const response = await api.post(`/quiz/${quizId}/start`, {
      sinhVienId
    });
    return response.data;
  },

  async submitAnswer(submissionId: number, questionId: number, answerId: number): Promise<void> {
    await api.post(`/quiz/submission/${submissionId}/answer`, {
      questionId,
      answerId
    });
  },

  async saveProgress(submissionId: number, answers: Record<number, number>): Promise<void> {
    await api.post(`/quiz/submission/${submissionId}/save`, {
      answers
    });
  },

  async submitQuiz(submissionId: number): Promise<QuizResult> {
    const response = await api.post(`/quiz/submission/${submissionId}/submit`);
    return response.data;
  },

  async getQuizSubmission(submissionId: number): Promise<QuizSubmission> {
    const response = await api.get(`/quiz/submission/${submissionId}`);
    return response.data;
  },

  // Xem kết quả
  async getStudentQuizResult(submissionId: number): Promise<QuizResult> {
    const response = await api.get(`/quiz/submission/${submissionId}/result`);
    return response.data;
  },

  async getStudentQuizAttempts(quizId: number, sinhVienId: number): Promise<QuizAttempt[]> {
    const response = await api.get(`/quiz/${quizId}/attempts`, {
      params: { sinhVienId }
    });
    return response.data;
  },

  // ============ UTILITY FUNCTIONS ============
  
  async checkQuizAccess(quizId: number, sinhVienId: number): Promise<boolean> {
    try {
      const response = await api.get(`/quiz/${quizId}/access`, {
        params: { sinhVienId }
      });
      return response.data.hasAccess;
    } catch (error) {
      return false;
    }
  },

  async getRemainingTime(submissionId: number): Promise<number> {
    const response = await api.get(`/quiz/submission/${submissionId}/time`);
    return response.data.remainingTimeInMinutes;
  },

  async duplicateQuiz(quizId: number): Promise<Quiz> {
    const response = await api.post(`/quiz/${quizId}/duplicate`);
    return response.data;
  }
}; 