import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('techora_admin_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techora_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    const res = await apiAdminLogin(email, password);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('techora_admin_token', res.token);
      localStorage.setItem('techora_admin_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('techora_admin_token');
    localStorage.removeItem('techora_admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
