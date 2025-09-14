import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';

interface Transaction {
  id: string;
  senderID: string;
  receiverID: string;
  amount: number;
  type: string;
  walletNumber: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  createTransaction: (username: string, amount: number, reference: string) => Promise<any>;
  getTransaction: (transactionId: string) => Promise<Transaction>;
  verifyTransaction: (transactionId: string) => Promise<boolean>;
  clearError: () => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { fetchWallet } = useWallet();

  const createTransaction = async (username: string, amount: number, reference: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!username || !amount || amount <= 0) {
        throw new Error('Please provide valid recipient and amount');
      }

      const response = await api.createTransaction({
        username,
        amount,
        reference: reference || `Payment to ${username}`,
      });

      // Refresh wallet to get updated transaction history
      await fetchWallet();

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTransaction = async (transactionId: string): Promise<Transaction> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getTransaction(transactionId);
      // Handle dummy API response format
      const transData = response.transaction || response;

      const transaction: Transaction = {
        id: transData.id,
        senderID: transData.senderID || transData.userId || 'user_001',
        receiverID: transData.receiverID || transData.recieverID || transData.recipient || 'user_002',
        amount: transData.amount,
        type: transData.type || 'sent',
        walletNumber: transData.walletNumber || '12345678',
        reference: transData.reference,
        status: transData.status,
        timestamp: transData.timestamp || transData.date || new Date().toISOString(),
      };

      setCurrentTransaction(transaction);
      return transaction;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyTransaction = async (transactionId: string): Promise<boolean> => {
    try {
      const transaction = await getTransaction(transactionId);

      // Basic verification checks
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Check if transaction belongs to current user
      const isUserTransaction =
        transaction.senderID === user?.userId ||
        transaction.receiverID === user?.userId;

      if (!isUserTransaction) {
        throw new Error('This transaction does not belong to you');
      }

      // Additional verification logic can be added here
      // For example: checking signatures, verifying amounts, etc.

      return transaction.status === 'completed' || transaction.status === 'pending';
    } catch (error: any) {
      setError(error.message || 'Verification failed');
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    transactions,
    currentTransaction,
    loading,
    error,
    createTransaction,
    getTransaction,
    verifyTransaction,
    clearError,
    setCurrentTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};