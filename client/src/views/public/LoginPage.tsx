import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useLoginMutation } from '../../redux/services/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { Heart, Mail, Lock, LogIn, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.accessToken }));
      if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/discover');
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Failed to sign in. Please check credentials.');
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
        {/* Left Side: Romantic Couple Illustration & Testimonial */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-rose-950/30 via-[#10131D]/50 to-[#0c0e17]/80 backdrop-blur-md overflow-hidden border-r border-white/10">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
              <span>SoulSync Community</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white font-outfit">
              Real Love, Backed by Science.
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
              Connect with partners who match your temperament, communication rhythm, and life ambitions.
            </p>
          </div>

          {/* Illustration with smooth framing */}
          <div className="relative my-6 rounded-2xl overflow-hidden shadow-xl border border-white/15 group">
            <img
              src="/images/auth-couple.jpg"
              alt="Happy couple embracing in romantic warm lighting"
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-[11px] font-medium italic leading-tight">
                "We matched with a 97% compatibility score. It felt natural from day one!"
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-rose-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-rose-400 fill-rose-400/20" />
                <span>Maya & Marcus • Together 2 years</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 font-medium">
            <span>50 Dimensions Evaluated</span>
            <span>100% Verified Profiles</span>
          </div>
        </div>

        {/* Right Side: Clean Glass Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6 backdrop-blur-xl bg-[#0c0e17]/50">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 p-[1px] shadow-sm shadow-rose-500/30 mb-2 inline-flex">
              <div className="w-full h-full bg-[#0c0e17] rounded-[10px] flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Sign in to view your newest compatible matches and messages.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                className="glass-input border-white/15 focus:border-rose-500 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isLoading}
                className="w-full gap-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30"
              >
                <LogIn className="w-4 h-4" /> Sign In to SoulSync
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-300 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
              Create a free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
