import React, { createContext, useMemo, useState, useEffect } from 'react';
import { AuthResponse, User } from '../types';
import { setAuthToken } from '../services/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = localStorage.getItem('user');
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored) as User;
  } catch (error) {
    console.error('Failed to parse stored user', error);
    return null;
  }
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const signIn = (data: AuthResponse) => {
    setAuthToken(data.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    setUser(data.user);
  };

  const signOut = () => {
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


