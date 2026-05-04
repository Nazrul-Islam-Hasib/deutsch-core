import { create } from 'zustand';
import type { Word, WordState } from '../types/index';
import { wordApi } from '../services/api/wordApi';

export const useWordStore = create<WordState>((set) => ({
  words: [],
  isLoading: false,
  error: null,
  currentWord: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },

  fetchWords: async (search?: string, page: number = 1, limit: number = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordApi.getAll(search, page, limit);
      if (response.success) {
        set({ 
          words: response.data, 
          pagination: response.pagination || { total: response.data.length, page: 1, limit: 20, totalPages: 1 },
          isLoading: false 
        });
      } else {
        set({ error: String(response.error), isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch words', isLoading: false });
    }
  },

  fetchWordById: async (id: string) => {
    // If currentWord is already set and has the right id, don't fetch unless needed
    // But for simplicity let's just fetch
    set({ isLoading: true, error: null, currentWord: null });
    try {
      const response = await wordApi.getById(id);
      if (response.success) {
        set({ currentWord: response.data, isLoading: false });
      } else {
        set({ error: String(response.error), isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch word details', isLoading: false });
    }
  },

  addWord: async (wordData: Partial<Word>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordApi.create(wordData);
      if (response.success) {
        set((state) => ({ 
          words: [response.data, ...state.words], 
          isLoading: false 
        }));
        return true;
      } else {
        set({ error: String(response.error), isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to add word', isLoading: false });
      return false;
    }
  },

  updateWord: async (id: string, wordData: Partial<Word>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordApi.update(id, wordData);
      if (response.success) {
        set((state) => ({
          words: state.words.map((w) => (w.id === id ? response.data : w)),
          currentWord: response.data,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: String(response.error), isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to update word', isLoading: false });
      return false;
    }
  },

  deleteWord: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordApi.delete(id);
      if (response.success) {
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
          isLoading: false,
        }));
      } else {
        set({ error: String(response.error), isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to delete word', isLoading: false });
    }
  },

  updateProgress: async (id: string, isKnown: boolean) => {
    try {
      const response = await wordApi.updateProgress(id, isKnown);
      if (response.success) {
        // Update words list
        set((state) => ({
          words: state.words.map((w) => 
            w.id === id ? { ...w, progress: response.data } : w
          ),
          // Update currentWord if it's the one being reviewed
          currentWord: state.currentWord?.id === id 
            ? { ...state.currentWord, progress: response.data } 
            : state.currentWord
        }));
      }
    } catch (error) {
      console.error('Failed to update progress', error);
    }
  },
}));
