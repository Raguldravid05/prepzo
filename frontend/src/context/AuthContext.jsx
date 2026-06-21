import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, fetchUserProfile } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('prepzo_token');
    const savedUser = localStorage.getItem('prepzo_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('prepzo_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('prepzo_token', data.access_token);
      localStorage.setItem('prepzo_user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    setLoading(true);
    try {
      const data = await registerUser(fullName, email, password);
      localStorage.setItem('prepzo_token', data.access_token);
      localStorage.setItem('prepzo_user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('prepzo_token');
    localStorage.removeItem('prepzo_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await fetchUserProfile();
      localStorage.setItem('prepzo_user', JSON.stringify(profile));
      setUser(profile);
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
