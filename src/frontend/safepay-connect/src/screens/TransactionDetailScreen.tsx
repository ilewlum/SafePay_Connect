import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTransaction } from '../contexts/TransactionContext';
import { useAuth } from '../contexts/AuthContext';

interface TransactionData {
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

const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getTransaction, currentTransaction } = useTransaction();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    setLoading(true);
    try {
      const transactionId = route.params?.transactionId;

      if (!transactionId) {
        throw new Error('No transaction ID provided');
      }

      const transactionData = await getTransaction(transactionId);
      setTransaction(transactionData);
    } catch (error) {
      console.error('Failed to load transaction:', error);
      // If we can't load the transaction, show error state
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const isUserSender = transaction?.senderID === user?.userId;
  const transactionType = isUserSender ? 'Sent' : 'Received';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4ECDC4';
      case 'pending':
        return '#F39C12';
      case 'failed':
        return '#E74C3C';
      default:
        return '#636E72';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C5CE7" />
          <Text style={styles.loadingText}>Loading transaction...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#E74C3C" />
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.title}>Transaction Details</Text>
        </View>

        <View style={styles.statusCard}>
          <Ionicons
            name={getStatusIcon(transaction.status)}
            size={48}
            color={getStatusColor(transaction.status)}
          />
          <Text style={styles.statusText}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Text>
          <Text style={styles.amountText}>R {Number(transaction.amount)?.toFixed(2) ?? 0.00}</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transaction.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {new Date(transaction.timestamp).toLocaleString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Type</Text>
            <Text style={styles.detailValue}>{transaction.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wallet Number</Text>
            <Text style={styles.detailValue}>{transaction.walletNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference</Text>
            <Text style={styles.detailValue}>{transaction.reference}</Text>
          </View>
        </View>

        <View style={styles.partiesCard}>
          <Text style={styles.sectionTitle}>Transaction Parties</Text>

          <View style={styles.partyRow}>
            <View style={styles.partyIcon}>
              <Ionicons name="arrow-up" size={20} color="#E74C3C" />
            </View>
            <View style={styles.partyInfo}>
              <Text style={styles.partyLabel}>From</Text>
              <Text style={styles.partyValue}>User {transaction.senderID}</Text>
            </View>
          </View>

          <View style={styles.partyRow}>
            <View style={[styles.partyIcon, { backgroundColor: '#4ECDC410' }]}>
              <Ionicons name="arrow-down" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.partyInfo}>
              <Text style={styles.partyLabel}>To</Text>
              <Text style={styles.partyValue}>User {transaction.receiverID}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color="#6C5CE7" />
            <Text style={styles.actionButtonText}>Download Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Ionicons name="share-outline" size={20} color="#636E72" />
            <Text style={[styles.actionButtonText, { color: '#636E72' }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#636E72',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#E74C3C',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  statusCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 10,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
  },
  detailsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
  },
  partiesCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E74C3C10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  partyInfo: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  partyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});

export default TransactionDetailScreen;