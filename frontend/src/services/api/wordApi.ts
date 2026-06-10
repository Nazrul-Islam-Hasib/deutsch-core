import type { ApiResponse, Word } from '../../types/index';

const API_BASE_URL = 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const wordApi = {
  getAll: async (search?: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Word[]>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/words?${params.toString()}`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  create: async (data: Partial<Word>): Promise<ApiResponse<Word>> => {
    const response = await fetch(`${API_BASE_URL}/words`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  getById: async (id: string): Promise<ApiResponse<Word>> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  update: async (id: string, data: Partial<Word>): Promise<ApiResponse<Word>> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await response.json();
  },

  updateProgress: async (id: string, isKnown: boolean): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ isKnown }),
    });
    return await response.json();
  },
};
