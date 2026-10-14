import React, { useState } from 'react';
import { api } from '../../api/client';
import { X, FolderPlus } from 'lucide-react';

export function ProjectModal({ isOpen, onClose, onCreated, onError }) {
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!key.trim() || !name.trim()) return;

    setLoading(true);
    try {
      const created = await api.createProject({
        key: key.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || null,
      });
      onCreated?.(created);
      onClose();
      setKey('');
      setName('');
      setDescription('');
    } catch (err) {
      onError?.(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#141413]/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden text-xs sm:text-sm">
        <div className="px-6 py-4 border-b border-[#e8e6dc] bg-[#f5f4ed] flex items-center justify-between">
          <div className="font-serif font-medium text-base text-[#141413] flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#c96442]" />
            <span>Create New Project</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-[#87867f] hover:text-[#141413] hover:bg-[#e8e6dc]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1">Project Key *</label>
            <input
              type="text"
              required
              maxLength={10}
              placeholder="e.g. CORE, APP, API"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2 text-[#141413] text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
              autoFocus
            />
            <span className="text-[11px] text-[#87867f] mt-1 block">Used as prefix for issue keys (e.g. {key || 'KEY'}-14).</span>
          </div>

          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Core Platform"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2 text-[#141413] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
            />
          </div>

          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="What this project covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-xl p-3 text-xs text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8e6dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#e8e6dc] hover:bg-[#dedbce] text-[#5e5d59] text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !key.trim() || !name.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#c96442] hover:bg-[#b85737] disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
