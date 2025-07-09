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
    account: {
      email: string;
    };
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
    data: {
      ratings: ClassRating[];
      statistics: {
        average_rating: number;
        total_ratings: number;
        distribution: { [key: string]: number };
      };
      pagination?: any;
    };
  }> {
    try {
      const response = await apiClient.get(`${this.baseURL}/class/${classId}/ratings`);
      return response;
    } catch (error: any) {
      console.error('Error fetching class ratings:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải đánh giá lớp học');
    }
  }

  async getClassRatingStats(classId: number): Promise<ClassRatingStats> {
    try {
      const response = await apiClient.get(`${this.baseURL}/class/${classId}/stats`);
      return response.data || response;
    } catch (error: any) {
      console.error('Error fetching class rating stats:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải thống kê đánh giá');
    }
  }

  async getStudentClassRating(classId: number): Promise<ClassRating | null> {
    try {
      const response = await apiClient.get(`${this.baseURL}/class/${classId}/my-rating`);

      if (response == null) return null;

      if (response.success === false || response.status === 'error') {
        return null;
      }

      if (response.status === 'success' || response.success === true) {
        return response.data ?? response;
      }

      if (response.rating || response.id) {
        return response as unknown as ClassRating;
      }

      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching student class rating:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải đánh giá của bạn');
    }
  }

  async createClassRating(ratingData: ClassRatingCreate): Promise<ClassRating> {
    try {
      const response = await apiClient.post(this.baseURL, ratingData);
      return response.data || response;
    } catch (error: any) {
      console.error('Error creating class rating:', error);
      throw new Error(error.response?.data?.message || 'Không thể tạo đánh giá');
    }
  }

  async updateClassRating(ratingId: number, ratingData: ClassRatingUpdate): Promise<ClassRating> {
    if (!ratingId) {
      throw new Error('Missing ratingId for updateClassRating');
    }
    try {
      const response = await apiClient.put(`${this.baseURL}/${ratingId}`, ratingData);
      return response.data || response;
    } catch (error: any) {
      console.error('Error updating class rating:', error);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật đánh giá');
    }
  }

  async deleteClassRating(ratingId: number): Promise<void> {
    if (!ratingId) {
      throw new Error('Missing ratingId for deleteClassRating');
    }
    try {
      await apiClient.delete(`${this.baseURL}/${ratingId}`);
    } catch (error: any) {
      console.error('Error deleting class rating:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa đánh giá');
    }
  }
      
  async getTopRatedClasses(limit: number = 10): Promise<{
    success: boolean;
    data: any[];
  }> {
    try {
      const response = await apiClient.get(`${this.baseURL}/top-rated?limit=${limit}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching top rated classes:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách lớp học được đánh giá cao');
    }
  }

  async getPendingRatings(page: number = 1, size: number = 20): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseURL}/pending?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error: any) {
      console.error('Error fetching pending ratings:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải đánh giá chờ duyệt');
    }
  }

  async approveRating(ratingId: number): Promise<void> {
    try {
      await apiClient.put(`${this.baseURL}/${ratingId}/approve`, {});
    } catch (error: any) {
      console.error('Error approving rating:', error);
      throw new Error(error.response?.data?.message || 'Không thể duyệt đánh giá');
    }
  }
}

export const classRatingService = new ClassRatingService(); 