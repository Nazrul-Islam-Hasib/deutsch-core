import { ENDPOINTS } from '../../config/api';
import type { ApiResponse, User } from '../../types/index';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(ENDPOINTS.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  register: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(ENDPOINTS.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },
};
