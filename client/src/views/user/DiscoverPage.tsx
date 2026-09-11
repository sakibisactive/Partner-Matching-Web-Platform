import React, { useState } from 'react';
import { useDiscoverUsersQuery, useLikeUserMutation, useSaveUserMutation } from '../../redux/services/matchApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Sparkles, Filter, MapPin, Briefcase, GraduationCap, CheckCircle2, ChevronRight, UserX } from 'lucide-react';
import { ProfileCompletionBar } from '../../components/profile/ProfileCompletionBar';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const DiscoverPage: React.FC = () => {
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(50);
  const [gender, setGender] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('compatibility');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const { data, isLoading, refetch } = useDiscoverUsersQuery({
    minAge,
    maxAge,
    gender: gender || undefined,
    sortBy,
  });

  const [likeUser] = useLikeUserMutation();
  const [saveUser] = useSaveUserMutation();

  const handleLike = async (receiverId: string, name: string) => {
    try {
      const res = await likeUser(receiverId).unwrap();
      setActiveNotification(
        res.isMutualMatch
          ? `🎉 It's a Mutual Match with ${name}!`
          : `💖 Liked ${name}'s profile!`
      );
      setTimeout(() => setActiveNotification(null), 3000);
      refetch();
    } catch (e) {}
  };

  const handleSave = async (targetUserId: string, name: string) => {
    try {
      await saveUser(targetUserId).unwrap();
      setActiveNotification(`📌 Saved ${name} to bookmarks`);
      setTimeout(() => setActiveNotification(null), 3000);
    } catch (e) {}
  };

  const isProfileComplete = data?.isProfileComplete ?? true;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl glass-container border border-rose-500/40 text-white font-semibold text-xs shadow-2xl shadow-rose-500/20 flex items-center gap-2.5 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Filter Controls in Glass Container */}
      <div className="flex flex-col gap-4 rounded-3xl glass-container p-6 sm:p-8 shadow-2xl border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">
                Discover Matches
              </h1>
              <Badge variant="rose" dot>5D Live Feed</Badge>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 font-medium">
              Curated candidates ranked by 5-dimensional compatibility algorithms.
            </p>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-[#0c0e17]/80 px-3.5 py-2 rounded-xl border border-white/15 text-xs">
              <Filter className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-300 font-medium">Gender:</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer"
              >
                <option value="" className="bg-[#10131D]">All Genders</option>
                <option value="Female" className="bg-[#10131D]">Female</option>
                <option value="Male" className="bg-[#10131D]">Male</option>
                <option value="Non-binary" className="bg-[#10131D]">Non-binary</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#0c0e17]/80 px-3.5 py-2 rounded-xl border border-white/15 text-xs">
              <span className="text-slate-300 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer"
              >
                <option value="compatibility" className="bg-[#10131D]">Compatibility Score</option>
                <option value="newest" className="bg-[#10131D]">Newest First</option>
                <option value="distance" className="bg-[#10131D]">Nearest Distance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mr-1">Quick Filters:</span>
          <button
            onClick={() => { setGender(''); setSortBy('compatibility'); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              gender === '' && sortBy === 'compatibility'
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-sm'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:text-white'
            }`}
          >
            All Candidates
          </button>
          <button
            onClick={() => setSortBy('compatibility')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              sortBy === 'compatibility'
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-sm'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:text-white'
            }`}
          >
            Highest Match
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              sortBy === 'newest'
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-sm'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:text-white'
            }`}
          >
            New Arrivals
          </button>
        </div>
      </div>

      {/* MANDATORY 100% PROFILE COMPLETION LOCK SCREEN */}
      {!isLoading && !isProfileComplete ? (
        <div className="space-y-6">
          <ProfileCompletionBar
            percentage={data?.completionPercentage || 0}
            missingSections={data?.missingSections || []}
          />
          <div className="rounded-3xl glass-container p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto shadow-2xl border border-white/20">
            <div className="relative w-44 h-44 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="/images/unlock-profile.jpg"
                alt="Heart lock opening with golden key and sparks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-outfit">Unlock Candidate Profiles</h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Without selecting your global hobbies, daily lifestyle rhythm, and 50 psychological questions, our 5D algorithm cannot calculate authentic compatibility scores. Complete your profile to reveal matches!
              </p>
            </div>

            <div>
              <Link to="/edit-profile">
                <Button variant="glow" size="lg" className="gap-2 text-xs font-bold rounded-full px-8 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30">
                  Complete My Profile Now <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-300 text-xs font-medium">Calculating multi-dimensional compatibility vectors...</p>
        </div>
      ) : data?.users?.length === 0 ? (
        <div className="rounded-3xl glass-container p-12 text-center max-w-md mx-auto space-y-3 border border-white/20">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
            <UserX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-outfit">No Profiles Found</h3>
          <p className="text-slate-300 text-xs">Try relaxing your search age or gender filters to see more people.</p>
        </div>
      ) : (
        /* Candidates Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.users?.map((item: any) => (
            <motion.div
              key={item.candidateId}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-container-card shadow-2xl border border-white/20 transition-all"
            >
              {/* Photo Banner with Gradient Scrim */}
              <div className="relative h-72 overflow-hidden bg-slate-900">
                <img
                  src={
                    item.profile.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={item.user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/40 to-transparent" />

                {/* Dual Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md">
                    {item.compatibilityScore >= 90 ? 'Top Match' : 'Recommended'}
                  </span>
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>{item.compatibilityScore}% Match</span>
                  </div>
                </div>

                {/* Name, Age, Location */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-outfit">
                    {item.user.name}, {item.profile.age}
                    {item.user.isVerified && (
                      <span title="Verified Member">
                        <CheckCircle2 className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-200 text-xs flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {item.profile.location || 'Global Headquarters'}
                  </p>
                </div>
              </div>

              {/* Bio & Attributes */}
              <div className="p-5 space-y-3.5 flex-grow backdrop-blur-md bg-[#0c0e17]/30">
                <p className="text-slate-200 text-xs line-clamp-2 leading-relaxed italic font-medium">
                  "{item.profile.bio || 'Passionate about authentic conversations, active living, and intellectual growth.'}"
                </p>

                {/* Meta Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-200">
                  {item.profile.occupation && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1 font-medium">
                      <Briefcase className="w-3 h-3 text-rose-400" /> {item.profile.occupation}
                    </span>
                  )}
                  {item.profile.gender && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1 font-medium">
                      <GraduationCap className="w-3 h-3 text-rose-400" /> {item.profile.gender}
                    </span>
                  )}
                </div>

                {/* Interests Chips */}
                {Array.isArray(item.profile.interests) && item.profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.profile.interests.slice(0, 3).map((interest: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-semibold"
                      >
                        #{typeof interest === 'string' ? interest : interest.name || 'Hobby'}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="p-4 pt-3 flex items-center justify-between gap-2.5 border-t border-white/10 backdrop-blur-md bg-[#0c0e17]/40">
                <button
                  onClick={() => handleSave(item.candidateId, item.user.name)}
                  className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-all"
                  title="Save to bookmarks"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <Button
                  onClick={() => handleLike(item.candidateId, item.user.name)}
                  variant="glow"
                  className="flex-1 py-2 text-xs font-bold gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30"
                >
                  <Heart className="w-4 h-4 fill-white" /> Connect
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
