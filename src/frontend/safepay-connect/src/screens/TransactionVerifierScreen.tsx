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

const TransactionVerifierScreen = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reference, setReference] = useState('');
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

  const initiateVerification = () => {
    if (!amount || !recipient) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const code = generateVerificationCode();
    setShowQR(true);
    
    // Simulate adding to blockchain/ledger
    setTimeout(() => {
      Alert.alert(
        'Transaction Secured',
        `Verification code: ${code}\n\nShare this code with the recipient to complete the transaction.`,
        [{ text: 'OK', onPress: () => setShowQR(false) }]
      );
    }, 1000);
  };

  const verifyTransaction = () => {
    Alert.alert(
      'Verify Transaction',
      'Enter the verification code from the sender',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Verify',
          onPress: () => {
            Alert.alert('Success', 'Transaction verified successfully!');
            const newTransaction = {
              id: transactionHistory.length + 1,
              recipient: recipient || 'New Transaction',
              amount: `R ${amount || '0'}`,
              status: 'verified',
              date: new Date().toISOString().split('T')[0],
            };
            setTransactionHistory([newTransaction, ...transactionHistory]);
            setAmount('');
            setRecipient('');
            setReference('');
          },
        },
      ],
    );
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
          <Text style={styles.sectionTitle}>New Transaction</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (R)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient</Text>
            <TextInput
              style={styles.input}
              placeholder="Name or Phone Number"
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Payment reference"
              value={reference}
              onChangeText={setReference}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={initiateVerification}
            >
              <Ionicons name="qr-code" size={20} color="white" />
              <Text style={styles.buttonText}>Generate QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={verifyTransaction}
            >
              <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
              <Text style={[styles.buttonText, { color: '#4ECDC4' }]}>Verify Code</Text>
            </TouchableOpacity>
          </View>
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