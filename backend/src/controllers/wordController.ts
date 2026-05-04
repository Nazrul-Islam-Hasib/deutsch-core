import { Request, Response } from 'express';
import * as wordService from '../services/wordService';

export const createWord = async (req: Request, res: Response) => {
  try {
    const word = await wordService.createWord(req.body);
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
        error: 'WORD_ALREADY_EXISTS: The German word is already in the archive.',
      });
    }
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const getAllWords = async (req: Request, res: Response) => {
  try {
    const search = req.query['search'] as string;
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;

    const result = await wordService.getAllWords(search, page, limit);

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

export const getWordById = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const word = await wordService.getWordById(id);
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

export const updateWord = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const word = await wordService.updateWord(id, req.body);
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
        error: 'WORD_ALREADY_EXISTS: The German word is already in the archive.',
      });
    }
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const deleteWord = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await wordService.deleteWord(id);
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

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { isKnown } = req.body;
    const progress = await wordService.updateWordProgress(id, isKnown);
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
