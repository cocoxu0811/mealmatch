import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  register: (email: string, name: string, preferences: UserPreferences) => void;
  updatePrivacySettings: (settings: { favoriteListPublic: boolean; wantToTryListPublic: boolean }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('fanda_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    // Mock login - in a real app, verify credentials
    // For now, we simulate a user based on the email
    const mockUser: User = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0], // Use part of email as name
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
    };
    setUser(mockUser);
    localStorage.setItem('fanda_user', JSON.stringify(mockUser));
  };

  const register = (email: string, name: string, preferences: UserPreferences) => {
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: name,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      preferences: preferences,
      privacySettings: {
        favoriteListPublic: true,
        wantToTryListPublic: true
      }
    };
    setUser(newUser);
    localStorage.setItem('fanda_user', JSON.stringify(newUser));
  };

  const updatePrivacySettings = (settings: { favoriteListPublic: boolean; wantToTryListPublic: boolean }) => {
    if (user) {
      const updatedUser = {
        ...user,
        privacySettings: settings
      };
      setUser(updatedUser);
      localStorage.setItem('fanda_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fanda_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updatePrivacySettings, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
