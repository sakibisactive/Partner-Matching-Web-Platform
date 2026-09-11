import React from 'react';
import { useGetMyLikesQuery } from '../../redux/services/matchApi';
import { Bookmark, Heart, MessageSquare, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';

export const LikesPage: React.FC = () => {
  const { data, isLoading } = useGetMyLikesQuery({});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
            Saved & Liked Profiles
          </h1>
          <Badge variant="rose" dot>Bookmarks</Badge>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Profiles and mutual connections you bookmarked or liked during discovery.
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium">Loading saved profiles...</p>
        </div>
      ) : data?.likesGiven?.length === 0 ? (
        <div className="rounded-3xl glass-container border border-white/20 p-12 text-center max-w-md mx-auto space-y-3 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-rose-300 shadow-md">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">No Saved Profiles Yet</h3>
          <p className="text-slate-300 text-xs">When you like or bookmark candidates in Discover, they'll appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.likesGiven?.map((item: any) => (
            <div
              key={item._id || item.id}
              className="rounded-3xl glass-container-card border border-white/20 p-6 shadow-xl flex items-center justify-between gap-4 hover:border-rose-400/40 transition-all backdrop-blur-xl"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar
                  fallback={item.receiver?.name || 'User'}
                  size="lg"
                  className="border border-white/20"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white font-outfit truncate">
                    {item.receiver?.name || 'User'}
                  </h3>
                  <p className="text-xs text-slate-300 truncate flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Member</span>
                  </p>
                  <div className="mt-2">
                    {item.isSaved ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-semibold">
                        📌 Saved Bookmark
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-200 text-[11px] font-semibold">
                        💖 Liked Profile
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link to="/chat">
                <Button size="sm" className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md shadow-rose-500/20 border border-rose-400/30">
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
