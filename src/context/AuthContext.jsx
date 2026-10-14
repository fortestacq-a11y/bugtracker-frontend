import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, getStoredUser, setStoredAuth, clearStoredAuth } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  // Validate session on boot
  useEffect(() => {
    async function checkAuth() {
      const stored = getStoredToken();
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.getMe();
        setUser(me);
        setStoredAuth(stored, me);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        clearStoredAuth();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Listen for 401 events dispatched by client.js
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      clearStoredAuth();
    };

    window.addEventListener('bugtracker:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('bugtracker:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.accessToken);
    setUser(res.user);
    setStoredAuth(res.accessToken, res.user);
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    setToken(res.accessToken);
    setUser(res.user);
    setStoredAuth(res.accessToken, res.user);
    return res.user;
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
  };

  // Quick switch for demo testing
  const switchUser = async (email, password = 'password123') => {
    return await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
