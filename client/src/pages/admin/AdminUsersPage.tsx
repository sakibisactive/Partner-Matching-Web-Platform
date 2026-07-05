import React, { useState } from 'react';
import {
  useGetAllUsersQuery,
  useGetUserFullDetailsQuery,
  useBanUserMutation,
  useVerifyUserMutation,
  useDeleteUserMutation,
} from '../../redux/services/adminApi';
import { Shield, CheckCircle2, UserX, Trash2, Eye, X, Facebook, Instagram, MessageCircle, PhoneCall, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUsersPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: detailData } = useGetUserFullDetailsQuery(selectedUserId, {
    skip: !selectedUserId,
  });

  const [banUser] = useBanUserMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleBan = async (id: string) => {
    try {
      await banUser(id).unwrap();
      refetch();
    } catch (e) {}
  };

  const handleVerify = async (id: string) => {
    try {
      await verifyUser(id).unwrap();
      refetch();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently remove/delete this member?')) {
      try {
        await deleteUser(id).unwrap();
        if (selectedUserId === id) setSelectedUserId(null);
        refetch();
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-outfit">SoulSync Member Management</h1>
          <p className="text-xs text-slate-400">Inspect all member profiles, watch full info & social links, grant verified badges, or remove users.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading member database...</div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                  <th className="p-4">Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Social Links</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                {data?.users?.map((u: any) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        {u.name}
                        {u.isVerified && (
                          <span title="Verified Badge">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-500 font-normal">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          u.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          u.status === 'banned' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.profile?.socialLinks ? (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          {u.profile.socialLinks.facebook && <Facebook className="w-3.5 h-3.5 text-blue-400" />}
                          {u.profile.socialLinks.instagram && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                          {u.profile.socialLinks.snapchat && <MessageCircle className="w-3.5 h-3.5 text-amber-300" />}
                          {u.profile.socialLinks.whatsapp && <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />}
                          {!u.profile.socialLinks.facebook &&
                            !u.profile.socialLinks.instagram &&
                            !u.profile.socialLinks.snapchat &&
                            !u.profile.socialLinks.whatsapp && (
                              <span className="text-slate-600 text-[10px]">None</span>
                            )}
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUserId(u._id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Full Info
                      </button>
                      <button
                        onClick={() => handleVerify(u._id)}
                        disabled={u.isVerified}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-[10px] font-bold disabled:opacity-40"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleBan(u._id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          u.status === 'banned' ? 'bg-emerald-600/20 text-emerald-300' : 'bg-amber-600/20 text-amber-300'
                        }`}
                      >
                        {u.status === 'banned' ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-1 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 text-rose-400"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Full Member Info Inspector Modal */}
      <AnimatePresence>
        {selectedUserId && detailData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-2xl w-full relative space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setSelectedUserId(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={
                    detailData.profile?.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={detailData.user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40"
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-white font-outfit">{detailData.user?.name}</h2>
                  <p className="text-xs text-slate-400">{detailData.user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                      Role: {detailData.user?.role}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      Status: {detailData.user?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="font-bold text-white block mb-1">Bio / Narrative:</span>
                  <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 italic">
                    "{detailData.profile?.bio || 'No bio written'}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Location:</span>
                    <span className="font-semibold text-white">
                      {detailData.profile?.city || 'City'}, {detailData.profile?.country || 'Country'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Occupation:</span>
                    <span className="font-semibold text-white">{detailData.profile?.occupation || 'Not specified'}</span>
                  </div>
                </div>

                {/* Social Media Links */}
                <div>
                  <span className="font-bold text-white block mb-2">Social Media Accounts:</span>
                  <div className="flex flex-wrap gap-2">
                    {detailData.profile?.socialLinks?.facebook && (
                      <a
                        href={detailData.profile.socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1"
                      >
                        <Facebook className="w-3.5 h-3.5" /> Facebook Link
                      </a>
                    )}
                    {detailData.profile?.socialLinks?.instagram && (
                      <span className="px-3 py-1.5 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 text-xs font-semibold flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5" /> Instagram: {detailData.profile.socialLinks.instagram}
                      </span>
                    )}
                    {detailData.profile?.socialLinks?.snapchat && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> Snapchat: {detailData.profile.socialLinks.snapchat}
                      </span>
                    )}
                    {detailData.profile?.socialLinks?.whatsapp && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5" /> WhatsApp: {detailData.profile.socialLinks.whatsapp}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hobbies */}
                <div>
                  <span className="font-bold text-white block mb-2">Selected World Hobbies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailData.profile?.interests?.map((item: any) => (
                      <span
                        key={item._id || item.name}
                        className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold"
                      >
                        #{item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Personality Answers Count */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span>50-Question Personality Answers Count:</span>
                  <span className="font-bold text-indigo-400">
                    {detailData.profile?.personalityAnswers?.length || 0} Answers Recorded
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDelete(detailData.user._id)}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" /> Remove / Delete Member
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
