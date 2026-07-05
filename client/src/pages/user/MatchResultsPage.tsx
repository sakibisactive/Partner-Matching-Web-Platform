import React from 'react';
import { useGetMatchesQuery, useLikeUserMutation } from '../../redux/services/matchApi';
import { Sparkles, Heart, CheckCircle2, MapPin, Briefcase, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfileCompletionBar } from '../../components/profile/ProfileCompletionBar';
import { Link } from 'react-router-dom';

export const MatchResultsPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetMatchesQuery({});
  const [likeUser] = useLikeUserMutation();

  const handleLike = async (id: string) => {
    try {
      await likeUser(id).unwrap();
      refetch();
    } catch (e) {}
  };

  const isProfileComplete = data?.isProfileComplete ?? true;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-outfit flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-rose-400" /> Top Compatible Matches
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Engineered using vector cosine similarity, Jaccard interest overlap, lifestyle alignment, and Haversine geo-distance.
          </p>
        </div>
      </div>

      {/* MANDATORY 100% PROFILE COMPLETION LOCK SCREEN */}
      {!isLoading && !isProfileComplete ? (
        <div className="space-y-6">
          <ProfileCompletionBar
            percentage={data?.completionPercentage || 0}
            missingSections={data?.missingSections || []}
          />
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-400">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white font-outfit">Top Matches Locked</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Without selecting your hobbies, lifestyle choices, and 50 personality answers, the algorithm cannot calculate accurate compatibility scores with other users. Reach 100% completion to unlock candidate profiles!
            </p>
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-amber-500 text-white font-bold text-sm shadow-xl"
            >
              Complete My Profile Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : isLoading ? (
        <div className="py-20 text-center text-slate-400">Computing 5D compatibility matrices...</div>
      ) : data?.matches?.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 max-w-md mx-auto">
          <p className="text-slate-400 text-sm">No matches found matching your current preference filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.matches?.map((match: any) => (
            <motion.div
              key={match.candidateId}
              whileHover={{ y: -5 }}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-xl"
            >
              {/* Photo & Badge */}
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img
                  src={
                    match.profile.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={match.user.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-rose-500/40 text-rose-400 text-xs font-black">
                  {match.compatibilityScore}% Compatibility
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {match.user.name}, {match.profile.age}
                    {match.user.isVerified && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </h3>
                  <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {match.profile.city || 'City'}, {match.profile.country || 'Country'}
                  </p>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Personality Vector Cosine:</span>
                    <span className="font-bold text-indigo-400">{match.breakdown.personality}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>World Hobbies Overlap:</span>
                    <span className="font-bold text-amber-400">{match.breakdown.interest}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Lifestyle Alignment:</span>
                    <span className="font-bold text-emerald-400">{match.breakdown.lifestyle}%</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLike(match.candidateId)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart className="w-4 h-4 fill-white" /> Send Match Request
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
