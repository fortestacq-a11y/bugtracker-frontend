import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { PriorityBadge, TypeBadge, StatusBadge, UserAvatar } from '../../components/Badges';
import {
  X,
  MessageSquare,
  History,
  Send,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';

export function IssueDetailDrawer({
  issueId,
  onClose,
  onUpdated,
  onDeleted,
  onError,
}) {
  const [detail, setDetail] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'history'

  // Edit fields
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!issueId) return;
    loadDetail();
  }, [issueId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await api.getIssue(issueId);
      setDetail(data);
      setEditTitle(data.issue.title);
      setEditDesc(data.issue.description || '');

      // Load project members for this issue's specific project
      if (data.issue.project?.id) {
        try {
          const mems = await api.getMembers(data.issue.project.id);
          setMembers(mems || []);
        } catch {
          setMembers([]);
        }
      }
    } catch (err) {
      onError?.(err.message || 'Failed to load issue detail');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await api.updateIssueStatus(issueId, newStatus);
      await loadDetail();
      onUpdated?.(updated);
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const updated = await api.updateIssue(issueId, { priority: newPriority });
      await loadDetail();
      onUpdated?.(updated);
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    try {
      const assigneeId = newAssigneeId === '' ? null : Number(newAssigneeId);
      const updated = await api.updateIssue(issueId, { assigneeId });
      await loadDetail();
      onUpdated?.(updated);
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleSaveTitle = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      const updated = await api.updateIssue(issueId, { title: editTitle.trim() });
      setIsEditingTitle(false);
      await loadDetail();
      onUpdated?.(updated);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDesc = async () => {
    setSaving(true);
    try {
      const updated = await api.updateIssue(issueId, { description: editDesc });
      setIsEditingDesc(false);
      await loadDetail();
      onUpdated?.(updated);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await api.addComment(issueId, commentText.trim());
      setCommentText('');
      await loadDetail();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteIssue = async () => {
    if (!window.confirm(`Are you sure you want to delete ${detail.issue.key}?`)) return;
    try {
      await api.deleteIssue(issueId);
      onDeleted?.(issueId);
      onClose();
    } catch (err) {
      onError?.(err.message);
    }
  };

  if (!issueId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#141413]/30 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#faf9f5] border-l border-[#e8e6dc] h-full shadow-2xl flex flex-col z-10 text-xs sm:text-sm">
        {loading || !detail ? (
          <div className="flex-1 flex items-center justify-center text-[#87867f]">
            <div className="animate-spin w-6 h-6 border-2 border-[#c96442] border-t-transparent rounded-full mr-2" />
            <span>Loading issue...</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e8e6dc] bg-[#f5f4ed] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-[#c96442]">
                <span>{detail.issue.key}</span>
                <span className="text-[#87867f] font-sans font-normal text-xs">in {detail.issue.project?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                {detail.issue.permissions?.canDelete && (
                  <button
                    onClick={handleDeleteIssue}
                    className="p-1.5 rounded-md text-[#87867f] hover:text-[#b53333] hover:bg-[#fdf2f2] transition-colors"
                    title="Delete Issue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-[#87867f] hover:text-[#141413] hover:bg-[#e8e6dc] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Title Section */}
              <div>
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-[#f5f4ed] border border-[#c96442] rounded-lg px-3 py-2 text-sm text-[#141413] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTitle}
                      disabled={saving}
                      className="px-3 py-2 bg-[#c96442] text-white rounded-lg hover:bg-[#b85737]"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="px-3 py-2 bg-[#e8e6dc] text-[#5e5d59] rounded-lg hover:bg-[#dedbce]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="group flex items-start justify-between gap-2">
                    <h2 className="text-lg sm:text-xl font-serif font-medium text-[#141413] leading-snug">
                      {detail.issue.title}
                    </h2>
                    {detail.issue.permissions?.canEdit && (
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="opacity-0 group-hover:opacity-100 text-[#87867f] hover:text-[#c96442] p-1 transition-opacity"
                        title="Edit title"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Status / Properties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f5f4ed] p-4 rounded-xl border border-[#e8e6dc] text-xs">
                {/* Status */}
                <div>
                  <div className="text-[#87867f] text-[11px] mb-1 font-medium">Status</div>
                  {detail.issue.permissions?.canTriage ? (
                    <select
                      value={detail.issue.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-[#e8e6dc] rounded-md px-2 py-1 text-[#141413] focus:outline-none focus:border-[#c96442]"
                    >
                      <option value="BACKLOG">Backlog</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="DONE">Done</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  ) : (
                    <StatusBadge status={detail.issue.status} />
                  )}
                </div>

                {/* Priority */}
                <div>
                  <div className="text-[#87867f] text-[11px] mb-1 font-medium">Priority</div>
                  {detail.issue.permissions?.canTriage ? (
                    <select
                      value={detail.issue.priority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-[#e8e6dc] rounded-md px-2 py-1 text-[#141413] focus:outline-none focus:border-[#c96442]"
                    >
                      <option value="P0">P0 Urgent</option>
                      <option value="P1">P1 High</option>
                      <option value="P2">P2 Medium</option>
                      <option value="P3">P3 Low</option>
                    </select>
                  ) : (
                    <PriorityBadge priority={detail.issue.priority} />
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <div className="text-[#87867f] text-[11px] mb-1 font-medium">Assignee</div>
                  {detail.issue.permissions?.canTriage ? (
                    <select
                      value={detail.issue.assignee?.id || ''}
                      onChange={(e) => handleAssigneeChange(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-[#e8e6dc] rounded-md px-2 py-1 text-[#141413] focus:outline-none focus:border-[#c96442]"
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <UserAvatar user={detail.issue.assignee} size="xs" />
                      <span className="truncate">{detail.issue.assignee?.name || 'Unassigned'}</span>
                    </div>
                  )}
                </div>

                {/* Type & Env */}
                <div>
                  <div className="text-[#87867f] text-[11px] mb-1 font-medium">Type / Env</div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <TypeBadge type={detail.issue.type} size="xs" />
                    <span className="font-mono text-[11px] text-[#5e5d59] bg-[#e8e6dc] px-1.5 py-0.5 rounded">
                      {detail.issue.environment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#87867f] uppercase tracking-wider">
                  <span>Description</span>
                  {detail.issue.permissions?.canEdit && !isEditingDesc && (
                    <button
                      onClick={() => setIsEditingDesc(true)}
                      className="text-[#c96442] hover:text-[#b85737] flex items-center gap-1 normal-case text-xs font-medium"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>

                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-[#f5f4ed] border border-[#c96442] rounded-xl p-3.5 text-xs sm:text-sm text-[#141413] focus:outline-none font-mono"
                      placeholder="Add details, steps to reproduce, or acceptance criteria..."
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className="px-3.5 py-1.5 bg-[#e8e6dc] text-[#5e5d59] rounded-lg hover:bg-[#dedbce] text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveDesc}
                        disabled={saving}
                        className="px-3.5 py-1.5 bg-[#c96442] text-white rounded-lg hover:bg-[#b85737] text-xs font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#faf9f5] border border-[#e8e6dc] rounded-xl p-4 text-[#3d3d3a] whitespace-pre-wrap leading-relaxed min-h-[90px] shadow-xs">
                    {detail.issue.description || <span className="text-[#87867f] italic">No description provided.</span>}
                  </div>
                )}
              </div>

              {/* Metadata Footer bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#87867f] pt-2 border-t border-[#f0eee6]">
                <div className="flex items-center gap-1.5">
                  <span>Reported by</span>
                  <UserAvatar user={detail.issue.reporter} size="xs" />
                  <span className="text-[#141413] font-medium">{detail.issue.reporter?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Created {new Date(detail.issue.createdAt).toLocaleString()}</span>
                  {detail.issue.resolvedAt && (
                    <span className="text-[#2e7d32] font-medium">
                      Resolved {new Date(detail.issue.resolvedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Tabs for Comments vs Audit History */}
              <div className="pt-4 border-t border-[#e8e6dc]">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`flex items-center gap-1.5 pb-1.5 font-semibold text-xs transition-colors border-b-2 ${
                      activeTab === 'comments'
                        ? 'text-[#c96442] border-[#c96442]'
                        : 'text-[#87867f] border-transparent hover:text-[#141413]'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comments ({detail.comments.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-1.5 pb-1.5 font-semibold text-xs transition-colors border-b-2 ${
                      activeTab === 'history'
                        ? 'text-[#c96442] border-[#c96442]'
                        : 'text-[#87867f] border-transparent hover:text-[#141413]'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Audit History ({detail.history.length})</span>
                  </button>
                </div>

                {/* Tab 1: Comments Thread */}
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {detail.comments.length === 0 ? (
                      <div className="text-center py-6 text-[#87867f] text-xs">
                        No comments yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detail.comments.map((c) => (
                          <div key={c.id} className="bg-[#f5f4ed] border border-[#e8e6dc] rounded-xl p-3.5 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 font-medium text-[#141413]">
                                <UserAvatar user={c.author} size="xs" />
                                <span>{c.author?.name}</span>
                              </div>
                              <span className="text-[11px] text-[#87867f]">
                                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[#3d3d3a] pl-7 whitespace-pre-wrap leading-relaxed">{c.body}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Comment Input */}
                    {detail.issue.permissions?.canComment ? (
                      <form onSubmit={handleAddComment} className="mt-4 space-y-2">
                        <textarea
                          rows={2}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-xl p-3 text-xs text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submittingComment || !commentText.trim()}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c96442] hover:bg-[#b85737] disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Comment</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-2 text-[#87867f] text-xs italic">
                        You have view-only access to comments.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Audit History Timeline */}
                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {detail.history.length === 0 ? (
                      <div className="text-center py-6 text-[#87867f] text-xs">
                        No history entries recorded yet.
                      </div>
                    ) : (
                      <div className="relative border-l-2 border-[#e8e6dc] ml-3 pl-4 space-y-4 text-xs">
                        {detail.history.map((h) => (
                          <div key={h.id} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#c96442] ring-4 ring-[#faf9f5]" />
                            <div className="text-[#3d3d3a]">
                              <span className="font-semibold text-[#141413]">{h.changedBy?.name}</span>
                              {' changed '}
                              <span className="font-mono text-[#c96442] font-medium">{h.field}</span>
                              {h.oldValue && (
                                <>
                                  {' from '}
                                  <span className="line-through text-[#87867f] font-mono">{h.oldValue}</span>
                                </>
                              )}
                              {' to '}
                              <span className="font-semibold text-[#2e7d32] font-mono">{h.newValue}</span>
                            </div>
                            <div className="text-[10px] text-[#87867f] mt-0.5">
                              {new Date(h.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
