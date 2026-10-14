import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

/**
 * The caller's visible projects and the one currently selected in the top bar.
 *
 * <p>Selecting a project that has since disappeared from the list (removed
 * membership, deleted project) resets the selection rather than leaving the UI
 * pointing at something the user can no longer read.
 */
export function useProjects(user, showToast) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      const list = await api.getProjects();
      setProjects(list || []);
      setCurrentProject((prev) =>
        prev && !list.some((p) => p.id === prev.id) ? null : prev
      );
    } catch (err) {
      console.warn('Failed to load projects:', err);
      showToast(err.message, 'error');
    }
  }, [user, showToast]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, loadProjects]);

  /** Appends a newly created project and selects it. */
  const addProject = useCallback((created) => {
    setProjects((prev) => [...prev, created]);
    setCurrentProject(created);
  }, []);

  return { projects, currentProject, setCurrentProject, loadProjects, addProject };
}