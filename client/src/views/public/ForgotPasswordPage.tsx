import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../redux/services/authApi';
import { Mail, Lock, ShieldAlert, Sparkles, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const [forgotPassword, { isLoading: isRequesting }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const navigate = useNavigate();

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setSuccessInfo(`If an account exists with ${email}, a 6-digit verification code has been dispatched.`);
      setStep('reset');
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Failed to dispatch reset code. Please try again.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      await resetPassword({
        email: email.trim(),
        token: otpCode.trim(),
        newPassword,
      }).unwrap();

      setSuccessInfo('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Invalid or expired 6-digit reset code.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden glass-container shadow-2xl shadow-rose-500/10 border border-white/20"
      >
        {/* Left Side: Security Illustration & Reassurance */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-rose-950/30 via-[#10131D]/50 to-[#0c0e17]/80 backdrop-blur-md overflow-hidden border-r border-white/10">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
              <span>Account Security</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white font-outfit">
              Secure Account Recovery
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
              We take the privacy and safety of your romantic connections seriously. Reset your password securely with a 6-digit one-time code.
            </p>
          </div>

          <div className="relative my-6 rounded-2xl overflow-hidden shadow-xl border border-white/15 group">
            <img
              src="/images/auth-couple.jpg"
              alt="Romantic couple"
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                <span>Protected Credentials</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                All tokens expire in 15 minutes and are cryptographically verified in Supabase.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 font-medium">
            <span>End-to-End Encryption</span>
            <span>24/7 Security Shield</span>
          </div>
        </div>

        {/* Right Side: Recovery Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6 backdrop-blur-xl bg-[#0c0e17]/50">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 p-[1px] shadow-sm shadow-rose-500/30 mb-2 inline-flex">
              <div className="w-full h-full bg-[#0c0e17] rounded-[10px] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-outfit tracking-tight">
              {step === 'request' ? 'Reset Your Password' : 'Enter 6-Digit Code'}
            </h2>
            <p className="text-slate-300 text-xs">
              {step === 'request'
                ? 'Enter your registered email address to receive a secure recovery code.'
                : `Enter the code sent to ${email} and choose a new password.`}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successInfo}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'request' ? (
              <motion.form
                key="request-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleRequestSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4 text-slate-400" />}
                    className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    isLoading={isRequesting}
                    className="w-full gap-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30"
                  >
                    Send Reset Code
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="reset-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleResetSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    6-Digit Recovery Code
                  </label>
                  <Input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="text-center font-mono text-lg tracking-[0.4em] font-extrabold glass-input border-white/15 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    isLoading={isResetting}
                    className="w-full gap-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Reset Password & Continue
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="w-full py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Re-enter Email Address
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-slate-300">
            Remembered your password?{' '}
            <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
