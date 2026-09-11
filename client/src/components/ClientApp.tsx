'use client';

import React, { useEffect, useState } from 'react';
import App from '../App';

export const ClientApp: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090814] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-cyan-400 p-0.5 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-pink-500 font-bold">
              💖
            </div>
          </div>
          <span className="text-slate-400 text-sm font-medium tracking-wide">Loading SoulSync...</span>
        </div>
      </div>
    );
  }

  return <App />;
};
