import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { X, Plus } from 'lucide-react';

export function IssueModal({
  isOpen,
  onClose,
  onCreated,
  projects = [],
  defaultProjectId,
  onError,
}) {
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('BUG');
  const [priority, setPriority] = useState('P2');
  const [environment, setEnvironment] = useState('DEV');
  const [assigneeId, setAssigneeId] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultProjectId) {
      setProjectId(defaultProjectId);
    } else if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [defaultProjectId, projects]);

  useEffect(() => {
    if (!projectId) return;
    async function loadMembers() {
      try {
        const mems = await api.getMembers(projectId);
        setMembers(mems || []);
      } catch (err) {
        console.warn('Failed to fetch members for project:', err);
        setMembers([]);
      }
    }
    loadMembers();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setLoading(true);
    try {
      const payload = {
        projectId: Number(projectId),
        title: title.trim(),
        description: description.trim() || null,
        type,
        priority,
        environment,
        assigneeId: assigneeId ? Number(assigneeId) : null,
      };

      const created = await api.createIssue(payload);
      onCreated?.(created);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setType('BUG');
      setPriority('P2');
      setEnvironment('DEV');
      setAssigneeId('');
    } catch (err) {
      onError?.(err.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#141413]/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden text-xs sm:text-sm">
        <div className="px-6 py-4 border-b border-[#e8e6dc] bg-[#f5f4ed] flex items-center justify-between">
          <div className="font-serif font-medium text-base text-[#141413] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#c96442]" />
            <span>Create New Issue</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-[#87867f] hover:text-[#141413] hover:bg-[#e8e6dc]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Picker */}
          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1">Project *</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2 text-[#141413] text-xs focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1">Title *</label>
            <input
              type="text"
              required
              placeholder="Short, descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2 text-[#141413] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Steps to reproduce, environment context, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-xl p-3 text-xs text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20 font-mono"
            />
          </div>

          {/* Selectors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Type */}
            <div>
              <label className="block text-[#87867f] text-[11px] mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#f5f4ed] border border-[#e8e6dc] rounded-lg px-2.5 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
              >
                <option value="BUG">Bug</option>
                <option value="FEATURE">Feature</option>
                <option value="REFACTOR">Refactor</option>
                <option value="TASK">Task</option>
                <option value="TECH_DEBT">Tech Debt</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[#87867f] text-[11px] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#f5f4ed] border border-[#e8e6dc] rounded-lg px-2.5 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
              >
                <option value="P0">P0 Urgent</option>
                <option value="P1">P1 High</option>
                <option value="P2">P2 Medium</option>
                <option value="P3">P3 Low</option>
              </select>
            </div>

            {/* Environment */}
            <div>
              <label className="block text-[#87867f] text-[11px] mb-1">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-[#f5f4ed] border border-[#e8e6dc] rounded-lg px-2.5 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
              >
                <option value="DEV">DEV</option>
                <option value="STAGING">STAGING</option>
                <option value="PROD">PROD</option>
                <option value="LOCAL">LOCAL</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-[#87867f] text-[11px] mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-[#f5f4ed] border border-[#e8e6dc] rounded-lg px-2.5 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8e6dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#e8e6dc] hover:bg-[#dedbce] text-[#5e5d59] text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#c96442] hover:bg-[#b85737] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {loading ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
