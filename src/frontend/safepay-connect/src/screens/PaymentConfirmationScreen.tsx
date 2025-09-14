import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface PaymentRequest {
  id: number;
  username: string;
  fullName: string;
  amount: string;
  reference: string;
  date: string;
  payShapId: string;
  bank: string;
}

export default function PaymentConfirmationScreen() {
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const paymentRequests: PaymentRequest[] = [
    {
      id: 1,
      username: '@john_doe',
      fullName: 'John Michael Doe',
      amount: 'R 250.00',
      reference: 'Lunch split',
      date: '2 minutes ago',
      payShapId: 'JD2024PYSHP',
      bank: 'Standard Bank',
    },
    {
      id: 2,
      username: '@sarah_m',
      fullName: 'Sarah Michelle Johnson',
      amount: 'R 1,200.00',
      reference: 'Rent contribution',
      date: '1 hour ago',
      payShapId: 'SJ2024PYSHP',
      bank: 'Standard Bank',
    },
    {
      id: 3,
      username: '@mike_wilson',
      fullName: 'Michael Robert Wilson',
      amount: 'R 450.00',
      reference: 'Movie tickets',
      date: '3 hours ago',
      payShapId: 'MW2024PYSHP',
      bank: 'Standard Bank',
    },
    {
      id: 4,
      username: '@emma_j',
      fullName: 'Emma Jane Thompson',
      amount: 'R 85.00',
      reference: 'Coffee',
      date: 'Yesterday',
      payShapId: 'ET2024PYSHP',
      bank: 'Standard Bank',
    },
  ];

  const handleRequestClick = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleAccept = () => {
    console.log('Accepted payment from:', selectedRequest?.username);
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const handleDecline = () => {
    console.log('Declined payment from:', selectedRequest?.username);
    setModalVisible(false);
    setSelectedRequest(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={60} color="#4ECDC4" />
          <Text style={styles.title}>Payment Confirmation</Text>
          <Text style={styles.subtitle}>Review and confirm payment requests</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Pending Requests</Text>
          
          {paymentRequests.map((request) => (
            <TouchableOpacity
              key={request.id}
              style={styles.requestCard}
              onPress={() => handleRequestClick(request)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {request.fullName.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.requestInfo}>
                <Text style={styles.requestUsername}>{request.username}</Text>
                <Text style={styles.requestReference}>{request.reference}</Text>
                <Text style={styles.requestDate}>{request.date}</Text>
              </View>
              
              <View style={styles.requestAmountContainer}>
                <Text style={styles.requestAmount}>{request.amount}</Text>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#636E72" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {selectedRequest?.fullName.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <Text style={styles.modalAmount}>{selectedRequest?.amount}</Text>
              <Text style={styles.modalReference}>{selectedRequest?.reference}</Text>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{selectedRequest?.fullName}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Type</Text>
                <Text style={styles.detailValue}>PayShap</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PayShap ID</Text>
                <Text style={styles.detailValue}>{selectedRequest?.payShapId}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bank</Text>
                <Text style={styles.detailValue}>{selectedRequest?.bank}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={handleDecline}
              >
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={handleAccept}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestInfo: {
    flex: 1,
  },
  requestUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 3,
  },
  requestReference: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 3,
  },
  requestDate: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  requestAmountContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginRight: 8,
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: 450,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalAvatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  modalReference: {
    fontSize: 16,
    color: '#636E72',
  },
  detailsSection: {
    backgroundColor: '#F7F9FC',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  declineButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  acceptButton: {
    backgroundColor: '#4ECDC4',
  },
  declineButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});