// API Configuration
export { apiClient, API_BASE_URL, handleApiResponse, handleApiError } from './api';

// Types
export * from './types';

// Import services first
import authService from './auth.service';

// Import simple services
import { simpleUserService } from './user.service.simple';
import { simpleCourseService } from './course.service.simple';
import { simpleClassService } from './class.service.simple';
import { simpleQuizService } from './quiz.service.simple';
import { simpleChapterService } from './chapter.service.simple';
import { simpleLectureService } from './lecture.service.simple';

// Export services
export {
  authService,

  simpleUserService,
  simpleCourseService,
  simpleClassService,
  simpleQuizService,
  simpleChapterService,
  simpleLectureService,
};

// Service collection object
export const services = {
  auth: authService,
  simpleUser: simpleUserService,
  simpleCourse: simpleCourseService,
  simpleClass: simpleClassService,
  simpleQuiz: simpleQuizService,
  simpleChapter: simpleChapterService,
  simpleLecture: simpleLectureService,
};

// Default export
export default services;
