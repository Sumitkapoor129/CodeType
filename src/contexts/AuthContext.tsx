import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  addXP: (amount: number) => void;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        // Not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'https://codetype-production.up.railway.app/auth/google';
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const addXP = async (amount: number) => {
    if (user) {
        // Optimistic update
        const updatedUser = { ...user, xp: user.xp + amount };
        setUser(updatedUser);
        
        // Sync with backend
        try {
            await api.post('api/users/xp', { xp: amount });
        } catch (e) {
            console.error("Failed to sync XP", e);
        }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, addXP, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
