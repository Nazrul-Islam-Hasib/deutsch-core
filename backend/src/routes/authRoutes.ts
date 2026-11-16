import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../services/authService';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.me);
router.get('/sessions', authenticate, authController.getSessions);
router.post('/activity', authenticate, (req, res) => {
  // Activity update is already handled by authenticate middleware
  res.status(200).json({ success: true, data: null, error: null });
});

export default router;
