import { z } from 'zod';

export const createWordSchema = z.object({
  body: z.object({
    germanWord: z.string({
      error: 'German word is required',
    }),
    translation: z.string({
      error: 'Translation is required',
    }),
    article: z.string().optional(),
    wordType: z.string().optional(),
  }),
});

export const updateWordSchema = z.object({
  body: z.object({
    germanWord: z.string().optional(),
    translation: z.string().optional(),
    article: z.string().optional(),
    wordType: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid word ID'),
  }),
});

export const getWordByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid word ID'),
  }),
});
