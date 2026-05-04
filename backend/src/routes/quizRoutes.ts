import { Router } from 'express';
import * as quizController from '../controllers/quizController';

const router = Router();

router.get('/', quizController.getQuiz);

export default router;
