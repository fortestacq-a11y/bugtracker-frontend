import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  BarChart3,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  UserCheck,
  Flame,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export function StatsDashboard({ onError }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        onError?.(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#87867f] py-20 bg-[#f5f4ed]">
        <div className="animate-spin w-6 h-6 border-2 border-[#c96442] border-t-transparent rounded-full mr-2" />
        <span>Loading metrics...</span>
      </div>
    );
  }

  const priorityIcons = {
    P0: { icon: Flame, color: 'text-[#b53333]', bg: 'bg-[#fdf2f2]', border: 'border-[#f5c6cb]' },
    P1: { icon: AlertTriangle, color: 'text-[#c96442]', bg: 'bg-[#fef6ee]', border: 'border-[#fcd9be]' },
    P2: { icon: ArrowUp, color: 'text-[#2563eb]', bg: 'bg-[#f0f5ff]', border: 'border-[#d4e4fc]' },
    P3: { icon: ArrowDown, color: 'text-[#5e5d59]', bg: 'bg-[#f4f3ed]', border: 'border-[#e2dfd2]' },
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-[1400px] mx-auto w-full space-y-6 bg-[#f5f4ed]">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#141413] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#c96442]" />
          <span>Project Health & Velocity</span>
        </h2>
        <p className="text-[#87867f] text-xs mt-1">
          Metrics across all projects you have membership access to.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Issues */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] p-4 rounded-xl shadow-xs">
          <div className="text-[#87867f] text-xs font-medium flex items-center justify-between">
            <span>Total Issues</span>
            <Layers className="w-4 h-4 text-[#c96442]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#141413] mt-2">{stats.totalIssues}</div>
          <div className="text-[11px] text-[#87867f] mt-1">{stats.totalProjects} active projects</div>
        </div>

        {/* Open Work */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] p-4 rounded-xl shadow-xs">
          <div className="text-[#87867f] text-xs font-medium flex items-center justify-between">
            <span>Open Issues</span>
            <Clock className="w-4 h-4 text-[#b45309]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#b45309] mt-2">{stats.openIssues}</div>
          <div className="text-[11px] text-[#87867f] mt-1">{stats.inProgress} in progress</div>
        </div>

        {/* In Review */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] p-4 rounded-xl shadow-xs">
          <div className="text-[#87867f] text-xs font-medium flex items-center justify-between">
            <span>In Review</span>
            <Sparkles className="w-4 h-4 text-[#7b1fa2]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#7b1fa2] mt-2">{stats.inReview}</div>
          <div className="text-[11px] text-[#87867f] mt-1">Awaiting QA / review</div>
        </div>

        {/* Resolved */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] p-4 rounded-xl shadow-xs">
          <div className="text-[#87867f] text-xs font-medium flex items-center justify-between">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2e7d32] mt-2">{stats.done}</div>
          <div className="text-[11px] text-[#87867f] mt-1">Done & Closed</div>
        </div>

        {/* Unassigned */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] p-4 rounded-xl shadow-xs">
          <div className="text-[#87867f] text-xs font-medium flex items-center justify-between">
            <span>Unassigned</span>
            <AlertOctagon className="w-4 h-4 text-[#b53333]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#b53333] mt-2">{stats.unassigned}</div>
          <div className="text-[11px] text-[#87867f] mt-1">Needs triage</div>
        </div>

        {/* Assigned to Me */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] p-4 rounded-xl shadow-xs">
          <div className="text-[#87867f] text-xs font-medium flex items-center justify-between">
            <span>Assigned to Me</span>
            <UserCheck className="w-4 h-4 text-[#0284c7]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#0284c7] mt-2">{stats.myAssigned}</div>
          <div className="text-[11px] text-[#87867f] mt-1">Your active tasks</div>
        </div>
      </div>

      {/* Two Column Layout: Status Breakdown vs Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Status Breakdown */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-medium text-base text-[#141413]">
            Status Distribution
          </h3>

          <div className="space-y-3">
            {stats.byStatus?.map((item) => {
              const count = item.count;
              const pct = stats.totalIssues > 0 ? Math.round((count / stats.totalIssues) * 100) : 0;

              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#3d3d3a]">{item.status.replace('_', ' ')}</span>
                    <span className="font-mono text-[#87867f]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#f5f4ed] rounded-full h-2.5 overflow-hidden border border-[#e8e6dc]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'DONE' || item.status === 'CLOSED'
                          ? 'bg-[#2e7d32]'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-[#2563eb]'
                          : item.status === 'IN_REVIEW'
                          ? 'bg-[#c96442]'
                          : 'bg-[#87867f]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-medium text-base text-[#141413]">
            Urgency & Priority Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            {stats.byPriority?.map((item) => {
              const cfg = priorityIcons[item.priority] || priorityIcons.P2;
              const Icon = cfg.icon;

              return (
                <div
                  key={item.priority}
                  className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center justify-between`}
                >
                  <div>
                    <div className="text-xs font-semibold text-[#141413] flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      <span>{item.priority}</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#141413] mt-1.5">{item.count}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
