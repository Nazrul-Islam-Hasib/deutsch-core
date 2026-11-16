import { create } from 'zustand';
import type { AuthState } from '../types/index';
import { authApi } from '../services/api/authApi';
import { apiClient } from '../services/apiClient';

interface ExtendedAuthState extends AuthState {
  isInitialized: boolean;
  init: () => Promise<void>;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  init: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true });
    try {
      const response = await authApi.refresh();
      if (response.success) {
        const { accessToken } = response.data;
        apiClient.setAccessToken(accessToken);
        
        const userResponse = await authApi.me();
        if (userResponse.success) {
          set({ 
            user: userResponse.data, 
            token: accessToken, 
            isLoading: false, 
            isInitialized: true 
          });
          return;
        }
      }
    } catch (error) {
      console.error('Auth initialization failed', error);
    }
    
    apiClient.setAccessToken(null);
    set({ user: null, token: null, isLoading: false, isInitialized: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      if (response.success) {
        const { user, accessToken } = response.data;
        apiClient.setAccessToken(accessToken);
        set({ user, token: accessToken, isLoading: false, isInitialized: true });
        return true;
      } else {
        set({ error: String(response.error), isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to login', isLoading: false });
      return false;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(email, password);
      if (response.success) {
        const { user, accessToken } = response.data;
        apiClient.setAccessToken(accessToken);
        set({ user, token: accessToken, isLoading: false, isInitialized: true });
        return true;
      } else {
        set({ error: String(response.error), isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to register', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed on server', error);
    }
    apiClient.setAccessToken(null);
    set({ user: null, token: null });
  },
}));
