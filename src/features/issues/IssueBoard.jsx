import React, { useState } from 'react';
import { IssueCard } from './IssueCard';
import { Circle, Clock, Sparkles, CheckCircle2, Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog', icon: Circle, color: 'text-[#87867f]', border: 'border-[#e8e6dc]' },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: Clock, color: 'text-[#2563eb]', border: 'border-[#d4e4fc]' },
  { id: 'IN_REVIEW', title: 'In Review', icon: Sparkles, color: 'text-[#c96442]', border: 'border-[#fcd9be]' },
  { id: 'DONE', title: 'Done', icon: CheckCircle2, color: 'text-[#2e7d32]', border: 'border-[#c8e6c9]' },
];

export function IssueBoard({ issues = [], onOpenDetail, onMoveStatus, onCreateIssue }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.id && data.currentStatus !== targetStatus) {
        onMoveStatus(data.id, targetStatus);
      }
    } catch (err) {
      console.error('Drop parse error:', err);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 sm:p-6 min-h-0 bg-[#f5f4ed]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[320px] max-w-[1600px] mx-auto items-start">
        {COLUMNS.map((col) => {
          const colIssues = issues.filter((i) => i.status === col.id);
          const Icon = col.icon;
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col bg-[#edeae0]/70 border rounded-2xl overflow-hidden transition-all min-h-[520px] max-h-[calc(100vh-180px)] ${
                isOver ? 'border-[#c96442] bg-[#fcf3eb] ring-2 ring-[#c96442]/30' : 'border-[#e2dfd2]'
              }`}
            >
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-[#e2dfd2] bg-[#f5f4ed]/90 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${col.color}`} />
                  <span className="font-semibold text-xs text-[#141413] tracking-tight">{col.title}</span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-[#e8e6dc] text-[#5e5d59] font-medium">
                    {colIssues.length}
                  </span>
                </div>

                {col.id === 'BACKLOG' && (
                  <button
                    onClick={onCreateIssue}
                    className="text-[#87867f] hover:text-[#c96442] p-1 rounded-md hover:bg-[#e8e6dc] transition-colors"
                    title="Add issue"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card List Area */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {colIssues.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#d8d5c8] rounded-xl flex flex-col items-center justify-center text-[#87867f] text-xs text-center p-3 select-none">
                    <span>No issues</span>
                    <span className="text-[10px] text-[#a09e95] mt-0.5">Drag card here</span>
                  </div>
                ) : (
                  colIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onOpenDetail={onOpenDetail}
                      onMoveStatus={onMoveStatus}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
