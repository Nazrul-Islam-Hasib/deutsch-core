import type { ApiResponse, QuizQuestion } from '../../types/index';

const API_BASE_URL = 'http://localhost:3000';

export const quizApi = {
  getQuiz: async (limit: number = 5): Promise<ApiResponse<QuizQuestion[]>> => {
    const response = await fetch(`${API_BASE_URL}/quiz?limit=${limit}`);
    return await response.json();
  },
};
