import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { sendOTPEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

const safeCompare = (a: string, b: string): boolean => {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
};

const generateTokens = (id: string) => {
  const accessToken = jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_partner_match_2026',
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_partner_match_2026',
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Step 1: Initiate Registration
 * Validates inputs, pre-hashes the password, generates a 6-digit OTP code,
 * and seals an opaque registration token containing ONLY the hashed password and hashed OTP.
 * The plaintext password and OTP code are NEVER sent to the client!
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, gender, age } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid input format' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email is already registered' });
      return;
    }

    // Pre-hash password before embedding into registration token
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate cryptographically secure 6-digit OTP code
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = hashToken(otpCode);

    // Create temporary pending registration JWT token (valid for 15 mins)
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_partner_match_2026';
    const pendingToken = jwt.sign(
      {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword, // Hashed with bcrypt, never plaintext!
        gender: gender || 'Male',
        age: Number(age) || 24,
        hashedOtp, // Hashed with SHA-256, never plaintext!
      },
      secret,
      { expiresIn: '15m' }
    );

    // Dispatch 6-digit OTP via email asynchronously
    sendOTPEmail(cleanEmail, name.trim(), otpCode).catch((e) => {
      console.error(`[Background OTP Email Error]: ${e.message}`);
    });

    res.status(200).json({
      success: true,
      message: `6-digit OTP code sent to ${cleanEmail}. Check inbox & spam folder!`,
      pendingToken,
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Step 2: Verify 6-Digit OTP & Create Supabase PostgreSQL Records
 * Verifies OTP code against the hashed OTP in pendingToken, then creates User & Profile in Supabase.
 */
export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pendingToken, otpCode } = req.body;

    if (!pendingToken || !otpCode) {
      res.status(400).json({ success: false, message: 'Pending registration token and 6-digit OTP are required.' });
      return;
    }

    if (typeof otpCode !== 'string' && typeof otpCode !== 'number') {
      res.status(400).json({ success: false, message: 'Invalid OTP format' });
      return;
    }

    const stringOtp = otpCode.toString().trim();
    if (!/^\d{6}$/.test(stringOtp)) {
      res.status(400).json({ success: false, message: 'OTP must be exactly a 6-digit number.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_partner_match_2026';

    let decoded: any;
    try {
      decoded = jwt.verify(pendingToken, secret);
    } catch (err) {
      res.status(400).json({ success: false, message: 'OTP token has expired or is invalid. Please register again.' });
      return;
    }

    // Verify OTP securely using timing-safe comparison
    const submittedHash = hashToken(stringOtp);
    const isValid = decoded.hashedOtp
      ? safeCompare(submittedHash, decoded.hashedOtp)
      : decoded.otpCode === stringOtp;

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid 6-digit OTP verification code.' });
      return;
    }

    // Double-check email availability in Supabase
    const existingUser = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Account with this email has already been registered.' });
      return;
    }

    // Create User Document in Supabase PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: decoded.name,
        email: decoded.email,
        password: decoded.password, // Pre-hashed bcrypt password preserved
        role: 'User',
        isVerified: true,
      },
    });

    // Create Profile Document in Supabase PostgreSQL
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: decoded.name,
        age: decoded.age || 24,
        gender: decoded.gender || 'Male',
        bio: '',
        photos: [],
        interests: [],
        personalityAnswers: [],
        completionPercentage: 15,
        isProfileComplete: false,
        preference: {
          minAge: 18,
          maxAge: 50,
          gender: [decoded.gender === 'Male' ? 'Female' : 'Male'],
          maxDistanceKm: 100,
          relationshipType: ['Long-term'],
          interests: [],
        },
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      success: true,
      message: 'Email verified! Account and profile successfully created in Supabase.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid email or password format' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, otpCode, pendingToken } = req.body;
    if (pendingToken) {
      return verifyOTP(req, res, next);
    }

    const rawCode = token || otpCode;
    if (!rawCode || (typeof rawCode !== 'string' && typeof rawCode !== 'number')) {
      res.status(400).json({ success: false, message: 'Verification code is required' });
      return;
    }

    const stringCode = rawCode.toString().trim();
    if (!/^\d{6}$/.test(stringCode)) {
      res.status(400).json({ success: false, message: 'Invalid 6-digit verification code' });
      return;
    }

    const hashedCode = hashToken(stringCode);
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedCode,
        verificationTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationTokenExpires: null,
      },
    });

    res.status(200).json({ success: true, message: 'Account successfully verified!' });
  } catch (err: any) {
    next(err);
  }
};

export const sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // Prevent user enumeration: always respond with a generic success message
    if (!user) {
      res.status(200).json({
        success: true,
        message: `If an account exists with ${cleanEmail}, a new 6-digit OTP code has been sent.`,
      });
      return;
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashToken(otpCode),
        verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    sendOTPEmail(user.email, user.name, otpCode).catch((e) => {
      console.error(`[Background Resend OTP Error]: ${e.message}`);
    });

    res.status(200).json({
      success: true,
      message: `If an account exists with ${cleanEmail}, a new 6-digit OTP code has been sent.`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // Always respond with a generic success message to prevent user enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset code has been dispatched.',
      });
      return;
    }

    const resetToken = crypto.randomInt(100000, 1000000).toString();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashToken(resetToken),
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        failedOtpAttempts: 0,
      },
    });

    sendPasswordResetEmail(user.email, user.name, resetToken).catch((e) => {
      console.error(`[Background Reset Password Error]: ${e.message}`);
    });

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset code has been dispatched.',
    });
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      res.status(400).json({ success: false, message: 'Email, 6-digit reset code, and new password are required' });
      return;
    }

    if (typeof email !== 'string' || (typeof token !== 'string' && typeof token !== 'number') || typeof newPassword !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid input types' });
      return;
    }

    const stringToken = token.toString().trim();
    if (!/^\d{6}$/.test(stringToken)) {
      res.status(400).json({ success: false, message: 'Reset code must be exactly a 6-digit number' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      res.status(400).json({ success: false, message: 'Reset code is invalid or has expired' });
      return;
    }

    if (user.resetPasswordExpires < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: null, resetPasswordExpires: null },
      });
      res.status(400).json({ success: false, message: 'Reset code has expired. Please request a new one.' });
      return;
    }

    if ((user.failedOtpAttempts || 0) >= 5) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: null, resetPasswordExpires: null },
      });
      res.status(400).json({ success: false, message: 'Too many incorrect attempts. Reset code invalidated for security.' });
      return;
    }

    const submittedHash = hashToken(stringToken);
    const isTokenMatch = safeCompare(user.resetPasswordToken, submittedHash) || user.resetPasswordToken === stringToken;

    if (!isTokenMatch) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedOtpAttempts: (user.failedOtpAttempts || 0) + 1 },
      });
      res.status(400).json({ success: false, message: 'Reset code is invalid or has expired' });
      return;
    }

    // Reset password successfully
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        failedOtpAttempts: 0,
      },
    });

    res.status(200).json({ success: true, message: 'Password reset successful. You may now sign in with your new password.' });
  } catch (err: any) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
      },
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};
