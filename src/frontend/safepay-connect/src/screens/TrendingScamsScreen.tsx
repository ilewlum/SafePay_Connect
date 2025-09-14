import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TrendingScamsScreen() {
  const navigation = useNavigation();
  const scams = [
    {
      id: 1,
      title: 'WhatsApp Job Offers',
      description: 'Scammers pose as recruiters offering high-paying work-from-home jobs, asking for upfront payments or personal information.',
      prevention: 'Never pay for a job opportunity. Verify companies directly through official websites.',
    },
    {
      id: 2,
      title: 'Bank Account Suspension SMS',
      description: 'Fake messages claim your account is suspended with links to phishing sites that steal login credentials.',
      prevention: 'Banks never send links via SMS. Always log in through official banking apps.',
    },
    {
      id: 3,
      title: 'Fake Online Stores',
      description: 'Websites mimic legitimate retailers with too-good-to-be-true prices, taking payment without delivering products.',
      prevention: 'Check for secure HTTPS, read reviews, and use payment methods with buyer protection.',
    },
    {
      id: 4,
      title: 'Cryptocurrency Investment Schemes',
      description: 'Ponzi schemes promise guaranteed high returns on crypto investments, using new investors money to pay earlier ones.',
      prevention: 'Be wary of guaranteed returns. Research investment platforms thoroughly.',
    },
    {
      id: 5,
      title: 'Romance Scams',
      description: 'Fake profiles build emotional relationships then request money for emergencies or travel expenses.',
      prevention: 'Never send money to someone you haven\'t met in person. Video call to verify identity.',
    },
    {
      id: 6,
      title: 'SARS Tax Refund Scam',
      description: 'Emails claim you have a tax refund, requesting banking details through fake government websites.',
      prevention: 'SARS only communicates through eFiling. Never click email links for tax matters.',
    },
    {
      id: 7,
      title: 'Utility Bill Scams',
      description: 'Threats of immediate disconnection unless you make urgent payments through unofficial channels.',
      prevention: 'Verify directly with utility providers. Use only official payment methods.',
    },
    {
      id: 8,
      title: 'Lottery Winner Notifications',
      description: 'Messages claiming you won a lottery you never entered, asking for fees to release winnings.',
      prevention: 'You can\'t win a lottery you didn\'t enter. Legitimate lotteries don\'t charge to claim prizes.',
    },
  ];

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
          <Ionicons name="trending-up" size={40} color="#6C5CE7" />
          <Text style={styles.title}>Trending Scams</Text>
          <Text style={styles.subtitle}>Stay informed and protected</Text>
        </View>

        <View style={styles.content}>
          {scams.map((scam) => (
            <View key={scam.id} style={styles.scamCard}>
              <Text style={styles.scamTitle}>{scam.title}</Text>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="information-circle-outline" size={16} color="#636E72" />
                  <Text style={styles.sectionTitle}>How it works</Text>
                </View>
                <Text style={styles.description}>{scam.description}</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#4ECDC4" />
                  <Text style={[styles.sectionTitle, { color: '#4ECDC4' }]}>How to avoid</Text>
                </View>
                <Text style={styles.prevention}>{scam.prevention}</Text>
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
    paddingBottom: 25,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  scamCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  scamTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  prevention: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
    fontWeight: '500',
  },
});