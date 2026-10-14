import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bug,
  Sparkles,
  Wrench,
  CheckSquare,
  Flame,
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Shield
} from 'lucide-react';

export function PriorityBadge({ priority, size = 'sm' }) {
  const configs = {
    P0: { label: 'P0 Urgent', icon: Flame, className: 'bg-[#fdf2f2] text-[#b53333] border-[#f5c6cb]' },
    P1: { label: 'P1 High', icon: AlertTriangle, className: 'bg-[#fef6ee] text-[#c96442] border-[#fcd9be]' },
    P2: { label: 'P2 Med', icon: ArrowUp, className: 'bg-[#f0f5ff] text-[#2563eb] border-[#d4e4fc]' },
    P3: { label: 'P3 Low', icon: ArrowDown, className: 'bg-[#f4f3ed] text-[#5e5d59] border-[#e2dfd2]' },
  };

  const cfg = configs[priority] || configs.P2;
  const Icon = cfg.icon;
  const sizeClasses = size === 'xs' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md border ${sizeClasses} ${cfg.className} select-none`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
}

export function TypeBadge({ type, size = 'sm' }) {
  const configs = {
    BUG: { label: 'Bug', icon: Bug, className: 'bg-[#fdf2f2] text-[#b53333] border-[#f5c6cb]' },
    FEATURE: { label: 'Feature', icon: Sparkles, className: 'bg-[#f0f7ed] text-[#2e7d32] border-[#c8e6c9]' },
    REFACTOR: { label: 'Refactor', icon: Wrench, className: 'bg-[#f5effa] text-[#7b1fa2] border-[#e1bee7]' },
    TASK: { label: 'Task', icon: CheckSquare, className: 'bg-[#eef8fc] text-[#0284c7] border-[#b9e6fe]' },
    TECH_DEBT: { label: 'Tech Debt', icon: AlertOctagon, className: 'bg-[#fcf8e8] text-[#b45309] border-[#fef08a]' },
  };

  const cfg = configs[type] || configs.BUG;
  const Icon = cfg.icon;
  const sizeClasses = size === 'xs' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md border ${sizeClasses} ${cfg.className} select-none`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
}

export function StatusBadge({ status, size = 'sm' }) {
  const configs = {
    BACKLOG: { label: 'Backlog', icon: Circle, className: 'bg-[#f4f3ed] text-[#5e5d59] border-[#e2dfd2]' },
    IN_PROGRESS: { label: 'In Progress', icon: Clock, className: 'bg-[#f0f5ff] text-[#2563eb] border-[#d4e4fc]' },
    IN_REVIEW: { label: 'In Review', icon: Sparkles, className: 'bg-[#fcf3eb] text-[#c96442] border-[#fcd9be]' },
    DONE: { label: 'Done', icon: CheckCircle2, className: 'bg-[#f0f7ed] text-[#2e7d32] border-[#c8e6c9]' },
    CLOSED: { label: 'Closed', icon: XCircle, className: 'bg-[#eae8df] text-[#87867f] border-[#d8d5c8]' },
  };

  const cfg = configs[status] || configs.BACKLOG;
  const Icon = cfg.icon;
  const sizeClasses = size === 'xs' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md border ${sizeClasses} ${cfg.className} select-none`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
}

export function RoleBadge({ role }) {
  const configs = {
    OWNER: 'bg-[#fcf3eb] text-[#c96442] border-[#fcd9be]',
    MAINTAINER: 'bg-[#f5effa] text-[#7b1fa2] border-[#e1bee7]',
    DEVELOPER: 'bg-[#f0f5ff] text-[#2563eb] border-[#d4e4fc]',
    REPORTER: 'bg-[#f0f7ed] text-[#2e7d32] border-[#c8e6c9]',
    VIEWER: 'bg-[#f4f3ed] text-[#5e5d59] border-[#e2dfd2]',
  };

  const cls = configs[role] || configs.VIEWER;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border ${cls}`}>
      <Shield className="w-3 h-3" />
      {role}
    </span>
  );
}

export function UserAvatar({ user, size = 'sm' }) {
  if (!user) {
    return (
      <div className="w-6 h-6 rounded-full bg-[#e8e6dc] border border-[#d8d5c8] flex items-center justify-center text-[#87867f] text-xs" title="Unassigned">
        <HelpCircle className="w-3.5 h-3.5" />
      </div>
    );
  }

  const initials = (user.name || user.email || '?')
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const color = user.avatarColor || '#c96442';
  const sizeMap = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={`${sizeMap[size] || sizeMap.sm} rounded-full flex items-center justify-center font-bold text-white shadow-xs border border-white/40 shrink-0 select-none`}
      style={{ backgroundColor: color }}
      title={`${user.name || user.email}`}
    >
      {initials}
    </div>
  );
}
