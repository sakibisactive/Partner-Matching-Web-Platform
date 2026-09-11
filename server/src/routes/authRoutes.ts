import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  sendOTP,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter, otpVerificationLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/verify-email', otpVerificationLimiter, verifyEmail);
router.post('/send-otp', authLimiter, sendOTP);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', otpVerificationLimiter, resetPassword);
router.get('/me', protect, getMe);

export default router;
