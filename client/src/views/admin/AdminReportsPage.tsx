import React from 'react';
import { useGetReportsQuery, useResolveReportMutation } from '../../redux/services/adminApi';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export const AdminReportsPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetReportsQuery({});
  const [resolveReport] = useResolveReportMutation();

  const handleResolve = async (reportId: string) => {
    try {
      await resolveReport({ reportId, status: 'resolved' }).unwrap();
      refetch();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
            Moderation Reports Queue
          </h1>
          <Badge variant="rose" dot>Safety</Badge>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Review community reports, investigated flags, and resolve infractions.
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium">Loading reports...</p>
        </div>
      ) : data?.reports?.length === 0 ? (
        <div className="rounded-3xl glass-container border border-white/20 p-12 text-center text-slate-300 text-xs shadow-2xl backdrop-blur-xl">
          No pending safety reports in queue. All clean!
        </div>
      ) : (
        <div className="space-y-4">
          {data?.reports?.map((report: any) => (
            <div
              key={report._id || report.id}
              className="rounded-2xl glass-container-card border border-white/20 p-6 flex items-center justify-between shadow-xl backdrop-blur-xl hover:border-rose-400/40 transition-all"
            >
              <div>
                <p className="text-sm font-bold text-white font-outfit">Reason: {report.reason}</p>
                <p className="text-xs text-slate-300 mt-1">
                  Reporter: <span className="text-white font-medium">{report.reporter?.name || 'User'}</span> | Reported User: <span className="text-rose-300 font-medium">{report.reportedUser?.name || 'User'}</span>
                </p>
                <div className="mt-2.5">
                  {report.status === 'resolved' ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                      Status: Resolved
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-semibold">
                      Status: Pending Investigation
                    </span>
                  )}
                </div>
              </div>
              {report.status !== 'resolved' && (
                <Button
                  onClick={() => handleResolve(report._id || report.id)}
                  size="sm"
                  className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
                >
                  Mark Resolved
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
