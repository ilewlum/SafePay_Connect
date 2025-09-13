import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CreateWalletScreen = () => {
  const navigation = useNavigation<any>();
  const [provider, setProvider] = useState('');
  const [type, setType] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const walletProviders = ['FNB', 'Standard Bank', 'Capitec', 'Nedbank', 'ABSA'];
  const walletTypes = ['Savings', 'Cheque', 'Credit'];

  const handleCreateWallet = async () => {
    if (!provider || !type || !walletNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // API call will be implemented with integration
      // const response = await api.createWallet({ provider, type, walletNumber });
      Alert.alert('Success', 'Wallet creation will be connected to backend');
      // navigation.navigate('Wallet');
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet');
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
          <Text style={styles.title}>Create Wallet</Text>
          <Text style={styles.subtitle}>Add your payment method</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Select Provider</Text>
          <View style={styles.providerGrid}>
            {walletProviders.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.providerCard,
                  provider === item && styles.selectedCard
                ]}
                onPress={() => setProvider(item)}
              >
                <Ionicons
                  name="business"
                  size={24}
                  color={provider === item ? '#6C5CE7' : '#636E72'}
                />
                <Text style={[
                  styles.providerText,
                  provider === item && styles.selectedText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Account Type</Text>
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
                  type === item && styles.selectedTypeText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Wallet Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="wallet-outline" size={20} color="#636E72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter wallet/account number"
              placeholderTextColor="#B2BEC3"
              value={walletNumber}
              onChangeText={setWalletNumber}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>
              Your wallet information is encrypted and stored securely
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCreateWallet}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating Wallet...' : 'Create Wallet'}
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
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
    marginTop: 20,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  providerCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6C5CE7',
    backgroundColor: '#6C5CE710',
  },
  providerText: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 8,
    fontWeight: '500',
  },
  selectedText: {
    color: '#6C5CE7',
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
  selectedTypeText: {
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC410',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4ECDC4',
    marginLeft: 10,
  },
  createButton: {
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
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateWalletScreen;