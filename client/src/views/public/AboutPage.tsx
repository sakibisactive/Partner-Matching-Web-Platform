import React from 'react';
import { Cpu, Layers, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6 px-4 sm:px-6">
      {/* Overview Banner with Algorithm Artwork */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl glass-container p-8 sm:p-12 space-y-8 shadow-2xl shadow-rose-500/10 border border-white/20"
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
            <span>System Architecture & 5D Matching</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-outfit tracking-tight leading-[1.15]">
            The Science of Human <span className="text-gradient-rose">Compatibility</span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            SoulSync was engineered to eliminate superficial swipe dating. Our proprietary algorithm evaluates deep psychological temperaments, hobby set intersections, daily lifestyle habits, and spatial proximity to match partners with genuine lifelong chemistry.
          </p>
        </div>

        {/* Algorithm Chemistry Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
          <img
            src="/images/algorithm-5d.jpg"
            alt="Two minds and hearts connecting in high dimensional vector space"
            className="w-full h-auto max-h-[420px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-rose-300">5-Dimensional Neural Mapping</p>
              <p className="text-[11px] text-slate-300">Vector Cosine Similarity • Jaccard Index • Lifestyle Rhythm</p>
            </div>
            <Link to="/register">
              <button className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/30 transition-all">
                Test Your Compatibility
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Grid of details in glass cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="rounded-3xl glass-container p-6 sm:p-8 space-y-4 border border-white/20"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 p-[1px] shadow-sm shadow-rose-500/30 mb-2 inline-flex">
            <div className="w-full h-full bg-[#0c0e17] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white font-outfit">5D Mathematical Formula</h2>
          <p className="text-xs text-slate-300">
            Every match score is computed in real-time across 5 weighted dimensions:
          </p>
          <div className="space-y-2.5 text-xs text-slate-200 pt-2">
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span>Personality Vector Cosine Similarity</span>
              <span className="font-bold text-rose-400">35%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span>World Hobbies Jaccard Index</span>
              <span className="font-bold text-amber-400">25%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span>Lifestyle & Habits Alignment</span>
              <span className="font-bold text-emerald-400">20%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span>Age Difference Decay Penalty</span>
              <span className="font-bold text-indigo-400">10%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span>Haversine Geographic Distance</span>
              <span className="font-bold text-sky-400">10%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="rounded-3xl glass-container p-6 sm:p-8 space-y-4 border border-white/20"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 inline-flex">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-outfit">Next-Gen Production Stack</h2>
          <p className="text-xs text-slate-300">
            Architected for enterprise speed, security, and cloud scalability:
          </p>
          <div className="space-y-2.5 text-xs text-slate-200 pt-2">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="font-semibold text-white">Frontend:</span> React 19, Vite / Next.js, Redux Toolkit, RTK Query, TailwindCSS, Framer Motion.
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="font-semibold text-white">Database:</span> Supabase PostgreSQL with Prisma ORM and pooled SSL connections.
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="font-semibold text-white">Real-Time Messaging:</span> Socket.IO with verified JWT authentication & room broadcasting.
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="font-semibold text-white">Security & Auth:</span> 2-Step Cryptographic OTP, timing-safe equality, rate limiting, and NoSQL/SQL defense.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        className="rounded-3xl glass-container p-8 sm:p-10 text-center space-y-4 border border-white/20"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
          Ready to Experience Authentic Partner Matching?
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          Complete your 50 personality questions and let our algorithm discover your highest compatibility candidates today.
        </p>
        <div className="pt-2">
          <Link to="/register">
            <button className="h-11 px-8 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-500/30 transition-all active:scale-95 inline-flex items-center gap-2">
              Start Free Matching <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
