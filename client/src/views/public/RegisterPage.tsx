import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegisterMutation, useVerifyEmailMutation } from '../../redux/services/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { Heart, Mail, Lock, User, Calendar, UserCheck, ShieldAlert, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'register' | 'verify-otp'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(24);
  const [otpCode, setOtpCode] = useState('');

  const [pendingToken, setPendingToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await registerUser({ name, email, password, gender, age }).unwrap();
      setPendingToken(res.pendingToken);
      setSuccessInfo(`6-digit OTP code sent to ${email}. Please check your inbox!`);
      setStep('verify-otp');
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await verifyEmail({ pendingToken, otpCode }).unwrap();

      if (res.user && res.accessToken) {
        dispatch(
          setCredentials({
            user: res.user,
            token: res.accessToken,
          })
        );
      }
      navigate('/edit-profile');
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Invalid 6-digit OTP code. Please check your email inbox.');
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
        {/* Left Side: Romantic Couple Illustration & Benefits */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-rose-950/30 via-[#10131D]/50 to-[#0c0e17]/80 backdrop-blur-md overflow-hidden border-r border-white/10">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
              <span>Begin Your Chapter</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white font-outfit">
              Find Your True Chemistry
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
              Say goodbye to superficial swiping. Register in seconds and let our 50-dimension compatibility engine find who truly aligns with you.
            </p>
          </div>

          {/* Illustration with smooth framing */}
          <div className="relative my-6 rounded-2xl overflow-hidden shadow-xl border border-white/15 group">
            <img
              src="/images/auth-couple.jpg"
              alt="Happy romantic couple in love"
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                <span>Verified Match Chemistry</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Evaluated across 50 psychological dimensions, lifestyle synchronization, and genuine values.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 font-medium">
            <span>Safe & Verified</span>
            <span>Free Standard Access</span>
          </div>
        </div>

        {/* Right Side: Clean Glass Registration Form & OTP */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5 backdrop-blur-xl bg-[#0c0e17]/50">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 p-[1px] shadow-sm shadow-rose-500/30 mb-2 inline-flex">
              <div className="w-full h-full bg-[#0c0e17] rounded-[10px] flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-outfit tracking-tight">
              {step === 'register' ? 'Create SoulSync Account' : 'Verify Email OTP'}
            </h2>
            <p className="text-slate-300 text-xs">
              {step === 'register'
                ? 'Join thousands of authentic members matching today'
                : `Enter the 6-digit verification code sent to ${email}`}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && step === 'verify-otp' && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successInfo}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'register' ? (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    icon={<User className="w-4 h-4 text-slate-400" />}
                    className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Email Address (for verification OTP)
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-white/15 bg-[#0c0e17]/80 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500/60"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1">
                      Age
                    </label>
                    <Input
                      type="number"
                      min={18}
                      max={99}
                      required
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value, 10))}
                      icon={<Calendar className="w-4 h-4 text-slate-400" />}
                      className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    isLoading={isRegistering}
                    className="w-full gap-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30"
                  >
                    <UserCheck className="w-4 h-4" /> Send Email OTP & Continue
                  </Button>
                </div>
              </motion.form>
            ) : (
              /* STEP 2: INSERT 6-DIGIT OTP CODE */
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerifyOtpSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <Input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="text-center font-mono text-xl tracking-[0.4em] font-extrabold glass-input border-white/20 focus:border-rose-500 h-14 rounded-2xl"
                  />
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  isLoading={isVerifying}
                  className="w-full gap-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30 h-12"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify OTP & Create Account
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="w-full py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Registration Form
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
