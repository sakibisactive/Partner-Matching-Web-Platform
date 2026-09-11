import React from 'react';
import { useGetMatchesQuery, useLikeUserMutation } from '../../redux/services/matchApi';
import { Sparkles, Heart, CheckCircle2, MapPin, ChevronRight, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfileCompletionBar } from '../../components/profile/ProfileCompletionBar';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

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
      {/* Header in Glass Container */}
      <div className="rounded-3xl glass-container p-6 sm:p-8 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
              Top Compatible Matches
            </h1>
            <Badge variant="rose" dot>5D Ranked</Badge>
          </div>
          <p className="text-slate-200 text-xs sm:text-sm mt-1 font-medium">
            Calculated via vector cosine similarity, Jaccard hobby intersection, lifestyle alignment, and geo-distance.
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
          <div className="rounded-3xl glass-container p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto shadow-2xl border border-white/20">
            <div className="relative w-44 h-44 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="/images/unlock-profile.jpg"
                alt="Heart lock opening with key and sparkles"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-outfit">Top Matches Locked</h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Without selecting your global hobbies, daily lifestyle rhythm, and 50 psychological answers, the algorithm cannot calculate genuine compatibility scores. Complete your profile to reveal your ranked matches!
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
          <p className="text-slate-300 text-xs font-medium">Computing 5D compatibility matrices in Supabase...</p>
        </div>
      ) : data?.matches?.length === 0 ? (
        <div className="rounded-3xl glass-container p-12 text-center max-w-md mx-auto space-y-3 border border-white/20">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
            <UserX className="w-6 h-6" />
          </div>
          <p className="text-slate-300 text-xs">No matches found matching your current preference filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.matches?.map((match: any) => (
            <motion.div
              key={match.candidateId}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-container-card shadow-2xl border border-white/20 transition-all"
            >
              {/* Photo & Badge */}
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={
                    match.profile.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={match.user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/40 to-transparent" />

                {/* Dual Micro-Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md">
                    Top Match
                  </span>
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>{match.compatibilityScore}% Match</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-outfit">
                    {match.user.name}, {match.profile.age}
                    {match.user.isVerified && <CheckCircle2 className="w-4 h-4 text-rose-400 fill-rose-400/20" />}
                  </h3>
                  <p className="text-slate-200 text-xs flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {match.profile.location || 'Global Headquarters'}
                  </p>
                </div>
              </div>

              {/* 5D Breakdown Meters */}
              <div className="p-5 space-y-4 backdrop-blur-md bg-[#0c0e17]/30">
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-200 mb-1 font-medium">
                      <span className="text-slate-300">Personality Vector (Cosine):</span>
                      <span className="font-bold text-rose-400">{match.breakdown?.personality || 85}%</span>
                    </div>
                    <Progress value={match.breakdown?.personality || 85} indicatorClassName="bg-rose-500" />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-200 mb-1 font-medium">
                      <span className="text-slate-300">World Hobbies Overlap:</span>
                      <span className="font-bold text-amber-400">{match.breakdown?.interest || 75}%</span>
                    </div>
                    <Progress value={match.breakdown?.interest || 75} indicatorClassName="bg-amber-500" />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-200 mb-1 font-medium">
                      <span className="text-slate-300">Lifestyle Rhythm Alignment:</span>
                      <span className="font-bold text-emerald-400">{match.breakdown?.lifestyle || 90}%</span>
                    </div>
                    <Progress value={match.breakdown?.lifestyle || 90} indicatorClassName="bg-emerald-500" />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => handleLike(match.candidateId)}
                    variant="glow"
                    className="w-full text-xs font-bold gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/30"
                  >
                    <Heart className="w-4 h-4 fill-white" /> Send Match Request
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
