import { Router } from 'express';
import * as wordController from '../controllers/wordController';
import { validate } from '../middlewares/validate';
import {
  createWordSchema,
  updateWordSchema,
  getWordByIdSchema,
} from '../utils/wordValidation';

const router = Router();

router.post(
  '/',
  validate(createWordSchema),
  wordController.createWord
);

router.get('/', wordController.getAllWords);

router.get(
  '/:id',
  validate(getWordByIdSchema),
  wordController.getWordById
);

router.put(
  '/:id',
  validate(updateWordSchema),
  wordController.updateWord
);

router.delete(
  '/:id',
  validate(getWordByIdSchema),
  wordController.deleteWord
);

router.post(
  '/:id/progress',
  validate(getWordByIdSchema),
  wordController.updateProgress
);

export default router;
