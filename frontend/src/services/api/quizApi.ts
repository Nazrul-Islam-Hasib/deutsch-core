import { ENDPOINTS } from '../../config/api';
import { apiClient } from '../apiClient';
import type { ApiResponse, QuizQuestion } from '../../types/index';

export const quizApi = {
  getQuiz: async (limit: number = 5): Promise<ApiResponse<QuizQuestion[]>> => {
    return apiClient.get(ENDPOINTS.quiz.get(limit));
  },
};
