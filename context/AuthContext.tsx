import React, { createContext, useState, useContext, useEffect } from 'react';
import { Donor } from '../types';

interface AuthContextType {
  user: Donor | null;
  login: (user: Donor) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Donor | null>(null);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('bloodreach_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Donor) => {
    setUser(userData);
    localStorage.setItem('bloodreach_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodreach_user');
  };

  const isAdmin = user?.email === 'iyeasin44@gmail.com' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};