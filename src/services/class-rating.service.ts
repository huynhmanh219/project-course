import { apiClient } from './api';

export interface ClassRating {
  id: number;
  class_id: number;
  student_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface ClassRatingCreate {
  class_id: number;
  rating: number;
  comment?: string;
}

export interface ClassRatingUpdate {
  rating: number;
  comment?: string;
}

export interface ClassRatingStats {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

class ClassRatingService {
  private baseURL = '/class-ratings';

  async getClassRatings(classId: number): Promise<{
    success: boolean;
    data: ClassRating[];
    stats: ClassRatingStats;
  }> {
    try {
      const response = await apiClient.get(`${this.baseURL}/class/${classId}/ratings`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tải đánh giá lớp học');
    }
  }

  async getClassRatingStats(classId: number): Promise<ClassRatingStats> {
    try {
      const response = await apiClient.get(`${this.baseURL}/class/${classId}/stats`);
      return response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tải thống kê đánh giá');
    }
  }

  async getStudentClassRating(classId: number): Promise<ClassRating | null> {
    try {
      const response = await apiClient.get(`${this.baseURL}/class/${classId}/my-rating`);
      return response.data || response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; 
      }
      throw new Error(error.response?.data?.message || 'Không thể tải đánh giá của bạn');
    }
  }

  async createClassRating(ratingData: ClassRatingCreate): Promise<ClassRating> {
    try {
      const response = await apiClient.post(this.baseURL, ratingData);
      return response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tạo đánh giá');
    }
  }

  async updateClassRating(ratingId: number, ratingData: ClassRatingUpdate): Promise<ClassRating> {
    try {
      const response = await apiClient.put(`${this.baseURL}/${ratingId}`, ratingData);
      return response.data || response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật đánh giá');
    }
  }
  
  async deleteClassRating(ratingId: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseURL}/${ratingId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể xóa đánh giá');
    }
  }
}

export const classRatingService = new ClassRatingService(); 