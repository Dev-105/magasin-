import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        if (response.data.success) {
          const userData = response.data.user;
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    if (response.data.success) {
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      return { success: true };
    }
    return { success: false, error: response.data.message };
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    if (response.data.success) {
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      return { success: true };
    }
    return { success: false, errors: response.data.errors };
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsAdmin(updatedUser.role === 'admin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};