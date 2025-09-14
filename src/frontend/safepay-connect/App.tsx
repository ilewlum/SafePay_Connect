import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { WalletProvider } from './src/contexts/WalletContext';
import { TransactionProvider } from './src/contexts/TransactionContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WalletProvider>
          <TransactionProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </TransactionProvider>
        </WalletProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
