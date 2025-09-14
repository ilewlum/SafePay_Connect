import React, { useState, useEffect } from 'react';
import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity, ScrollView,
  Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';

const UpdateWalletScreen = () => {
  const navigation = useNavigation<any>();
  const { wallet, updateWallet } = useWallet();
  const [provider, setProvider] = useState(wallet?.provider || 'FNB');
  const [type, setType] = useState(wallet?.type || 'Savings');
  const [walletNumber, setWalletNumber] = useState(wallet?.walletNumber || '');
  const [loading, setLoading] = useState(false);

  const walletProviders = ['FNB', 'Standard Bank', 'Capitec', 'Nedbank', 'ABSA'];
  const walletTypes = ['Savings', 'CashSend', 'paySharp', 'E-wallet'];

  useEffect(() => {
    // Load existing wallet data when wallet changes
    if (wallet) {
      setProvider(wallet.provider);
      setType(wallet.type);
      setWalletNumber(wallet.walletNumber);
    }
  }, [wallet]);

  const handleUpdateWallet = async () => {
    if (!provider || !type || !walletNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!wallet) {
      Alert.alert('Error', 'No wallet found to update');
      navigation.navigate('CreateWallet');
      return;
    }

    // Check if anything has changed
    if (
      provider === wallet.provider &&
      type === wallet.type &&
      walletNumber === wallet.walletNumber
    ) {
      Alert.alert('No Changes', 'No changes were made to your wallet');
      return;
    }

    // Validate wallet number
    if (walletNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid account/card number');
      return;
    }

    setLoading(true);
    try {
      await updateWallet({ provider, type, walletNumber });

      Alert.alert(
        'Success!',
        'Your wallet has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Wallet'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Failed to Update Wallet',
        error.message || 'Unable to update wallet. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Update Wallet</Text>
          <Text style={styles.subtitle}>Modify your payment details</Text>
        </View>

        <View style={styles.currentWalletCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet" size={24} color="#6C5CE7" />
            <Text style={styles.cardTitle}>Current Wallet</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Provider:</Text>
              <Text style={styles.cardValue}>{provider}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Type:</Text>
              <Text style={styles.cardValue}>{type}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Number:</Text>
              <Text style={styles.cardValue}>****{walletNumber.slice(-4) || '0000'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Update Provider</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.providerRow}>
              {walletProviders.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.providerButton,
                    provider === item && styles.selectedProviderButton
                  ]}
                  onPress={() => setProvider(item)}
                >
                  <Text style={[
                    styles.providerButtonText,
                    provider === item && styles.selectedText
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.label}>Update Type</Text>
          <View style={styles.typeRow}>
            {walletTypes.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.typeButton,
                  type === item && styles.selectedTypeButton
                ]}
                onPress={() => setType(item)}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === item && styles.selectedText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Update Wallet Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="wallet-outline" size={20} color="#636E72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter new wallet number"
              placeholderTextColor="#B2BEC3"
              value={walletNumber}
              onChangeText={setWalletNumber}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, loading && styles.disabledButton]}
            onPress={handleUpdateWallet}
            disabled={loading}
          >
            <Text style={styles.updateButtonText}>
              {loading ? 'Updating...' : 'Update Wallet'}
            </Text>
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
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  currentWalletCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 10,
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
    marginTop: 20,
  },
  providerRow: {
    flexDirection: 'row',
  },
  providerButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProviderButton: {
    borderColor: '#6C5CE7',
    backgroundColor: '#6C5CE710',
  },
  providerButtonText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTypeButton: {
    borderColor: '#6C5CE7',
    backgroundColor: '#6C5CE710',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  selectedText: {
    color: '#6C5CE7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
  },
  updateButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdateWalletScreen;