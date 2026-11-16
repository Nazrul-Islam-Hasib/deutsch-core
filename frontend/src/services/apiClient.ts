import { ENDPOINTS } from '../config/api';

class ApiClient {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(ENDPOINTS.auth.refresh, {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          const newToken = result.data.accessToken;
          this.setAccessToken(newToken);
          return newToken;
        }
        return null;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    
    // Add CSRF header for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    let response = await fetch(url, fetchOptions);

    if (response.status === 401 && url !== ENDPOINTS.auth.refresh && url !== ENDPOINTS.auth.login) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await fetch(url, { ...fetchOptions, headers });
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return {
        success: response.ok,
        data: null,
        error: response.ok ? null : `Request failed with status ${response.status}`
    } as any;
  }

  get<T>(url: string, options: RequestInit = {}) {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  post<T>(url: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string, options: RequestInit = {}) {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
