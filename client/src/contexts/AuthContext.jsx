import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const initAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response && response.user) {
        setUser(response.user);
        setProfile(response.user.profile || null);
      }
    } catch (err) {
      console.warn('Authentication session restoration ended:', err.message);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      const accessToken = res.session?.access_token || 'mock_dev_token';
      localStorage.setItem('auth_token', accessToken);
      setToken(accessToken);
      setUser(res.user);
      setProfile(res.user.profile || null);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ email, password, full_name, phone }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register({ email, password, full_name, phone });
      if (res.session?.access_token) {
        localStorage.setItem('auth_token', res.session.access_token);
        setToken(res.session.access_token);
        setUser(res.user);
        setProfile(res.user.profile || null);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout().catch(() => {});
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(email);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.resetPassword(password);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: profile?.role === 'admin',
    isLoading,
    error,
    clearError,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
