import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#090A10] text-slate-100 selection:bg-rose-500/30 selection:text-rose-200 relative overflow-hidden">
      {/* =========================================================================
          STATIC (FIXED) ATMOSPHERIC BACKGROUND
          Fixed position so when the user scrolls down, the image stays static!
          ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/hero-dating.jpg"
          alt="SoulSync Partner Matching Background"
          className="w-full h-full object-cover object-top"
        />
        {/* Dark atmospheric overlays to enhance contrast and glassmorphic card reflections */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090A10]/35 to-[#090A10]/85" />
      </div>

      {/* Global Glassmorphic Navigation Bar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className={`relative z-10 flex-grow w-full ${isLandingPage ? 'p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>

      {/* Global Glassmorphic Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};
