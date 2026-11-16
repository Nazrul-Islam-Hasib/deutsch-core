import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/api/authApi';
import type { ApiResponse } from '../types/index';

// The backend sends data: null on failure; ApiResponse<T> types data as T.
const failure = (error: string): ApiResponse<never> => ({ success: false, data: null as never, error });

// Mock authApi
vi.mock('../services/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    refresh: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock apiClient
vi.mock('../services/apiClient', () => ({
  apiClient: {
    setAccessToken: vi.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  it('should initialize with null user and token', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isInitialized).toBe(false);
  });

  describe('init', () => {
    it('should restore session successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockAccessToken = 'new-access-token';
      
      vi.mocked(authApi.refresh).mockResolvedValue({
        success: true,
        data: { accessToken: mockAccessToken },
        error: null,
      });
      vi.mocked(authApi.me).mockResolvedValue({
        success: true,
        data: mockUser,
        error: null,
      });

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockAccessToken);
      expect(state.isInitialized).toBe(true);
    });

    it('should fail restoration if refresh fails', async () => {
      vi.mocked(authApi.refresh).mockResolvedValue(failure('No refresh token'));

      await useAuthStore.getState().init();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('login', () => {
    it('should login successfully and set user and token', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = 'mock-token';
      
      vi.mocked(authApi.login).mockResolvedValue({
        success: true,
        data: { user: mockUser, accessToken: mockToken },
        error: null,
      });

      const success = await useAuthStore.getState().login('test@example.com', 'password');

      expect(success).toBe(true);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isInitialized).toBe(true);
    });

    it('should fail login and set error', async () => {
      vi.mocked(authApi.login).mockResolvedValue(failure('Invalid credentials'));

      const success = await useAuthStore.getState().login('test@example.com', 'wrong');

      expect(success).toBe(false);
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should clear user and token', async () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        token: 'token',
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });
});
