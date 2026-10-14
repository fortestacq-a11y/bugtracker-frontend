import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { Toast } from './components/Toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { IssueBoard } from './features/issues/IssueBoard';
import { IssueList } from './features/issues/IssueList';
import { IssueModal } from './features/issues/IssueModal';
import { IssueDetailDrawer } from './features/issues/IssueDetailDrawer';
import { ProjectModal } from './features/projects/ProjectModal';
import { MemberManagerModal } from './features/projects/MemberManagerModal';
import { StatsDashboard } from './features/stats/StatsDashboard';
import { useToast } from './hooks/useToast';
import { useProjects } from './hooks/useProjects';
import { useProjectMembers } from './hooks/useProjectMembers';
import { useIssues } from './hooks/useIssues';

/**
 * Shell and composition only.
 *
 * <p>All data lives in the hooks; this file decides what is on screen and wires
 * callbacks between them. Modal open/closed flags stay here because they are
 * pure view state with no server side.
 */
export function App() {
  const { user, loading: authLoading } = useAuth();
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'register'
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list' | 'stats'

  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const { toast, showToast, dismissToast } = useToast();
  const { projects, currentProject, setCurrentProject, addProject } = useProjects(
    user,
    showToast
  );
  const { projectMembers } = useProjectMembers(currentProject);
  const {
    issues,
    filters,
    searchQuery,
    setSearchQuery,
    setFilter,
    clearFilters,
    moveStatus,
    addIssue,
    updateIssue,
    removeIssue,
  } = useIssues(user, currentProject, showToast);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f4ed] flex items-center justify-center text-[#87867f]">
        <div className="animate-spin w-8 h-8 border-2 border-[#c96442] border-t-transparent rounded-full mr-3" />
        <span className="text-sm font-medium font-serif">Initializing BugTracker...</span>
      </div>
    );
  }

  // Auth Gate
  if (!user) {
    if (authPage === 'register') {
      return <Register onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthPage('register')} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f4ed] flex flex-col selection:bg-[#c96442]/20 selection:text-[#c96442]">
      <Toast toast={toast} onDismiss={dismissToast} />

      <Navbar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        onCreateProject={() => setIsProjectModalOpen(true)}
        onOpenMembers={() => setIsMemberModalOpen(true)}
        onCreateIssue={() => setIsIssueModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        members={projectMembers}
        totalCount={issues.length}
        filteredCount={issues.length}
      />

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#f5f4ed]">
        {viewMode === 'board' && (
          <IssueBoard
            issues={issues}
            onOpenDetail={(issue) => setSelectedIssueId(issue.id)}
            onMoveStatus={moveStatus}
            onCreateIssue={() => setIsIssueModalOpen(true)}
          />
        )}

        {viewMode === 'list' && (
          <IssueList
            issues={issues}
            onOpenDetail={(issue) => setSelectedIssueId(issue.id)}
            onMoveStatus={moveStatus}
          />
        )}

        {viewMode === 'stats' && <StatsDashboard onError={(msg) => showToast(msg, 'error')} />}
      </main>

      <IssueDetailDrawer
        issueId={selectedIssueId}
        onClose={() => setSelectedIssueId(null)}
        onUpdated={updateIssue}
        onDeleted={(deletedId) => {
          removeIssue(deletedId);
          showToast('Issue deleted', 'success');
        }}
        onError={(msg) => showToast(msg, 'error')}
      />

      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onCreated={(created) => {
          addIssue(created);
          showToast(`Created issue ${created.key}`, 'success');
        }}
        projects={projects}
        defaultProjectId={currentProject?.id}
        onError={(msg) => showToast(msg, 'error')}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreated={(created) => {
          addProject(created);
          showToast(`Created project ${created.name} (${created.key})`, 'success');
        }}
        onError={(msg) => showToast(msg, 'error')}
      />

      {currentProject && (
        <MemberManagerModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          project={currentProject}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}
    </div>
  );
}