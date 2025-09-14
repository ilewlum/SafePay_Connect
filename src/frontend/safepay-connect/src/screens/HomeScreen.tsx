import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  
  const recentTransactions = [
    { id: 1, merchant: 'Shoprite', amount: 'R 450.00', time: '2 hours ago', status: 'verified' },
    { id: 2, merchant: 'Vodacom Airtime', amount: 'R 50.00', time: '5 hours ago', status: 'verified' },
    { id: 3, merchant: 'Pick n Pay', amount: 'R 320.50', time: 'Yesterday', status: 'verified' },
  ];

  const trendingScams = [
    { id: 1, title: 'WhatsApp Job Scam', count: '234 reports today', severity: 'high' },
    { id: 2, title: 'Bank SMS Phishing', count: '189 reports today', severity: 'high' },
    { id: 3, title: 'Online Shopping Fraud', count: '156 reports today', severity: 'medium' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back, {user?.name || 'User'}!</Text>
              <Text style={styles.title}>SafePay Connect</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#2D3436" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color="#6C5CE7" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#6C5CE720' }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#6C5CE7" />
            </View>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Scams Detected</Text>
            <Text style={styles.statPeriod}>This month</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#6C5CE720' }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-done" size={24} color="#6C5CE7" />
            </View>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Safe Transactions</Text>
            <Text style={styles.statPeriod}>This month</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="cart-outline" size={20} color="#636E72" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
                <Text style={styles.transactionTime}>{transaction.time}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#4ECDC4" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.trendingScamsWidget}
          onPress={() => navigation.navigate('TrendingScams')}
          activeOpacity={0.9}
        >
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleContainer}>
              <Ionicons name="trending-up" size={24} color="#6C5CE7" />
              <Text style={styles.widgetTitle}>Trending Scams</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#636E72" />
          </View>
          
          <View style={styles.alertBanner}>
            <Ionicons name="alert-circle" size={16} color="#6C5CE7" />
            <Text style={styles.alertText}>3 new scam types detected today</Text>
          </View>

          {trendingScams.map((scam) => (
            <View key={scam.id} style={styles.scamPreviewItem}>
              <View style={[styles.severityIndicator, 
                { backgroundColor: scam.severity === 'high' ? '#6C5CE7' : '#4ECDC4' }]} 
              />
              <View style={styles.scamPreviewContent}>
                <Text style={styles.scamPreviewTitle}>{scam.title}</Text>
                <Text style={styles.scamPreviewCount}>{scam.count}</Text>
              </View>
              <Ionicons name="warning" size={16} color={scam.severity === 'high' ? '#6C5CE7' : '#4ECDC4'} />
            </View>
          ))}
          
          <View style={styles.widgetFooter}>
            <Text style={styles.widgetFooterText}>Tap to view all scam alerts</Text>
            <Ionicons name="arrow-forward" size={16} color="#4ECDC4" />
          </View>
        </TouchableOpacity>
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
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C5CE7',
  },
  logoutButton: {
    padding: 8,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
  },
  statPeriod: {
    fontSize: 10,
    color: '#B2BEC3',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  seeAll: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 11,
    color: '#4ECDC4',
    marginLeft: 4,
    fontWeight: '500',
  },
  trendingScamsWidget: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  widgetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 10,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  alertText: {
    fontSize: 12,
    color: '#6C5CE7',
    marginLeft: 6,
    fontWeight: '500',
  },
  scamPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  severityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  scamPreviewContent: {
    flex: 1,
  },
  scamPreviewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
    marginBottom: 2,
  },
  scamPreviewCount: {
    fontSize: 12,
    color: '#636E72',
  },
  widgetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  widgetFooterText: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: '500',
    marginRight: 6,
  },
});

export default HomeScreen;