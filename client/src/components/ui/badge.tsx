import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'rose' | 'emerald' | 'amber' | 'glow';
  dot?: boolean;
}

function Badge({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    secondary: "bg-slate-800/80 text-slate-300 border-slate-700/50",
    destructive: "bg-red-500/10 text-red-300 border-red-500/20",
    outline: "border-white/10 text-slate-300 bg-white/[0.02]",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    glow: "bg-rose-500/20 text-white border-rose-400/40 shadow-sm shadow-rose-500/20",
  };

  const dotColors = {
    default: "bg-rose-400",
    secondary: "bg-slate-400",
    destructive: "bg-red-400",
    outline: "bg-slate-400",
    rose: "bg-rose-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    glow: "bg-rose-300 animate-pulse",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </div>
  );
}

export { Badge };
