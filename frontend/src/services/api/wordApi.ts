import { ENDPOINTS } from '../../config/api';
import type { ApiResponse, Word } from '../../types/index';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const wordApi = {
  getAll: async (search?: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Word[]>> => {
    const response = await fetch(ENDPOINTS.words.all(search, page, limit), {
      headers: getHeaders(),
    });
    return await response.json();
  },

  create: async (data: Partial<Word>): Promise<ApiResponse<Word>> => {
    const response = await fetch(ENDPOINTS.words.create, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  getById: async (id: string): Promise<ApiResponse<Word>> => {
    const response = await fetch(ENDPOINTS.words.byId(id), {
      headers: getHeaders(),
    });
    return await response.json();
  },

  update: async (id: string, data: Partial<Word>): Promise<ApiResponse<Word>> => {
    const response = await fetch(ENDPOINTS.words.update(id), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(ENDPOINTS.words.delete(id), {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await response.json();
  },

  updateProgress: async (id: string, isKnown: boolean): Promise<ApiResponse<any>> => {
    const response = await fetch(ENDPOINTS.words.progress(id), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ isKnown }),
    });
    return await response.json();
  },
};
