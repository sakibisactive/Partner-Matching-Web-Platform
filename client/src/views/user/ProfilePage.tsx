import React, { useState } from 'react';
import { useGetMeQuery } from '../../redux/services/authApi';
import { useDeleteMyAccountMutation } from '../../redux/services/profileApi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import {
  Heart,
  Edit3,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Facebook,
  Instagram,
  MessageCircle,
  PhoneCall,
  Crown,
  Trash2,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: meData, isLoading } = useGetMeQuery({});
  const [deleteMyAccount, { isLoading: isDeleting }] = useDeleteMyAccountMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    if (user?.role === 'Admin') {
      setDeleteError('Admin accounts cannot be self-deleted to maintain platform administration.');
      return;
    }

    try {
      await deleteMyAccount().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err: any) {
      setDeleteError(err?.data?.message || 'Failed to delete account.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-medium">Loading your profile...</p>
      </div>
    );
  }

  const profile = meData?.profile;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="rounded-3xl glass-container border border-white/20 p-8 relative overflow-hidden space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={
                profile?.photos?.[0]?.url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
              }
              alt={user?.name}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
            />
            {user?.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-rose-500/50 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              </span>
            )}
          </div>

          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">{user?.name}</h1>
              {profile?.membershipTier && profile.membershipTier !== 'Free' ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-lg shadow-amber-500/10">
                  <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {profile.membershipTier} Member
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-semibold">
                  Standard Member
                </span>
              )}
            </div>

            <p className="text-slate-300 text-xs flex items-center justify-center sm:justify-start gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {profile?.city || 'City'}, {profile?.country || 'Country'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-200 pt-1">
              {profile?.occupation && (
                <span className="px-3 py-1 rounded-xl glass-container-card border border-white/15 flex items-center gap-1.5 shadow-sm">
                  <Briefcase className="w-3.5 h-3.5 text-rose-300" /> {profile.occupation}
                </span>
              )}
              {profile?.education && (
                <span className="px-3 py-1 rounded-xl glass-container-card border border-white/15 flex items-center gap-1.5 shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-rose-300" /> {profile.education}
                </span>
              )}
            </div>
          </div>

          <Link to="/edit-profile">
            <Button className="gap-2 text-xs font-semibold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25 border border-rose-400/30">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          </Link>
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-white/10">
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block mb-1">About Me</span>
          <p className="text-slate-200 text-sm italic leading-relaxed">
            "{profile?.bio || 'No bio written yet. Click Edit Profile to share your story and lifestyle!'}"
          </p>
        </div>

        {/* Social Media Links */}
        {profile?.socialLinks && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Connected Handles</span>
            <div className="flex flex-wrap gap-2">
              {profile.socialLinks.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-400/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-600/30 transition-all shadow-sm"
                >
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              {profile.socialLinks.instagram && (
                <span className="px-3.5 py-1.5 rounded-xl bg-pink-600/20 text-pink-300 border border-pink-400/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Instagram className="w-3.5 h-3.5" /> Instagram: {profile.socialLinks.instagram}
                </span>
              )}
              {profile.socialLinks.snapchat && (
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <MessageCircle className="w-3.5 h-3.5" /> Snapchat: {profile.socialLinks.snapchat}
                </span>
              )}
              {profile.socialLinks.whatsapp && (
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <PhoneCall className="w-3.5 h-3.5" /> WhatsApp: {profile.socialLinks.whatsapp}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Selected Hobbies */}
        {profile?.interests?.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Selected Hobbies & Passions</span>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((item: any) => (
                <span
                  key={item._id || item.id || item.name}
                  className="px-3.5 py-1.5 rounded-full glass-container-card text-rose-200 border border-rose-400/20 text-xs font-medium shadow-sm"
                >
                  #{item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone: Account Deletion */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Account Security</span>
            <p className="text-[11px] text-slate-400">
              {user?.role === 'Admin'
                ? 'Master Admin accounts are protected against self-deletion.'
                : 'Permanently delete your account and remove all profile data.'}
            </p>
          </div>

          {user?.role !== 'Admin' && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:border-red-500/50"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          )}
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="rounded-3xl border border-red-500/30 glass-container p-8 max-w-md w-full relative space-y-6 shadow-2xl backdrop-blur-2xl"
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 mx-auto flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white font-outfit">Permanently Delete Account?</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This action is irreversible. All your compatibility calculations, conversations, bookmarks, and photos will be permanently wiped.
                </p>
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold text-center">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-1/2 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/15"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  isLoading={isDeleting}
                  onClick={handleDeleteAccount}
                  className="w-1/2 text-xs gap-1.5 shadow-lg shadow-red-500/25"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
