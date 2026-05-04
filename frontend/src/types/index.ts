export interface Word {
  id: string;
  germanWord: string;
  translation: string;
  article?: string;
  wordType?: string;
  createdAt: string;
  progress?: FlashcardProgress;
}

export interface FlashcardProgress {
  id: string;
  wordId: string;
  isKnown: boolean;
  lastReviewed: string;
  reviewCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error: string | null;
}

export interface QuizQuestion {
  wordId: string;
  germanWord: string;
  article?: string;
  correctAnswer: string;
  options: string[];
}

export interface WordState {
  words: Word[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  fetchWords: (search?: string, page?: number, limit?: number) => Promise<void>;
  addWord: (word: Partial<Word>) => Promise<boolean>;
  deleteWord: (id: string) => Promise<void>;
  updateProgress: (id: string, isKnown: boolean) => Promise<void>;
  currentWord: Word | null;
  fetchWordById: (id: string) => Promise<void>;
  updateWord: (id: string, word: Partial<Word>) => Promise<boolean>;
}