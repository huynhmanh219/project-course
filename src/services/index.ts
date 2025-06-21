// API Configuration
export { apiClient, API_BASE_URL, handleApiResponse, handleApiError } from './api';

// Types
export * from './types';

// Import services first
import authService from './auth.service';
import userService from './user.service';
import courseService from './course.service';
import lectureService from './lecture.service';
import materialService from './material.service';
import { quizService } from './quiz.service';

// Export services
export {
  authService,
  userService,
  courseService,
  lectureService,
  materialService,
  quizService,
};

// Service collection object
export const services = {
  auth: authService,
  user: userService,
  course: courseService,
  lecture: lectureService,
  material: materialService,
  quiz: quizService,
};

// Default export
export default services; 