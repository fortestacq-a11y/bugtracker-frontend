import { useState, useEffect } from 'react';
import { api } from '../api/client';

/**
 * Members of the selected project.
 *
 * <p>This is the only member list the app fetches — there is no global user
 * directory (plan §10.2). A failed fetch degrades to an empty list rather than
 * an error toast: the assignee filter is optional, and a failure here should not
 * interrupt the board.
 */
export function useProjectMembers(currentProject) {
  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      if (!currentProject) {
        setProjectMembers([]);
        return;
      }
      try {
        const mems = await api.getMembers(currentProject.id);
        if (!cancelled) setProjectMembers(mems || []);
      } catch (err) {
        console.warn('Failed to load members:', err);
        if (!cancelled) setProjectMembers([]);
      }
    }

    loadMembers();
    return () => {
      cancelled = true;
    };
  }, [currentProject]);

  return { projectMembers };
}