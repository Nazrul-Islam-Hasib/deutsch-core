import { ENDPOINTS } from '../../config/api';
import { apiClient } from '../apiClient';
import type { ApiResponse, FlashcardProgress, Word } from '../../types/index';

export const wordApi = {
  getAll: async (search?: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Word[]>> => {
    return apiClient.get(ENDPOINTS.words.all(search, page, limit));
  },

  create: async (data: Partial<Word>): Promise<ApiResponse<Word>> => {
    return apiClient.post(ENDPOINTS.words.create, data);
  },

  getById: async (id: string): Promise<ApiResponse<Word>> => {
    return apiClient.get(ENDPOINTS.words.byId(id));
  },

  update: async (id: string, data: Partial<Word>): Promise<ApiResponse<Word>> => {
    return apiClient.put(ENDPOINTS.words.update(id), data);
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(ENDPOINTS.words.delete(id));
  },

  updateProgress: async (id: string, isKnown: boolean): Promise<ApiResponse<FlashcardProgress>> => {
    return apiClient.post(ENDPOINTS.words.progress(id), { isKnown });
  },
};
