import React from 'react';
import { PriorityBadge, TypeBadge, UserAvatar } from '../../components/Badges';
import { MessageSquare, ArrowRight } from 'lucide-react';

export function IssueCard({ issue, onOpenDetail, onMoveStatus }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: issue.id, currentStatus: issue.status }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const nextStatusMap = {
    BACKLOG: 'IN_PROGRESS',
    IN_PROGRESS: 'IN_REVIEW',
    IN_REVIEW: 'DONE',
    DONE: 'CLOSED',
    CLOSED: null,
  };

  const nextStatus = nextStatusMap[issue.status];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onOpenDetail(issue)}
      className="group bg-[#faf9f5] hover:bg-[#ffffff] border border-[#e8e6dc] hover:border-[#d8d5c8] rounded-xl p-3.5 shadow-[rgba(0,0,0,0.02)_0px_2px_6px] hover:shadow-[rgba(0,0,0,0.06)_0px_6px_20px] transition-all cursor-pointer flex flex-col gap-2.5 relative select-none"
    >
      {/* Top: Issue Key + Badges */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#87867f] group-hover:text-[#c96442] transition-colors shrink-0 whitespace-nowrap">
          <span>{issue.key}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <TypeBadge type={issue.type} size="xs" />
          <PriorityBadge priority={issue.priority} size="xs" />
        </div>
      </div>

      {/* Middle: Title */}
      <h3 className="text-[13px] sm:text-[14px] font-medium text-[#141413] group-hover:text-[#c96442] leading-snug line-clamp-2 transition-colors">
        {issue.title}
      </h3>

      {/* Bottom: Assignee + Comment Count + Quick Advance */}
      <div className="flex items-center justify-between pt-2 border-t border-[#f0eee6] text-xs text-[#5e5d59]">
        <div className="flex items-center gap-2">
          <UserAvatar user={issue.assignee} size="xs" />
          <span className="text-[11px] text-[#5e5d59] truncate max-w-[100px]">
            {issue.assignee ? issue.assignee.name.split(' ')[0] : 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {issue.commentCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-[#87867f]">
              <MessageSquare className="w-3 h-3" />
              <span>{issue.commentCount}</span>
            </div>
          )}

          {/* Quick status move button on card hover */}
          {nextStatus && issue.permissions?.canTriage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(issue.id, nextStatus);
              }}
              title={`Move to ${nextStatus.replace('_', ' ')}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-[#e8e6dc] hover:bg-[#c96442] hover:text-[#faf9f5] text-[#5e5d59]"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
