import { Response } from 'express';
import * as wordService from '../services/wordService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createWord = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const word = await wordService.createWord(userId, req.body);
    return res.status(201).json({
      success: true,
      data: word,
      error: null,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'WORD_ALREADY_EXISTS: The German word is already in your archive.',
      });
    }
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const getAllWords = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const search = req.query['search'] as string;
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;

    const result = await wordService.getAllWords(userId, search, page, limit);

    return res.status(200).json({
      success: true,
      data: result.words,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const getWordById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params['id'] as string;
    const word = await wordService.getWordById(id, userId);
    if (!word) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Word not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: word,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const updateWord = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params['id'] as string;
    const word = await wordService.updateWord(id, userId, req.body);
    return res.status(200).json({
      success: true,
      data: word,
      error: null,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'WORD_ALREADY_EXISTS: The German word is already in your archive.',
      });
    }
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const deleteWord = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params['id'] as string;
    await wordService.deleteWord(id, userId);
    return res.status(200).json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params['id'] as string;
    const { isKnown } = req.body;
    const progress = await wordService.updateWordProgress(id, userId, isKnown);
    return res.status(200).json({
      success: true,
      data: progress,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};
