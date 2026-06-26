import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { demoMiddleware } from '../middleware/demo-middleware.js';

const router = Router();

// Demo mode: protected auth routes bypass authentication
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', demoMiddleware, authController.getCurrentUser);
router.put('/profile', demoMiddleware, authController.updateProfile);
router.get('/profile/stats', demoMiddleware, authController.getProfileStats);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
