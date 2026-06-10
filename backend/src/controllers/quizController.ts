import { Response } from 'express';
import * as quizService from '../services/quizService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const limitStr = req.query['limit'] as string;
    const limit = limitStr ? parseInt(limitStr, 10) : 5;
    const questions = await quizService.generateQuiz(userId, limit);
    
    return res.status(200).json({
      success: true,
      data: questions,
      error: null,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};
