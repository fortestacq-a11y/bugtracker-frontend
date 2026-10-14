import React, { useState } from 'react';
import { PriorityBadge, TypeBadge, StatusBadge, UserAvatar } from '../../components/Badges';
import { ArrowUpDown, MessageSquare } from 'lucide-react';

export function IssueList({ issues = [], onOpenDetail, onMoveStatus }) {
  const [sortField, setSortField] = useState('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'assignee') {
      valA = a.assignee?.name || '';
      valB = b.assignee?.name || '';
    } else if (sortField === 'project') {
      valA = a.project?.key || '';
      valB = b.project?.key || '';
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto bg-[#f5f4ed]">
      <div className="bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl overflow-hidden shadow-sm max-w-[1600px] mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e8e6dc] bg-[#f5f4ed] text-[#5e5d59] font-semibold select-none">
                <th
                  onClick={() => handleSort('key')}
                  className="py-3 px-4 cursor-pointer hover:text-[#141413] transition-colors w-28 font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>Key</span>
                    <ArrowUpDown className="w-3 h-3 text-[#87867f]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('title')}
                  className="py-3 px-4 cursor-pointer hover:text-[#141413] transition-colors min-w-[280px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Title</span>
                    <ArrowUpDown className="w-3 h-3 text-[#87867f]" />
                  </div>
                </th>
                <th className="py-3 px-3 w-28">Type</th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3 px-3 cursor-pointer hover:text-[#141413] transition-colors w-28"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-[#87867f]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-[#141413] transition-colors w-36"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#87867f]" />
                  </div>
                </th>
                <th className="py-3 px-3 w-36">Assignee</th>
                <th className="py-3 px-3 w-24">Env</th>
                <th
                  onClick={() => handleSort('updatedAt')}
                  className="py-3 px-4 cursor-pointer hover:text-[#141413] transition-colors w-32 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Updated</span>
                    <ArrowUpDown className="w-3 h-3 text-[#87867f]" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0eee6]">
              {sortedIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#87867f]">
                    No issues match the selected filters.
                  </td>
                </tr>
              ) : (
                sortedIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => onOpenDetail(issue)}
                    className="hover:bg-[#f5f4ed] cursor-pointer transition-colors group"
                  >
                    {/* Key */}
                    <td className="py-3 px-4 font-mono font-medium text-[#87867f] group-hover:text-[#c96442] whitespace-nowrap">
                      {issue.key}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 text-[#141413] font-medium group-hover:text-[#c96442] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-lg">{issue.title}</span>
                        {issue.commentCount > 0 && (
                          <span className="flex items-center gap-0.5 text-[11px] text-[#87867f]">
                            <MessageSquare className="w-3 h-3" />
                            {issue.commentCount}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3">
                      <TypeBadge type={issue.type} size="xs" />
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3">
                      <PriorityBadge priority={issue.priority} size="xs" />
                    </td>

                    {/* Status with quick change */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      {issue.permissions?.canTriage ? (
                        <select
                          value={issue.status}
                          onChange={(e) => onMoveStatus(issue.id, e.target.value)}
                          className="bg-[#f5f4ed] border border-[#e8e6dc] rounded-md px-2 py-1 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
                        >
                          <option value="BACKLOG">Backlog</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="IN_REVIEW">In Review</option>
                          <option value="DONE">Done</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      ) : (
                        <StatusBadge status={issue.status} size="xs" />
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <UserAvatar user={issue.assignee} size="xs" />
                        <span className="text-[#3d3d3a] truncate max-w-[100px]">
                          {issue.assignee ? issue.assignee.name : 'Unassigned'}
                        </span>
                      </div>
                    </td>

                    {/* Environment */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#5e5d59]">
                      {issue.environment}
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-4 text-right text-[#87867f] text-[11px] font-mono">
                      {new Date(issue.updatedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
