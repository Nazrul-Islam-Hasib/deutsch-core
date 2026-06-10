import { create } from 'zustand';
import type { AuthState } from '../types/index';
import { authApi } from '../services/api/authApi';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  init: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        set({ user: JSON.parse(userStr) });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      if (response.success) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isLoading: false });
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
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isLoading: false });
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

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
