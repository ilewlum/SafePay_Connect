import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransaction } from '../contexts/TransactionContext';
import { useWallet } from '../contexts/WalletContext';

const TransactionVerifierScreen = () => {
  const { verifyTransaction, getTransaction } = useTransaction();
  const { wallet } = useWallet();
  const [transactionId, setTransactionId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [verifiedTransaction, setVerifiedTransaction] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([
    { id: 1, recipient: 'John Doe', amount: 'R 500', status: 'verified', date: '2025-01-09' },
    { id: 2, recipient: 'Grocery Store', amount: 'R 1,200', status: 'verified', date: '2025-01-08' },
    { id: 3, recipient: 'Unknown Number', amount: 'R 2,000', status: 'blocked', date: '2025-01-07' },
  ]);

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
    return code;
  };

  const handleVerifyTransaction = async () => {
    if (!transactionId) {
      Alert.alert('Error', 'Please enter a transaction ID to verify');
      return;
    }

    setVerificationStatus('verifying');
    try {
      // Verify the transaction
      const isValid = await verifyTransaction(transactionId);

      if (isValid) {
        // Get full transaction details
        const transaction = await getTransaction(transactionId);
        setVerifiedTransaction(transaction);
        setVerificationStatus('verified');

        Alert.alert(
          'Transaction Verified!',
          `Transaction ID: ${transactionId}\nAmount: R${transaction.amount.toFixed(2)}\nStatus: ${transaction.status}`,
          [{ text: 'OK' }]
        );
      } else {
        setVerificationStatus('failed');
        Alert.alert(
          'Verification Failed',
          'This transaction could not be verified. It may not exist or may not belong to you.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      setVerificationStatus('failed');
      Alert.alert(
        'Verification Error',
        error.message || 'Unable to verify transaction. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getVerificationIcon = (status: 'idle' | 'verifying' | 'verified' | 'failed') => {
    switch (status) {
      case 'verified':
        return { name: 'checkmark-circle', color: '#4ECDC4' };
      case 'failed':
        return { name: 'close-circle', color: '#FF6B6B' };
      case 'verifying':
        return { name: 'time', color: '#FFA94D' };
      default:
        return { name: 'shield-checkmark', color: '#6C5CE7' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={40} color="#4ECDC4" />
          <Text style={styles.title}>Transaction Verifier</Text>
          <Text style={styles.subtitle}>Secure your transactions with verification</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Verify Transaction</Text>

          <View style={styles.verificationCard}>
            <Ionicons
              name={getVerificationIcon(verificationStatus).name as any}
              size={48}
              color={getVerificationIcon(verificationStatus).color}
              style={styles.statusIcon}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Transaction ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter transaction ID"
                value={transactionId}
                onChangeText={setTransactionId}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleVerifyTransaction}
              disabled={verificationStatus === 'verifying'}
            >
              {verificationStatus === 'verifying' ? (
                <>
                  <Ionicons name="time" size={20} color="white" />
                  <Text style={styles.buttonText}>Verifying...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="shield-checkmark" size={20} color="white" />
                  <Text style={styles.buttonText}>Verify Transaction</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {verifiedTransaction && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Transaction Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={styles.detailValue}>R {verifiedTransaction.amount?.toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference:</Text>
                <Text style={styles.detailValue}>{verifiedTransaction.reference}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: getVerificationIcon(verificationStatus).color }]}>
                  {verifiedTransaction.status}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {transactionHistory.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Ionicons
                  name={transaction.status === 'verified' ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={transaction.status === 'verified' ? '#51CF66' : '#FF6B6B'}
                />
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionRecipient}>{transaction.recipient}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                <Text style={[
                  styles.transactionStatus,
                  { color: transaction.status === 'verified' ? '#51CF66' : '#FF6B6B' }
                ]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Modal
          visible={showQR}
          transparent
          animationType="slide"
          onRequestClose={() => setShowQR(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowQR(false)}
              >
                <Ionicons name="close" size={24} color="#636E72" />
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>Transaction QR Code</Text>
              
              <View style={styles.qrContainer}>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code" size={150} color="#4ECDC4" />
                </View>
              </View>
              
              <Text style={styles.verificationCodeLabel}>Verification Code:</Text>
              <Text style={styles.verificationCodeText}>{verificationCode}</Text>
              
              <Text style={styles.modalInstructions}>
                Share this QR code or verification code with the recipient to complete the transaction securely.
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4ECDC4',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  historyContainer: {
    margin: 20,
    marginTop: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionDetails: {
    gap: 2,
  },
  transactionRecipient: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  transactionDate: {
    fontSize: 12,
    color: '#636E72',
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  verificationCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusIcon: {
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationCodeLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 5,
  },
  verificationCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 20,
  },
  modalInstructions: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TransactionVerifierScreen;