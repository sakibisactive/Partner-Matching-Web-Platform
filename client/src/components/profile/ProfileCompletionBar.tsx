import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ChevronRight, Sparkles, Sliders, ListChecks, Heart, Image } from 'lucide-react';

interface Props {
  percentage: number;
  missingSections: string[];
}

export const ProfileCompletionBar: React.FC<Props> = ({ percentage, missingSections }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white font-outfit">100% Profile Completion Required</h3>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            SoulSync's 5D algorithm requires your complete preferences, lifestyle choices, and 50 personality answers to compute accurate compatibility matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-rose-400">{percentage}%</span>
            <span className="text-[10px] text-slate-500 block">Complete</span>
          </div>
          <Link
            to="/edit-profile"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 hover:opacity-95"
          >
            Complete Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress Meter Bar */}
      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist of Missing Sections */}
      {missingSections.length > 0 && (
        <div className="pt-2 space-y-2 border-t border-slate-800/80">
          <span className="text-xs font-bold text-slate-300 block">Remaining Items Needed for 100%:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {missingSections.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-rose-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
