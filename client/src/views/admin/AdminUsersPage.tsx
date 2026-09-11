import React, { useState } from 'react';
import {
  useGetAllUsersQuery,
  useGetUserFullDetailsQuery,
  useBanUserMutation,
  useVerifyUserMutation,
  useDeleteUserMutation,
} from '../../redux/services/adminApi';
import { useSendMessageMutation } from '../../redux/services/messageApi';
import { Shield, CheckCircle2, UserX, Trash2, Eye, X, Facebook, Instagram, MessageCircle, PhoneCall, Send, Search, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUsersPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messagingUser, setMessagingUser] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  const { data: detailData } = useGetUserFullDetailsQuery(selectedUserId, {
    skip: !selectedUserId,
  });

  const [banUser] = useBanUserMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

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

  const handleSendMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !messagingUser) return;

    try {
      await sendMessage({
        receiverId: messagingUser._id || messagingUser.id,
        messageText: messageText.trim(),
      }).unwrap();

      setSendSuccess(`Direct message successfully sent to ${messagingUser.name}!`);
      setMessageText('');
      setTimeout(() => {
        setSendSuccess('');
        setMessagingUser(null);
      }, 1500);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to send message.');
    }
  };

  const filteredUsers = data?.users?.filter((u: any) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.status?.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="rounded-3xl glass-container border border-white/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-400" /> SoulSync Member Inspector
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            View all registered members, send direct messages, inspect profiles, grant verification, or ban/delete users.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/20 bg-black/40 text-slate-100 text-xs font-medium focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md shadow-inner"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading member database...</div>
      ) : (
        <div className="rounded-3xl glass-container border border-white/20 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Showing <strong className="text-white">{filteredUsers.length}</strong> of{' '}
              <strong className="text-rose-400">{data?.users?.length || 0}</strong> Registered Members
            </span>
          </div>

          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-black/60 backdrop-blur-md z-10">
                <tr className="text-[11px] font-bold text-slate-300 uppercase border-b border-white/10">
                  <th className="p-4">Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Social Links</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {filteredUsers.map((u: any) => (
                  <tr key={u._id || u.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        {u.name}
                        {u.isVerified && (
                          <span title="Verified Badge">
                            <CheckCircle2 className="w-4 h-4 text-rose-400" />
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          u.role === 'Admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/10 text-slate-200 border border-white/15'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          u.status === 'banned' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.profile?.socialLinks ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          {u.profile.socialLinks.facebook && <Facebook className="w-3.5 h-3.5 text-blue-400" />}
                          {u.profile.socialLinks.instagram && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                          {u.profile.socialLinks.snapchat && <MessageCircle className="w-3.5 h-3.5 text-amber-300" />}
                          {u.profile.socialLinks.whatsapp && <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />}
                          {!u.profile.socialLinks.facebook &&
                            !u.profile.socialLinks.instagram &&
                            !u.profile.socialLinks.snapchat &&
                            !u.profile.socialLinks.whatsapp && (
                              <span className="text-slate-500 text-[10px]">None</span>
                            )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {/* Message User Button */}
                      <button
                        onClick={() => setMessagingUser(u)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                        title="Send Direct Message"
                      >
                        <Send className="w-3 h-3" /> Message
                      </button>

                      {/* Full Info Button */}
                      <button
                        onClick={() => setSelectedUserId(u._id || u.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Full Info
                      </button>

                      <button
                        onClick={() => handleVerify(u._id || u.id)}
                        disabled={u.isVerified}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-[10px] font-bold disabled:opacity-40 transition-colors"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleBan(u._id || u.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          u.status === 'banned' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {u.status === 'banned' ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id || u.id)}
                        className="p-1 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400 transition-colors"
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

      {/* Admin Direct Message Modal */}
      <AnimatePresence>
        {messagingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-3xl glass-container border border-white/20 p-6 max-w-md w-full relative space-y-4 shadow-2xl backdrop-blur-2xl"
            >
              <button
                onClick={() => setMessagingUser(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-md">
                  {messagingUser.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">Message {messagingUser.name}</h3>
                  <p className="text-xs text-slate-300">{messagingUser.email}</p>
                </div>
              </div>

              {sendSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-semibold shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{sendSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Admin Direct Message Text
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your official admin message or notification to this user..."
                      className="w-full p-3 rounded-xl border border-white/20 bg-black/40 text-slate-100 text-xs font-medium focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-opacity"
                  >
                    {isSending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Direct Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Full Member Info Inspector Modal */}
      <AnimatePresence>
        {selectedUserId && detailData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-3xl glass-container border border-white/20 p-8 max-w-2xl w-full relative space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl backdrop-blur-2xl"
            >
              <button
                onClick={() => setSelectedUserId(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-white font-outfit">{detailData.user?.name}</h2>
                  <p className="text-xs text-slate-300">{detailData.user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      Role: {detailData.user?.role}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Status: {detailData.user?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-4 pt-2 border-t border-white/10 text-xs text-slate-200">
                <div>
                  <span className="font-bold text-white block mb-1">Bio / Narrative:</span>
                  <p className="p-3 rounded-xl glass-container-card border border-white/15 italic">
                    "{detailData.profile?.bio || 'No bio written'}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl glass-container-card border border-white/15">
                    <span className="text-slate-400 block">Location:</span>
                    <span className="font-semibold text-white">
                      {detailData.profile?.city || 'City'}, {detailData.profile?.country || 'Country'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl glass-container-card border border-white/15">
                    <span className="text-slate-400 block">Occupation:</span>
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
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Facebook className="w-3.5 h-3.5" /> Facebook Link
                      </a>
                    )}
                    {detailData.profile?.socialLinks?.instagram && (
                      <span className="px-3 py-1.5 rounded-xl bg-pink-600/20 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5" /> Instagram: {detailData.profile.socialLinks.instagram}
                      </span>
                    )}
                    {detailData.profile?.socialLinks?.snapchat && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" /> Snapchat: {detailData.profile.socialLinks.snapchat}
                      </span>
                    )}
                    {detailData.profile?.socialLinks?.whatsapp && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5" /> WhatsApp: {detailData.profile.socialLinks.whatsapp}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hobbies */}
                <div>
                  <span className="font-bold text-white block mb-2">Selected Hobbies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailData.profile?.interests?.map((item: any) => (
                      <span
                        key={item._id || item.id || item.name}
                        className="px-2.5 py-1 rounded-full glass-container-card text-rose-200 border border-rose-400/20 text-[10px] font-semibold"
                      >
                        #{item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Personality Answers Count */}
                <div className="p-3 rounded-xl glass-container-card border border-white/15 flex items-center justify-between">
                  <span className="text-slate-300">50-Question Personality Answers Count:</span>
                  <span className="font-bold text-rose-400">
                    {detailData.profile?.personalityAnswers?.length || 0} Answers Recorded
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setMessagingUser(detailData.user);
                    setSelectedUserId(null);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Send className="w-4 h-4" /> Send Direct Message
                </button>
                <button
                  onClick={() => handleDelete(detailData.user._id || detailData.user.id)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
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
