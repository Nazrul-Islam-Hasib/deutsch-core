const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deutsch-core-backend.vercel.app'

export const ENDPOINTS = {
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
        me: `${API_BASE_URL}/auth/me`,
    },
    words: {
        all: (search?: string, page: number = 1, limit: number = 20) => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            return `${API_BASE_URL}/words?${params.toString()}`;
        },
        byId: (id: string) => `${API_BASE_URL}/words/${id}`,
        create: `${API_BASE_URL}/words`,
        update: (id: string) => `${API_BASE_URL}/words/${id}`,
        delete: (id: string) => `${API_BASE_URL}/words/${id}`,
        progress: (id: string) => `${API_BASE_URL}/words/${id}/progress`,
    },
    quiz: {
        get: (limit: number = 5) => `${API_BASE_URL}/quiz?limit=${limit}`,
    },
    health: `${API_BASE_URL}/health`,
}
