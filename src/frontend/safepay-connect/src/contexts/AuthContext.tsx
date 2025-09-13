import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  userId: string;
  username: string;
  name: string;
  surname: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For production flow, always start with login
    // Uncomment the checkAuthStatus() call below to enable persistent login
    // checkAuthStatus();
    setLoading(false);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser && api.isAuthenticated()) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Demo mode: Accept any credentials for testing
      // In production, uncomment the API call below

      // const response = await api.login({ email, password });
      // const userData: User = {
      //   userId: response.userId,
      //   username: response.username,
      //   name: response.name,
      //   surname: response.surname,
      //   email: response.email,
      // };

      // Demo user for testing
      const userData: User = {
        userId: 'demo-user-123',
        username: email.split('@')[0],
        name: 'Demo',
        surname: 'User',
        email: email,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('authToken', 'demo-token-123');
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await api.register(userData);
      // After successful registration, redirect to login
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};