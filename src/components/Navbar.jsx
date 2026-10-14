import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar, RoleBadge } from './Badges';
import {
  Bug,
  Plus,
  FolderGit2,
  ChevronDown,
  LogOut,
  Users,
  Search,
  FolderPlus
} from 'lucide-react';

export function Navbar({
  projects = [],
  currentProject,
  onSelectProject,
  onCreateProject,
  onOpenMembers,
  onCreateIssue,
  searchQuery,
  onSearchChange,
}) {
  const { user, logout, switchUser } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);

  return (
    <header className="bg-[#faf9f5] border-b border-[#e8e6dc] sticky top-0 z-30 select-none shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: Brand + Project Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 font-bold tracking-tight text-[#141413] cursor-pointer" onClick={() => onSelectProject(null)}>
            <div className="w-8 h-8 rounded-lg bg-[#c96442] text-[#faf9f5] flex items-center justify-center shadow-xs">
              <Bug className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-serif tracking-tight font-medium hidden sm:inline text-[#141413]">BugTracker</span>
          </div>

          <div className="h-4 w-px bg-[#e8e6dc] hidden sm:block" />

          {/* Project Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProjectMenuOpen(!projectMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#f5f4ed] hover:bg-[#eae8df] text-[#3d3d3a] border border-[#e8e6dc] shadow-[0_0_0_1px_#e8e6dc] transition-all"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[#c96442]" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate">
                {currentProject ? currentProject.name : 'All Projects'}
              </span>
              {currentProject && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e8e6dc] text-[#5e5d59] border border-[#d8d5c8]">
                  {currentProject.key}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[#87867f]" />
            </button>

            {projectMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProjectMenuOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-[#faf9f5] border border-[#e8e6dc] shadow-xl shadow-black/10 py-1.5 z-50 text-sm">
                  <div className="px-3.5 py-1.5 text-xs font-medium text-[#87867f] border-b border-[#f0eee6] flex items-center justify-between">
                    <span>Switch Project</span>
                    <button
                      onClick={() => {
                        setProjectMenuOpen(false);
                        onCreateProject();
                      }}
                      className="text-[#c96442] hover:text-[#b85737] flex items-center gap-1 font-medium text-xs"
                    >
                      <FolderPlus className="w-3.5 h-3.5" /> New
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectProject(null);
                      setProjectMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#f5f4ed] transition-colors ${!currentProject ? 'text-[#c96442] font-semibold bg-[#fcf3eb]' : 'text-[#3d3d3a]'}`}
                  >
                    <span>All Visible Projects</span>
                    <span className="text-xs text-[#87867f] font-mono">{projects.length}</span>
                  </button>

                  <div className="my-1 border-t border-[#f0eee6]" />

                  <div className="max-h-60 overflow-y-auto">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProject(p);
                          setProjectMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#f5f4ed] transition-colors ${currentProject?.id === p.id ? 'text-[#c96442] font-semibold bg-[#fcf3eb]' : 'text-[#3d3d3a]'}`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate font-medium text-xs">{p.name}</div>
                          <div className="text-[11px] text-[#87867f] font-mono">{p.key}</div>
                        </div>
                        {p.myRole && <RoleBadge role={p.myRole} />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#87867f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues by title or description..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] focus:bg-[#faf9f5] text-[#141413] pl-8 pr-3 py-1.5 rounded-lg text-xs placeholder:text-[#87867f] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions + Members + Active User */}
        <div className="flex items-center gap-2.5">
          {currentProject && (
            <button
              onClick={onOpenMembers}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3d3d3a] hover:text-[#141413] bg-[#f5f4ed] hover:bg-[#eae8df] border border-[#e8e6dc] transition-colors"
              title="Manage Project Members"
            >
              <Users className="w-3.5 h-3.5 text-[#5e5d59]" />
              <span>Members</span>
            </button>
          )}

          <button
            onClick={onCreateIssue}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#faf9f5] bg-[#c96442] hover:bg-[#b85737] active:bg-[#a84c2e] shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Issue</span>
          </button>

          <div className="h-4 w-px bg-[#e8e6dc]" />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#c96442]/30 transition-all"
            >
              <UserAvatar user={user} size="sm" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#faf9f5] border border-[#e8e6dc] shadow-xl shadow-black/10 py-2 z-50 text-xs">
                  {/* Active user header */}
                  <div className="px-4 py-2.5 border-b border-[#f0eee6]">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar user={user} size="md" />
                      <div className="truncate">
                        <div className="font-semibold text-[#141413] truncate">{user?.name}</div>
                        <div className="text-[#87867f] text-[11px] truncate">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Persona Switcher */}
                  <div className="px-3.5 py-2.5 border-b border-[#f0eee6]">
                    <div className="text-[10px] font-semibold text-[#87867f] uppercase tracking-wider mb-2">
                      Switch Persona (Role Testing)
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          switchUser('alice@example.com');
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs hover:bg-[#f5f4ed] ${user?.email === 'alice@example.com' ? 'bg-[#fcf3eb] text-[#c96442] font-semibold border border-[#fcd9be]' : 'text-[#3d3d3a]'}`}
                      >
                        <span>Alice (Lead / Owner)</span>
                        <span className="text-[10px] text-[#87867f]">All projects</span>
                      </button>
                      <button
                        onClick={() => {
                          switchUser('bob@example.com');
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs hover:bg-[#f5f4ed] ${user?.email === 'bob@example.com' ? 'bg-[#fcf3eb] text-[#c96442] font-semibold border border-[#fcd9be]' : 'text-[#3d3d3a]'}`}
                      >
                        <span>Bob (Developer)</span>
                        <span className="text-[10px] text-[#87867f]">CORE dev, MOB view</span>
                      </button>
                      <button
                        onClick={() => {
                          switchUser('charlie@example.com');
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs hover:bg-[#f5f4ed] ${user?.email === 'charlie@example.com' ? 'bg-[#fcf3eb] text-[#c96442] font-semibold border border-[#fcd9be]' : 'text-[#3d3d3a]'}`}
                      >
                        <span>Charlie (Reporter)</span>
                        <span className="text-[10px] text-[#87867f]">CORE only</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-2 text-[#b53333] hover:bg-[#fdf2f2] transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
