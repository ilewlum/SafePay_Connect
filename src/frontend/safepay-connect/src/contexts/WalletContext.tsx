import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface Wallet {
  provider: string;
  type: string;
  walletNumber: string;
  transactions?: Transaction[];
}

interface Transaction {
  id: string;
  senderID: string;
  receiverID: string;
  amount: number;
  type: string;
  walletNumber: string;
  reference: string;
  status: string;
  timestamp: string;
}

interface WalletContextType {
  wallet: Wallet | null;
  loading: boolean;
  error: string | null;
  createWallet: (walletData: Omit<Wallet, 'transactions'>) => Promise<void>;
  fetchWallet: () => Promise<void>;
  updateWallet: (walletData: Partial<Wallet>) => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet();
    } else {
      setWallet(null);
    }
  }, [isAuthenticated]);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.viewWallet();
      // Handle dummy API response format
      const walletData = response.wallet || response;
      setWallet(walletData);
    } catch (error: any) {
      // If wallet doesn't exist, that's okay
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        setWallet(null);
      } else {
        setError(error.message || 'Failed to fetch wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (walletData: Omit<Wallet, 'transactions'>) => {
    setLoading(true);
    setError(null);
    try {
      await api.createWallet(walletData);
      // Fetch the wallet after creation to get full details
      await fetchWallet();
    } catch (error: any) {
      setError(error.message || 'Failed to create wallet');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWallet = async (walletData: Partial<Wallet>) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateWallet(walletData);
      // Fetch updated wallet
      await fetchWallet();
    } catch (error: any) {
      setError(error.message || 'Failed to update wallet');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    wallet,
    loading,
    error,
    createWallet,
    fetchWallet,
    updateWallet,
    clearError,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};