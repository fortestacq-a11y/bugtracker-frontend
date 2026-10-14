import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const EMPTY_FILTERS = {
  status: null,
  priority: null,
  type: null,
  assigneeId: null,
};

/**
 * The issue list, its filters, and the mutations the board and drawer fire.
 *
 * <p>All three concern one collection, so they live together rather than being
 * split into separate hooks that would each need the same dependency list.
 * Keeping this in one file is also the seam where a TanStack Query migration
 * (plan §6) would land — the swap is confined to this module.
 */
export function useIssues(user, currentProject, showToast) {
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  const loadIssues = useCallback(async () => {
    if (!user) return;
    setLoadingIssues(true);
    try {
      const list = await api.getIssues({
        projectId: currentProject?.id,
        status: filters.status,
        priority: filters.priority,
        type: filters.type,
        assigneeId: filters.assigneeId,
        q: searchQuery.trim() || undefined,
      });
      setIssues(list || []);
    } catch (err) {
      console.warn('Failed to fetch issues:', err);
      showToast(err.message, 'error');
    } finally {
      setLoadingIssues(false);
    }
  }, [user, currentProject, filters, searchQuery, showToast]);

  useEffect(() => {
    if (user) {
      loadIssues();
    }
  }, [user, loadIssues]);

  /** Kanban drag-and-drop, and the quick-advance control in the list view. */
  const moveStatus = useCallback(
    async (issueId, newStatus) => {
      try {
        const updated = await api.updateIssueStatus(issueId, newStatus);
        setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
        showToast(`Updated status to ${newStatus.replace('_', ' ')}`, 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    },
    [showToast]
  );

  const addIssue = useCallback((created) => {
    setIssues((prev) => [created, ...prev]);
  }, []);

  const updateIssue = useCallback((updated) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }, []);

  const removeIssue = useCallback((deletedId) => {
    setIssues((prev) => prev.filter((i) => i.id !== deletedId));
  }, []);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearchQuery('');
  }, []);

  return {
    issues,
    loadingIssues,
    filters,
    searchQuery,
    setSearchQuery,
    setFilter,
    clearFilters,
    moveStatus,
    addIssue,
    updateIssue,
    removeIssue,
    reload: loadIssues,
  };
}