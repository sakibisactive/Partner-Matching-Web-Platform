import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface Props {
  percentage: number;
  missingSections: string[];
}

export const ProfileCompletionBar: React.FC<Props> = ({ percentage, missingSections }) => {
  return (
    <div className="rounded-3xl border border-rose-500/20 bg-[#10131D]/90 backdrop-blur-xl p-6 space-y-4 shadow-xl shadow-black/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-outfit">
              100% Profile Completion Required
            </h3>
          </div>
          <p className="text-slate-400 text-xs mt-1 max-w-xl leading-relaxed">
            SoulSync's 5D algorithm requires your complete preferences, lifestyle rhythm, and 50 psychological answers to compute accurate compatibility matches.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl font-black text-rose-400 font-outfit">{percentage}%</span>
            <span className="text-[10px] text-slate-400 block font-medium">Completed</span>
          </div>
          <Link to="/edit-profile">
            <Button variant="glow" size="default" className="text-xs font-bold gap-1.5">
              Complete Now <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Meter Bar */}
      <Progress value={percentage} indicatorClassName="bg-rose-500" />

      {/* Checklist of Missing Sections */}
      {missingSections.length > 0 && (
        <div className="pt-2 space-y-2 border-t border-white/[0.04]">
          <span className="text-xs font-semibold text-slate-300 block">Remaining Sections for 100%:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {missingSections.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
