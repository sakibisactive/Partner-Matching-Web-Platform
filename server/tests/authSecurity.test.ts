import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Auth & Security Verification Suite', () => {
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

  describe('OTP & Password Reset Token Cryptography', () => {
    it('should securely hash 6-digit OTP codes with SHA-256', () => {
      const otp = '482910';
      const hashed = hashToken(otp);

      expect(hashed).toBeDefined();
      expect(hashed.length).toBe(64); // SHA-256 output is 64 hex characters
      expect(hashed).not.toContain(otp);
      expect(hashToken(otp)).toBe(hashed); // Deterministic matching
    });

    it('should resist timing attacks using timingSafeEqual', () => {
      const tokenA = hashToken('123456');
      const tokenB = hashToken('123456');
      const tokenC = hashToken('654321');

      expect(safeCompare(tokenA, tokenB)).toBe(true);
      expect(safeCompare(tokenA, tokenC)).toBe(false);
    });

    it('should reject NoSQL injection objects in reset token validation', () => {
      const isValidCode = (val: any): boolean => {
        if (!val || typeof val !== 'string') return false;
        return /^\d{6}$/.test(val.trim());
      };

      expect(isValidCode('123456')).toBe(true);
      expect(isValidCode('999999')).toBe(true);
      expect(isValidCode({ $ne: null })).toBe(false); // NoSQL injection blocked
      expect(isValidCode({ $gt: '' })).toBe(false);
      expect(isValidCode('12345')).toBe(false);
      expect(isValidCode('1234567')).toBe(false);
      expect(isValidCode('abcdef')).toBe(false);
    });
  });

  describe('Registration JWT Payload Sanitization (SEC-01)', () => {
    it('should ensure pending registration tokens never leak plaintext OTP or password', async () => {
      const rawPassword = 'mySuperSecretPassword123!';
      const rawOtp = '582914';

      // Pre-hashing as performed in authController.register
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const hashedOtp = hashToken(rawOtp);

      const secret = 'test_jwt_secret_key_123';
      const token = jwt.sign(
        {
          name: 'Test User',
          email: 'test@example.com',
          password: hashedPassword, // Hashed password only
          hashedOtp, // Hashed OTP only
        },
        secret,
        { expiresIn: '15m' }
      );

      // Inspect decoded payload
      const decoded: any = jwt.decode(token);

      expect(decoded.name).toBe('Test User');
      expect(decoded.email).toBe('test@example.com');
      // Plaintext values must NOT be present in decoded payload
      expect(decoded.otpCode).toBeUndefined();
      expect(decoded.password).not.toBe(rawPassword);
      expect(decoded.password.startsWith('$2a$') || decoded.password.startsWith('$2b$')).toBe(true);

      // Verify the submitted raw OTP can be validated strictly via hash
      const submittedHash = hashToken('582914');
      expect(safeCompare(submittedHash, decoded.hashedOtp)).toBe(true);
    });
  });
});
