import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const BentoGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
  children,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#10131D]/90 p-8 shadow-xl shadow-black/30 backdrop-blur-xl hover:border-rose-500/30 transition-colors",
        className
      )}
    >
      {/* Top ambient illumination on hover */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header / Graphic Slot */}
      {header && <div className="mb-6 w-full">{header}</div>}

      {/* Content Slot if provided */}
      {children}

      <div className="relative z-10 mt-auto space-y-2">
        <div className="flex items-center justify-between gap-2">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white font-outfit tracking-tight pt-2">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
