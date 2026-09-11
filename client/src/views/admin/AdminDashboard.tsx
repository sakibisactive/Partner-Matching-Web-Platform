import React from 'react';
import {
  useGetAdminAnalyticsQuery,
  useGetAllUsersQuery,
  useGetReportsQuery,
} from '../../redux/services/adminApi';
import { Users, ShieldAlert, CheckCircle2, UserX, ArrowRight, Shield, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const AdminDashboard: React.FC = () => {
  const { data: analyticsData } = useGetAdminAnalyticsQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: reportsData } = useGetReportsQuery({});

  const stats = analyticsData?.analytics || {
    totalUsers: usersData?.count || 0,
    activeUsers: usersData?.users?.filter((u: any) => u.status === 'active')?.length || 0,
    bannedUsers: usersData?.users?.filter((u: any) => u.status === 'banned')?.length || 0,
    totalMatches: 24,
    pendingReports: reportsData?.count || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
              Platform Control Center
            </h1>
            <Badge variant="rose" dot>Admin Mode</Badge>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Monitor user registrations, ban accounts, resolve safety flags, and configure hobbies.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl glass-container-card border border-white/20 p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-rose-400 shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.totalUsers}</span>
            <p className="text-xs text-slate-300 font-medium">Registered Users</p>
          </div>
        </div>

        <div className="rounded-2xl glass-container-card border border-white/20 p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.activeUsers}</span>
            <p className="text-xs text-slate-300 font-medium">Active Accounts</p>
          </div>
        </div>

        <div className="rounded-2xl glass-container-card border border-white/20 p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-400 shadow-md">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.bannedUsers}</span>
            <p className="text-xs text-slate-300 font-medium">Banned Accounts</p>
          </div>
        </div>

        <div className="rounded-2xl glass-container-card border border-white/20 p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.pendingReports}</span>
            <p className="text-xs text-slate-300 font-medium">Pending Reports</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="rounded-3xl glass-container-card border border-white/20 p-6 hover:border-rose-400/50 hover:shadow-rose-500/10 transition-all space-y-2 group shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors font-outfit">
              User Management
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-300">Verify identities, adjust roles, or ban abusive members.</p>
        </Link>

        <Link
          to="/admin/reports"
          className="rounded-3xl glass-container-card border border-white/20 p-6 hover:border-rose-400/50 hover:shadow-rose-500/10 transition-all space-y-2 group shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors font-outfit">
              Moderation Queue
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-300">Investigate reported candidates and resolve safety violations.</p>
        </Link>

        <Link
          to="/admin/interests"
          className="rounded-3xl glass-container-card border border-white/20 p-6 hover:border-rose-400/50 hover:shadow-rose-500/10 transition-all space-y-2 group shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors font-outfit">
              Hobbies Directory
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-300">Add, edit, and categorize global hobbies for Jaccard matching.</p>
        </Link>
      </div>
    </div>
  );
};
