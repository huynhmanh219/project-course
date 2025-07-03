// API Configuration
export { apiClient, API_BASE_URL, handleApiResponse, handleApiError } from './api';

// Types
export * from './types';

import authService from './auth.service';

import { simpleUserService } from './user.service.simple';
import { simpleCourseService } from './course.service.simple';
import { simpleClassService } from './class.service.simple';
import { simpleQuizService } from './quiz.service.simple';
import { simpleChapterService } from './chapter.service.simple';
import { simpleLectureService } from './lecture.service.simple';
import { simpleMaterialService } from './material.service.simple';
import { classRatingService } from './class-rating.service';

export {
  authService,

  simpleUserService,
  simpleCourseService,
  simpleClassService,
  simpleQuizService,
  simpleChapterService,
  simpleLectureService,
  simpleMaterialService,
  classRatingService,
};

export const services = {
  auth: authService,
  simpleUser: simpleUserService,
  simpleCourse: simpleCourseService,
  simpleClass: simpleClassService,
  simpleQuiz: simpleQuizService,
  simpleChapter: simpleChapterService,
  simpleLecture: simpleLectureService,
  simpleMaterial: simpleMaterialService,
  classRating: classRatingService,
};

export default services;
