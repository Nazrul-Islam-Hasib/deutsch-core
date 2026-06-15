import { ENDPOINTS } from '../../config/api';
import type { ApiResponse, QuizQuestion } from '../../types/index';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const quizApi = {
  getQuiz: async (limit: number = 5): Promise<ApiResponse<QuizQuestion[]>> => {
    const response = await fetch(ENDPOINTS.quiz.get(limit), {
      headers: getHeaders(),
    });
    return await response.json();
  },
};
