import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/api/authApi';

// Mock authApi
vi.mock('../services/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset store state manually if needed, but Zustand stores persist between tests if not handled
    // For simplicity in this test, we'll just set it
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  });

  it('should initialize with null user and token', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  describe('login', () => {
    it('should login successfully and set user and token', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = 'mock-token';
      
      (authApi.login as any).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: mockToken },
      });

      const success = await useAuthStore.getState().login('test@example.com', 'password');

      expect(success).toBe(true);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('should fail login and set error', async () => {
      (authApi.login as any).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const success = await useAuthStore.getState().login('test@example.com', 'wrong');

      expect(success).toBe(false);
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully and set user and token', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = 'mock-token';
      
      (authApi.register as any).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: mockToken },
      });

      const success = await useAuthStore.getState().register('test@example.com', 'password');

      expect(success).toBe(true);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });
  });

  describe('logout', () => {
    it('should clear user and token', () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        token: 'token',
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
