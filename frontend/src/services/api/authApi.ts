import type { ApiResponse, User } from '../../types/index';

const API_BASE_URL = 'http://localhost:3000';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  register: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },
};
