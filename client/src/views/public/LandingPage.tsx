import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Zap,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  Compass,
  Briefcase,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const LandingPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Quick Match Finder form state
  const [quickForm, setQuickForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female',
    age: '24',
    city: 'New York',
    email: ''
  });

  // If user is already logged in, redirect directly to their main dashboard
  if (isAuthenticated && user) {
    if (user.role === 'Admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/discover" replace />;
  }

  const handleQuickFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="relative min-h-screen pb-28">
      {/* =========================================================================
          STATIC (FIXED) BACKGROUND: First Image Generated (/images/hero-dating.jpg)
          Fixed position so when the user scrolls down, the image stays static and doesn't move!
          ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/hero-dating.jpg"
          alt="SoulSync Partner Matching Background"
          className="w-full h-full object-cover object-top"
        />
        {/* Atmospheric overlay: keeps illustration vibrant and lets light filter through glassmorphic cards */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090A10]/20 to-[#090A10]/65" />
      </div>

      {/* Main Content Layer (Above the fixed static background) */}
      <div className="relative z-10">
        {/* =========================================================================
            1. HERO SECTION (Title, Subhead, Description & CTAs in Glass Container)
            ========================================================================= */}
        <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
          <div className="w-full max-w-5xl mx-auto">
            <div className="rounded-3xl glass-container p-8 sm:p-12 lg:p-14 text-center space-y-6">
              {/* SoulSync Brand Mark */}
              <div className="flex items-center justify-center gap-2 pb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 p-[1px] shadow-sm shadow-rose-500/30">
                  <div className="w-full h-full bg-[#0c0e17] rounded-[10px] flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </div>
                </div>
                <span className="text-lg font-extrabold tracking-tight text-white font-outfit">
                  Soul<span className="text-rose-500">Sync</span>
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="space-y-1.5"
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.14] font-outfit drop-shadow-xl">
                  Find Your Perfect Match
                </h1>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-gradient-rose tracking-tight drop-shadow-md">
                  Join Hearts Today
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="text-slate-200 text-sm sm:text-base lg:text-lg sm:leading-relaxed max-w-2xl mx-auto font-medium"
              >
                Move past superficial swipes. Connect with authentic verified singles evaluated across 50 psychological dimensions, lifestyle synchronization, and genuine chemistry.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
              >
                <Link to="/register">
                  <button className="h-11 px-8 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-rose-500/35 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                    Start Free Matching <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/about">
                  <button className="h-11 px-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-100 border border-white/20 font-semibold text-sm backdrop-blur-md transition-all active:scale-95 shadow-lg">
                    Explore 5D Algorithm
                  </button>
                </Link>
              </motion.div>

              <div className="pt-2 text-xs text-slate-400">
                Already a member?{' '}
                <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Container for subsequent sections */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-32 sm:space-y-40 pb-24">


      {/* =========================================================================
          2. ABOUT OUR APP SYSTEM (HOUSED IN MODERN FROSTED GLASS CONTAINERS)
          ========================================================================= */}
      <section className="w-full text-center space-y-12">
        <div className="max-w-3xl lg:max-w-4xl mx-auto rounded-3xl glass-container p-8 sm:p-10 space-y-3">
          <Badge variant="rose" dot>Core System</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
            About Our Matching System
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Are you looking for an authentic, lifelong connection? SoulSync provides an intelligent, discreet space where you can meet your genuine soulmate.
          </p>
        </div>

        {/* 3 FROSTED GLASS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
          {/* Column 1: Single Women */}
          <div className="rounded-2xl glass-container-card p-6 sm:p-8 space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shadow-inner shadow-rose-500/20">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white font-outfit">
              Single Women
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed">
              Thousands of ambitious, intelligent women are waiting for true connection. Verified photos, verified profiles, and authentic intentions.
            </p>
          </div>

          {/* Column 2: Connecting Singles */}
          <div className="rounded-2xl glass-container-card p-6 sm:p-8 space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-inner shadow-amber-500/20">
              <Heart className="w-7 h-7 fill-amber-400/30" />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white font-outfit">
              We Connect Soulmates
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed">
              Our 5D vector engine evaluates 50 psychological dimensions, shared hobbies, and lifestyle synchronization to find your true soulmate.
            </p>
          </div>

          {/* Column 3: Single Men */}
          <div className="rounded-2xl glass-container-card p-6 sm:p-8 space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shadow-inner shadow-sky-500/20">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white font-outfit">
              Single Men
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed">
              Connect with thousands of respectful, accomplished men ready for serious partnership. Real pictures, active verified chat, and mutual chemistry.
            </p>
          </div>
        </div>
      </section>


      {/* =========================================================================
          3. SPECIAL FEATURES OF OUR APP (SPLIT SECTION WITH FROSTED GLASS CARD)
          ========================================================================= */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Side: Illustration (feature-couple.jpg) */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/10 border border-white/15 group">
              <img
                src="/images/feature-couple.jpg"
                alt="Happy couple standing beside giant smartphone showing 98% match"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Floating compatibility pill badge */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>98% Chemistry Match</span>
              </div>
            </div>
          </div>

          {/* Right Side: Features Description & Action Buttons inside Glass Container */}
          <div className="rounded-3xl glass-container p-6 sm:p-10 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Features</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
                Special Features of Our Algorithm
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                SoulSync was created to put an end to meaningless swiping. We have built an authentic, safe, and discreet ecosystem where candidates are matched on deep human compatibility factors that sustain lasting relationships.
              </p>
            </div>

            {/* Micro Feature Highlights */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-200 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong className="text-white">35% Personality Vector Cosine</strong> — 50 Likert-scale questions mapped into high-dimensional vector space.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong className="text-white">25% Global Hobbies Overlap</strong> — Mathematical Jaccard set intersection across 100+ interests.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong className="text-white">20% Lifestyle Synchronization</strong> — Smoking, drinking, exercise, diet, and pet preferences.</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Link to="/register">
                <button className="h-11 px-7 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs tracking-wide shadow-md shadow-rose-500/20 transition-all active:scale-95">
                  Get Started Free
                </button>
              </Link>
              <Link to="/about">
                <button className="h-11 px-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 font-semibold text-xs transition-all active:scale-95">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          4. CURATED MATCH CANDIDATES (FROSTED GLASS CONTAINER)
          ========================================================================= */}
      <section className="w-full space-y-10">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto rounded-3xl glass-container p-8 sm:p-10 space-y-3">
          <Badge variant="rose" dot>Live Feed</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
            Curated High-Compatibility Matches
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Meet verified members with 90%+ compatibility scores ready to connect today.
          </p>
        </div>

        {/* 3 Clean Candidate Cards with frosted glass styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Elena Vance',
              age: 26,
              occupation: 'Architectural Designer',
              city: 'New York, NY',
              score: 98,
              photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
              interests: ['Architecture', 'Espresso', 'Hiking']
            },
            {
              name: 'Julian Hayes',
              age: 28,
              occupation: 'Software Engineer',
              city: 'San Francisco, CA',
              score: 96,
              photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
              interests: ['Technology', 'Rock Climbing', 'Indie Music']
            },
            {
              name: 'Sophia Laurent',
              age: 25,
              occupation: 'Creative Director',
              city: 'Austin, TX',
              score: 94,
              photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
              interests: ['Modern Art', 'Photography', 'Travel']
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl glass-container-card"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden bg-slate-900">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A14] via-[#090A14]/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
                    Top Match
                  </span>
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3 text-rose-400 fill-rose-400" />
                    <span>{item.score}% Match</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 font-outfit">
                    {item.name}, {item.age}
                    <CheckCircle2 className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                  </h3>
                  <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {item.city}
                  </p>
                </div>
              </div>

              {/* Details & Interests */}
              <div className="p-5 space-y-4">
                <p className="text-slate-300 text-xs flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {item.occupation}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {item.interests.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/10 text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link to="/register">
                    <button className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-rose-500 text-slate-200 hover:text-white border border-white/10 hover:border-rose-500 text-xs font-bold flex items-center justify-center gap-2 transition-all">
                      <Heart className="w-3.5 h-3.5" /> Connect with {item.name.split(' ')[0]}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          5. REAL-TIME MOBILE CHEMISTRY (SPLIT SECTION WITH FROSTED GLASS CARD)
          ========================================================================= */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Side: Mobile Info Glass Container */}
          <div className="rounded-3xl glass-container p-6 sm:p-10 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Mobile Experience</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
              Access SoulSync Anytime, Anywhere
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Never miss a genuine moment. Our real-time encrypted messaging interface keeps you connected wherever you go. Instant compatibility breakdowns, online presence indicators, and discreet privacy controls.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Socket.IO real-time instant messaging with zero latency.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>Instant mutual match celebration notifications.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>End-to-end encrypted private chat rooms.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/register">
                <button className="h-11 px-8 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs tracking-wide shadow-md shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-2">
                  Join Free Today <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: Mockup Image (mobile-mockup.jpg) */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/10 border border-white/15 group">
              <img
                src="/images/mobile-mockup.jpg"
                alt="Modern smartphone showing dating app chat interface"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          6. CONNECTION STORIES & DATE INSPIRATIONS (FROSTED GLASS CONTAINER)
          ========================================================================= */}
      <section className="w-full space-y-10">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto rounded-3xl glass-container p-8 sm:p-10 space-y-3">
          <Badge variant="rose" dot>Dating Stories</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
            Meaningful Chemistry in Real Life
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Read inspiring stories from couples who found their lifelong partner through our 5D matching engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Story Card 1 */}
          <div className="group rounded-3xl overflow-hidden glass-container-card flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/images/story-sunset.jpg"
                alt="Romantic sunset beach walk"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A14] via-[#090A14]/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-md">
                  Success Story
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>97% Personality & Lifestyle Alignment</span>
              </div>
              <h3 className="text-xl font-bold text-white font-outfit leading-snug">
                Sunset Beach Walks: When Conversation Flows Effortlessly
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                "We matched on SoulSync based on shared travel passions and daily morning rhythms. Our first date was a sunset walk, and we’ve been inseparable ever since."
              </p>
              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-white/[0.08]">
                <span>Hannah & Liam • Married 1 year</span>
                <Link to="/register" className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1">
                  Read Story <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Story Card 2 */}
          <div className="group rounded-3xl overflow-hidden glass-container-card flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/images/story-cafe.jpg"
                alt="Romantic evening outdoor cafe date"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A14] via-[#090A14]/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md">
                  Date Night Ideas
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Art of Unhurried First Dates</span>
              </div>
              <h3 className="text-xl font-bold text-white font-outfit leading-snug">
                Cozy Outdoor Terraces: Why Low-Pressure Spaces Spark Deeper Connection
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Learn why high-compatibility partners choose ambient cafe terraces for first meetups to foster authentic eye contact and meaningful conversation.
              </p>
              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-white/[0.08]">
                <span>Editorial by Dr. Claire Hayes</span>
                <Link to="/register" className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1">
                  Explore Guide <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          7. QUICK MATCH FINDER / CONTACT FORM (FROSTED GLASS CONTAINER)
          ========================================================================= */}
      <section className="w-full pt-4">
        <div className="rounded-3xl glass-container p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left Side: Direct Contact Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="rose" dot>Get in Touch</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
                  Start Your Journey
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Have questions about our 5D psychological algorithm or need assistance with your profile setup? Our team is here to assist you 24/7.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200 pt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>One Sansome Street, San Francisco, CA & Global Community</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>support@soulsync.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>+1 (800) SOULSYNC</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-rose-500/40 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-rose-500/40 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-rose-500/40 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-rose-500/40 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Side: Clean Quick-Match Registration Form */}
            <form onSubmit={handleQuickFormSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={quickForm.firstName}
                    onChange={(e) => setQuickForm({ ...quickForm, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mercer"
                    value={quickForm.lastName}
                    onChange={(e) => setQuickForm({ ...quickForm, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Looking For</label>
                  <select
                    value={quickForm.gender}
                    onChange={(e) => setQuickForm({ ...quickForm, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-slate-900/80 text-sm text-white focus:outline-none focus:border-rose-500/60 transition-colors"
                  >
                    <option value="Female">Women</option>
                    <option value="Male">Men</option>
                    <option value="Non-binary">Everyone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Your Age</label>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    value={quickForm.age}
                    onChange={(e) => setQuickForm({ ...quickForm, age: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white focus:outline-none focus:border-rose-500/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. New York, London, Tokyo"
                  value={quickForm.city}
                  onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={quickForm.email}
                  onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  Find My Match Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      </div>
      </div>
    </div>
  );
};
