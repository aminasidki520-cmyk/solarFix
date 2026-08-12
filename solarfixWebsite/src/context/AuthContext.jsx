import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';

// 🚀 FIX ici : on ajoute 'export' pour qu'il soit importable
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token, username: returnedUsername, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username: returnedUsername, role }));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser({ username: returnedUsername, role });
      console.log("✅ [AuthContext] setUser executed successfully with:", { username: returnedUsername, role });
      return { username: returnedUsername, role };
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

