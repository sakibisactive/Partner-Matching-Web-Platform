import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { sendOTPEmail } from '../services/emailService.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

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

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, gender, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email is already registered' });
      return;
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password,
      role: 'User',
      isVerified: false,
      verificationToken: otpCode,
    });

    // Create Initial Blank Profile (NO AUTOMATIC LIFESTYLE DEFAULTS)
    await Profile.create({
      userId: user._id,
      age: age || 24,
      gender: gender || 'Male',
      bio: '',
      photos: [],
      lifestyle: {}, // Unselected - must be chosen manually by user for 100% completion
      personalityAnswers: [],
      interests: [],
      preferences: {
        minAge: 18,
        maxAge: 50,
        gender: [gender === 'Male' ? 'Female' : 'Male'],
        maxDistanceKm: 100,
        relationshipType: ['Long-term'],
        interests: [],
      },
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Send 6-digit OTP via Brevo SMTP
    await sendOTPEmail(user.email, user.name, otpCode);

    res.status(201).json({
      success: true,
      message: `Registration successful! 6-digit OTP code sent to ${user.email}`,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
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

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status === 'banned') {
      res.status(403).json({ success: false, message: 'Your account has been banned by an administrator' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
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
    const { token, otpCode } = req.body;
    const codeToVerify = token || otpCode;

    const user = await User.findOne({ verificationToken: codeToVerify }).select('+verificationToken');

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid 6-digit OTP verification code' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Account successfully verified!' });
  } catch (err: any) {
    next(err);
  }
};

export const sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'No user account found with that email' });
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = otpCode;
    await user.save();

    await sendOTPEmail(user.email, user.name, otpCode);

    res.status(200).json({
      success: true,
      message: `New 6-digit OTP sent to ${email}`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'No account found with that email' });
      return;
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, user.name, resetToken);

    res.status(200).json({ success: true, message: 'Password reset 6-digit OTP sent to your email.' });
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      res.status(400).json({ success: false, message: 'OTP is invalid or has expired' });
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You may now login.' });
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
    const profile = await Profile.findOne({ userId: req.user._id }).populate('interests preferences.interests');
    res.status(200).json({
      success: true,
      user: req.user,
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};
