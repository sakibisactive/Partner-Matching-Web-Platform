import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { Heart, Compass, Sparkles, Bookmark, MessageSquare, Shield, LogOut, Crown } from 'lucide-react';
import { SubscriptionModal } from '../profile/SubscriptionModal';
import { Avatar } from '../ui/avatar';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSubscription, setShowSubscription] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === '/';

  const logoTarget = !isAuthenticated
    ? '/'
    : user?.role === 'Admin'
    ? '/admin'
    : '/discover';

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090A10]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to={logoTarget} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 p-[1px] shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0c0e17] rounded-[11px] flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-outfit">
                Soul<span className="text-rose-500">Sync</span>
              </span>
            </Link>

            {/* Navigation Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {user?.role !== 'Admin' && (
                  <>
                    <Link
                      to="/discover"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive('/discover')
                          ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden md:inline">Discover</span>
                    </Link>

                    <Link
                      to="/matches"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive('/matches')
                          ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden md:inline">Top Matches</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/likes"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive('/likes')
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden md:inline">Saved</span>
                </Link>

                <Link
                  to="/chat"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive('/chat')
                      ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden md:inline">Chat</span>
                </Link>

                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive('/admin')
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}

                {/* VIP Upgrade Checkout Trigger */}
                {user?.role !== 'Admin' && (
                  <button
                    onClick={() => setShowSubscription(true)}
                    className="ml-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                    <span className="hidden sm:inline">VIP</span>
                  </button>
                )}

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 ml-1 border-l border-white/[0.08]"
                >
                  <Avatar
                    fallback={user?.name || 'User'}
                    size="sm"
                    className="border border-white/20 hover:border-rose-500/50 transition-colors"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <nav className="hidden md:flex items-center gap-1 border-r border-white/[0.08] pr-4 mr-2">
                  <Link
                    to="/about"
                    className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                  >
                    5D Algorithm
                  </Link>
                </nav>

                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="h-8 px-3.5 rounded-md bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 flex items-center justify-center text-xs font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}
    </>
  );
};
