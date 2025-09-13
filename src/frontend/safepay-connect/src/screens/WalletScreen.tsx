import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function WalletScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [username] = useState('@john_doe'); // Username is read-only
  const [fullName, setFullName] = useState('John Michael Doe');
  const [paymentType, setPaymentType] = useState('PayShap');
  const [bank, setBank] = useState('Standard Bank');
  const [accountIdentifier, setAccountIdentifier] = useState('JD2024PYSHP');
  
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  const paymentTypes = ['PayShap', 'Cash Send', 'Account Transfer'];
  const banks = ['Standard Bank', 'Nedbank', 'Capitec', 'FNB', 'ABSA', 'Discovery Bank', 'TymeBank'];

  const copyUsername = async () => {
    await Clipboard.setStringAsync(username);
    Alert.alert('Copied!', 'Username copied to clipboard', [{ text: 'OK' }]);
  };

  const handleSave = () => {
    console.log('Saving details:', { fullName, paymentType, bank, accountIdentifier });
    setIsEditing(false);
  };

  const getAccountLabel = () => {
    switch(paymentType) {
      case 'PayShap':
        return 'PayShap ID';
      case 'Cash Send':
        return 'Phone Number';
      case 'Account Transfer':
        return 'Account Number';
      default:
        return 'Identifier';
    }
  };

  const getAccountPlaceholder = () => {
    switch(paymentType) {
      case 'PayShap':
        return 'Enter PayShap ID';
      case 'Cash Send':
        return 'Enter phone number';
      case 'Account Transfer':
        return 'Enter account number';
      default:
        return 'Enter identifier';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="wallet" size={60} color="#6C5CE7" />
          <Text style={styles.title}>My Wallet</Text>
          <Text style={styles.subtitle}>Manage your payment details</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {fullName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "close" : "create-outline"} 
                size={24} 
                color="#6C5CE7" 
              />
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>Username</Text>
              <TouchableOpacity 
                style={styles.usernameContainer}
                onPress={copyUsername}
                activeOpacity={0.7}
              >
                <Text style={styles.usernameText}>{username}</Text>
                <Ionicons name="copy-outline" size={20} color="#6C5CE7" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#B2BEC3"
                />
              ) : (
                <Text style={styles.detailValue}>{fullName}</Text>
              )}
            </View>

            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>Payment Type</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.selector}
                  onPress={() => setShowPaymentTypeModal(true)}
                >
                  <Text style={styles.selectorText}>{paymentType}</Text>
                  <Ionicons name="chevron-down" size={20} color="#636E72" />
                </TouchableOpacity>
              ) : (
                <Text style={styles.detailValue}>{paymentType}</Text>
              )}
            </View>

            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>Bank</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.selector}
                  onPress={() => setShowBankModal(true)}
                >
                  <Text style={styles.selectorText}>{bank}</Text>
                  <Ionicons name="chevron-down" size={20} color="#636E72" />
                </TouchableOpacity>
              ) : (
                <Text style={styles.detailValue}>{bank}</Text>
              )}
            </View>

            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>{getAccountLabel()}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={accountIdentifier}
                  onChangeText={setAccountIdentifier}
                  placeholder={getAccountPlaceholder()}
                  placeholderTextColor="#B2BEC3"
                />
              ) : (
                <Text style={styles.detailValue}>{accountIdentifier}</Text>
              )}
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Type Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPaymentTypeModal}
          onRequestClose={() => setShowPaymentTypeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Payment Type</Text>
              {paymentTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalOption}
                  onPress={() => {
                    setPaymentType(type);
                    setShowPaymentTypeModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{type}</Text>
                  {paymentType === type && (
                    <Ionicons name="checkmark" size={20} color="#4ECDC4" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Bank Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showBankModal}
          onRequestClose={() => setShowBankModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <ScrollView style={styles.modalScroll}>
                {banks.map((bankOption) => (
                  <TouchableOpacity
                    key={bankOption}
                    style={styles.modalOption}
                    onPress={() => {
                      setBank(bankOption);
                      setShowBankModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{bankOption}</Text>
                    {bank === bankOption && (
                      <Ionicons name="checkmark" size={20} color="#4ECDC4" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  profileSection: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE720',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailGroup: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#E8E2FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6C5CE720',
  },
  usernameText: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  selectorText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
});