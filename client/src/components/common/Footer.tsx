import React from 'react';
import { Heart, Github, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#090A10]/90 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </div>
              <span className="font-bold text-white text-base tracking-tight font-outfit">
                Soul<span className="text-rose-500">Sync</span>
              </span>
            </div>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span className="text-slate-500 text-xs">© 2026 5D Algorithmic Partner Matching Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>5D Engine Online</span>
            </div>

            <Link to="/about" className="hover:text-rose-400 transition-colors flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Algorithm Details
            </Link>

            <a
              href="https://github.com/sakibisactive/Partner-Matching-Web-Platform"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <Github className="w-3.5 h-3.5" /> Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
