import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentRequestScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  const recentRequests = [
    { id: 1, recipient: '@john_doe', amount: 'R 250.00', reference: 'Lunch split', status: 'pending', date: '2 hours ago' },
    { id: 2, recipient: '@sarah_m', amount: 'R 1,200.00', reference: 'Rent contribution', status: 'completed', date: 'Yesterday' },
    { id: 3, recipient: '@mike_wilson', amount: 'R 450.00', reference: 'Movie tickets', status: 'declined', date: '3 days ago' },
    { id: 4, recipient: '@emma_j', amount: 'R 85.00', reference: 'Coffee', status: 'completed', date: '5 days ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4ECDC4';
      case 'pending': return '#FFA94D';
      case 'declined': return '#FF6B6B';
      default: return '#636E72';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'declined': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const handleSendRequest = () => {
    // Handle send request logic
    console.log('Sending request:', { recipient, amount, reference });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="cash-outline" size={60} color="#6C5CE7" />
          <Text style={styles.title}>Payment Request</Text>
          <Text style={styles.subtitle}>Send payment requests securely</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#B2BEC3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="@username"
                placeholderTextColor="#B2BEC3"
                value={recipient}
                onChangeText={setRecipient}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (ZAR)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>R</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#B2BEC3"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={20} color="#B2BEC3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Reason for request"
                placeholderTextColor="#B2BEC3"
                value={reference}
                onChangeText={setReference}
                maxLength={50}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendRequest}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={22} color="white" />
            <Text style={styles.sendButtonText}>Send Request</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Payment Requests</Text>
          
          {recentRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestLeft}>
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{request.recipient}</Text>
                  <Text style={styles.requestReference}>{request.reference}</Text>
                  <Text style={styles.requestDate}>{request.date}</Text>
                </View>
              </View>
              
              <View style={styles.requestRight}>
                <Text style={styles.requestAmount}>{request.amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}20` }]}>
                  <Ionicons 
                    name={getStatusIcon(request.status) as any} 
                    size={14} 
                    color={getStatusColor(request.status)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                    {request.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 5,
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: '#2D3436',
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  requestLeft: {
    flex: 1,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  requestReference: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  requestRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
});