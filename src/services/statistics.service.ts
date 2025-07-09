import { apiClient } from './api';

export const statisticsService = {
  getSubjectStatus: (months: number = 12) => apiClient.get(`/statistics/subjects-status?months=${months}`),
  getPublishStatus: () => apiClient.get('/statistics/publish-status'),
  getAccountTotals: () => apiClient.get('/statistics/account-totals'),
  getTopSubjects: (limit: number = 5) => apiClient.get(`/statistics/top-subjects?limit=${limit}`)
}; 