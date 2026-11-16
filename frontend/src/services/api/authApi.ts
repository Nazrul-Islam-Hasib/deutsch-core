import { ENDPOINTS } from '../../config/api';
import { apiClient } from '../apiClient';
import type { ApiResponse, User } from '../../types/index';

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post(ENDPOINTS.auth.login, { email, password });
  },

  register: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post(ENDPOINTS.auth.register, { email, password });
  },

  me: async (): Promise<ApiResponse<User>> => {
    return apiClient.get(ENDPOINTS.auth.me);
  },

  refresh: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    return apiClient.post(ENDPOINTS.auth.refresh);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return apiClient.post(ENDPOINTS.auth.logout);
  },

  activity: async (): Promise<ApiResponse<null>> => {
    return apiClient.post(ENDPOINTS.auth.activity);
  },
};
