/**
 * Central fetch wrapper for the bug tracker API.
 * - Injects Authorization: Bearer <token>
 * - Intercepts 401 (Unauthenticated) -> clears token, emits auth event
 * - Throws descriptive Error objects on 403 / 404 / 409 / 422 / 500
 */

const TOKEN_KEY = 'bugtracker_jwt_token';
const USER_KEY = 'bugtracker_user_info';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiFetch(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 204 No Content
  if (res.status === 204) {
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      clearStoredAuth();
      window.dispatchEvent(new CustomEvent('bugtracker:unauthorized'));
    }
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// API methods
export const api = {
  // Auth
  login: (email, password) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getMe: () => apiFetch('/api/auth/me'),

  // Projects
  getProjects: () => apiFetch('/api/projects'),
  getProject: (id) => apiFetch(`/api/projects/${id}`),
  createProject: (data) => apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => apiFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => apiFetch(`/api/projects/${id}`, { method: 'DELETE' }),

  // Project Members
  getMembers: (projectId) => apiFetch(`/api/projects/${projectId}/members`),
  getCandidates: (projectId) => apiFetch(`/api/projects/${projectId}/members/candidates`),
  addMember: (projectId, userId, role) => apiFetch(`/api/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify({ userId, role }) }),
  updateMemberRole: (projectId, userId, role) => apiFetch(`/api/projects/${projectId}/members/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  removeMember: (projectId, userId) => apiFetch(`/api/projects/${projectId}/members/${userId}`, { method: 'DELETE' }),

  // Issues
  getIssues: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return apiFetch(`/api/issues${qs ? `?${qs}` : ''}`);
  },
  getIssue: (id) => apiFetch(`/api/issues/${id}`),
  createIssue: (data) => apiFetch('/api/issues', { method: 'POST', body: JSON.stringify(data) }),
  updateIssue: (id, data) => apiFetch(`/api/issues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateIssueStatus: (id, status) => apiFetch(`/api/issues/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteIssue: (id) => apiFetch(`/api/issues/${id}`, { method: 'DELETE' }),

  // Comments
  getComments: (issueId) => apiFetch(`/api/issues/${issueId}/comments`),
  addComment: (issueId, body) => apiFetch(`/api/issues/${issueId}/comments`, { method: 'POST', body: JSON.stringify({ body }) }),

  // Stats
  getStats: () => apiFetch('/api/stats'),

  // Users
  getUserProjects: (id) => apiFetch(`/api/users/${id}/projects`),
  updateUserProfile: (id, data) => apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
