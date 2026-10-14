import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { UserAvatar } from '../../components/Badges';
import { X, UserPlus, Shield, Trash2 } from 'lucide-react';

export function MemberManagerModal({
  isOpen,
  onClose,
  project,
  onError,
}) {
  const [members, setMembers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedRole, setSelectedRole] = useState('DEVELOPER');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!isOpen || !project) return;
    loadData();
  }, [isOpen, project]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [memList, candList] = await Promise.all([
        api.getMembers(project.id),
        api.getCandidates(project.id).catch(() => []), // May 403 if caller not maintainer
      ]);
      setMembers(memList || []);
      setCandidates(candList || []);
      if (candList?.length > 0) {
        setSelectedCandidateId(candList[0].id);
      }
    } catch (err) {
      onError?.(err.message || 'Failed to load project members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedCandidateId) return;
    setAdding(true);
    try {
      await api.addMember(project.id, Number(selectedCandidateId), selectedRole);
      setSelectedCandidateId('');
      await loadData();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateMemberRole(project.id, userId, newRole);
      await loadData();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleRemoveMember = async (userId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this project?`)) return;
    try {
      await api.removeMember(project.id, userId);
      await loadData();
    } catch (err) {
      onError?.(err.message);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#141413]/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl shadow-2xl w-full max-w-xl z-10 overflow-hidden text-xs sm:text-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e8e6dc] bg-[#f5f4ed] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-medium text-[#141413] text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c96442]" />
              <span>Project Members — {project.name}</span>
            </h3>
            <p className="text-[#87867f] text-xs mt-0.5 font-mono">{project.key}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-[#87867f] hover:text-[#141413] hover:bg-[#e8e6dc]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Member Form (if candidates exist) */}
          {candidates.length > 0 && (
            <form onSubmit={handleAddMember} className="bg-[#f5f4ed] p-4 rounded-xl border border-[#e8e6dc] space-y-3">
              <div className="text-xs font-semibold text-[#141413] flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-[#c96442]" />
                <span>Add Member</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full sm:flex-1 bg-[#faf9f5] border border-[#e8e6dc] rounded-lg px-3 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
                >
                  <option value="" disabled>Select a user to invite...</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full sm:w-36 bg-[#faf9f5] border border-[#e8e6dc] rounded-lg px-3 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
                >
                  <option value="VIEWER">VIEWER</option>
                  <option value="REPORTER">REPORTER</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="MAINTAINER">MAINTAINER</option>
                  <option value="OWNER">OWNER</option>
                </select>

                <button
                  type="submit"
                  disabled={adding || !selectedCandidateId}
                  className="w-full sm:w-auto px-4 py-1.5 bg-[#c96442] hover:bg-[#b85737] disabled:opacity-50 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
                >
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          )}

          {/* Members Table */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#87867f] uppercase tracking-wider">
              Current Members ({members.length})
            </div>

            {loading ? (
              <div className="py-8 text-center text-[#87867f]">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="py-6 text-center text-[#87867f]">No members found.</div>
            ) : (
              <div className="divide-y divide-[#f0eee6] border border-[#e8e6dc] rounded-xl overflow-hidden bg-[#faf9f5]">
                {members.map((m) => (
                  <div key={m.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#f5f4ed] transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar user={m} size="sm" />
                      <div className="min-w-0">
                        <div className="font-medium text-[#141413] truncate">{m.name}</div>
                        <div className="text-[11px] text-[#87867f] truncate">{m.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="bg-[#f5f4ed] border border-[#e8e6dc] rounded-md px-2 py-1 text-xs text-[#141413] focus:outline-none focus:border-[#c96442]"
                      >
                        <option value="OWNER">OWNER</option>
                        <option value="MAINTAINER">MAINTAINER</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="REPORTER">REPORTER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>

                      <button
                        onClick={() => handleRemoveMember(m.id, m.name)}
                        className="p-1 rounded text-[#87867f] hover:text-[#b53333] hover:bg-[#fdf2f2] transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[11px] text-[#5e5d59] bg-[#f5f4ed] p-3.5 rounded-xl border border-[#e8e6dc] leading-relaxed">
            <span className="font-semibold text-[#141413]">Roles guide:</span>{' '}
            <strong className="text-[#3d3d3a]">VIEWER</strong> (read-only),{' '}
            <strong className="text-[#3d3d3a]">REPORTER</strong> (create & edit own issues),{' '}
            <strong className="text-[#3d3d3a]">DEVELOPER</strong> (edit all, change status),{' '}
            <strong className="text-[#3d3d3a]">MAINTAINER</strong> (delete issues & manage members),{' '}
            <strong className="text-[#3d3d3a]">OWNER</strong> (full project control).
          </div>
        </div>
      </div>
    </div>
  );
}
