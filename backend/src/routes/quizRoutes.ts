import { Router } from 'express';
import * as quizController from '../controllers/quizController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticate as any, quizController.getQuiz);

export default router;
