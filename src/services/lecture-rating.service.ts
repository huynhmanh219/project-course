import { apiClient } from './api';

export interface LectureRating {
  id: number;
  lecture_id: number;
  student_id: number;
  rating: number;
  comment?: string;
  student?: {
    id: number;
    name: string;
  };
}

export interface CreateRatingData {
  rating: number;
  comment?: string;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

class LectureRatingService {
  // Student APIs
  async getRatingsForLecture(lectureId: number) {
    const response = await apiClient.get(`/lectures/${lectureId}/ratings`);
    return response.data;
  }

  async createRating(lectureId: number, data: CreateRatingData) {
    const response = await apiClient.post(`/lectures/${lectureId}/ratings`, data);
    return response.data;
  }

  async getMyRating(lectureId: number) {
    const response = await apiClient.get(`/lectures/${lectureId}/my-rating`);
    return response.data;
  }

  async updateRating(ratingId: number, data: CreateRatingData) {
    const response = await apiClient.put(`/lecture-ratings/${ratingId}`, data);
    return response.data;
  }

  async deleteRating(ratingId: number) {
    const response = await apiClient.delete(`/lecture-ratings/${ratingId}`);
    return response.data;
  }

  // Teacher APIs
  async getMyLectureRatings() {
    const response = await apiClient.get('/my-lectures/ratings');
    return response.data;
  }
}

export const lectureRatingService = new LectureRatingService(); 