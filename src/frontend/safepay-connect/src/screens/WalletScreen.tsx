import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const { wallet, loading, error, fetchWallet, clearError } = useWallet();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchWallet();
    setRefreshing(false);
  }, []);

  const handleCreateWallet = () => {
    navigation.navigate('CreateWallet');
  };

  const handleUpdateWallet = () => {
    navigation.navigate('UpdateWallet');
  };

  const formatWalletNumber = (number: string) => {
    // Format as XXXX-XXXX-XXXX-XXXX for card numbers
    if (number.length >= 12) {
      return number.replace(/(.{4})/g, '$1-').replace(/-$/, '');
    }
    return number;
  };

  const getWalletIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'credit card':
        return 'card';
      case 'debit card':
        return 'card-outline';
      case 'savings':
        return 'cash';
      case 'cheque':
        return 'newspaper';
      default:
        return 'wallet';
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C5CE7" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!wallet) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ionicons name="wallet-outline" size={80} color="#B2BEC3" />
          <Text style={styles.emptyTitle}>No Wallet Found</Text>
          <Text style={styles.emptySubtitle}>
            Create a wallet to start making secure payments
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateWallet}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.createButtonText}>Create Wallet</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Ionicons name="wallet" size={60} color="#6C5CE7" />
          <Text style={styles.title}>My Wallet</Text>
          <Text style={styles.subtitle}>Manage your payment details</Text>
        </View>

        <View style={styles.walletCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons
                name={getWalletIcon(wallet.type)}
                size={32}
                color="#6C5CE7"
              />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleUpdateWallet}>
              <Ionicons name="create-outline" size={20} color="#6C5CE7" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider</Text>
              <Text style={styles.detailValue}>{wallet.provider}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Type</Text>
              <Text style={styles.detailValue}>{wallet.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <Text style={styles.detailValueMono}>
                {formatWalletNumber(wallet.walletNumber)}
              </Text>
            </View>

            {user && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Holder</Text>
                <Text style={styles.detailValue}>
                  {user.name} {user.surname}
                </Text>
              </View>
            )}
          </View>
        </View>

        {wallet.transactions && wallet.transactions.length > 0 && (
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {wallet.transactions.slice(0, 5).map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id || index}
                style={styles.transactionItem}
                onPress={() =>
                  navigation.navigate('TransactionDetail', {
                    transactionId: transaction.id,
                  })
                }
              >
                <View style={styles.transactionIcon}>
                  <Ionicons
                    name={
                      transaction.senderID === user?.userId
                        ? 'arrow-up-circle'
                        : 'arrow-down-circle'
                    }
                    size={24}
                    color={
                      transaction.senderID === user?.userId ? '#FF6B6B' : '#4ECDC4'
                    }
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>
                    {transaction.reference || 'Payment'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.senderID === user?.userId
                      ? styles.amountDebit
                      : styles.amountCredit,
                  ]}
                >
                  {transaction.senderID === user?.userId ? '-' : '+'}R
                  {transaction.amount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PaymentRequest')}
          >
            <Ionicons name="send" size={24} color="#6C5CE7" />
            <Text style={styles.actionButtonText}>Send Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('TransactionVerifier')}
          >
            <Ionicons name="shield-checkmark" size={24} color="#6C5CE7" />
            <Text style={styles.actionButtonText}>Verify Transaction</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#636E72',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  walletCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7F9FC',
  },
  editButtonText: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  cardBody: {
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FC',
  },
  detailLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  detailValue: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
  },
  detailValueMono: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  transactionsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  transactionDate: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountDebit: {
    color: '#FF6B6B',
  },
  amountCredit: {
    color: '#4ECDC4',
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6C5CE7',
  },
});