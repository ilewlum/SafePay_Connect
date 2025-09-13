import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VoiceSupportScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
    { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'st', name: 'Sesotho', flag: '🇿🇦' },
    { code: 'tn', name: 'Setswana', flag: '🇿🇦' },
  ];

  const sampleTransactions = [
    {
      id: 1,
      type: 'alert',
      message: 'Payment request from unknown number detected',
      amount: 'R 1,500',
    },
    {
      id: 2,
      type: 'success',
      message: 'Transaction verified successfully',
      amount: 'R 500',
    },
    {
      id: 3,
      type: 'warning',
      message: 'Suspicious link detected in message',
      amount: 'N/A',
    },
  ];

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recording
    setTimeout(() => {
      setTranscript('Show me my recent transactions');
      setIsListening(false);
      Alert.alert('Voice Command', 'Command: "Show me my recent transactions"');
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const playAudio = (message: string) => {
    setIsPlaying(true);
    Alert.alert(
      'Voice Playback',
      `Playing in ${languages.find(l => l.code === selectedLanguage)?.name}: "${message}"`,
      [{ text: 'OK', onPress: () => setIsPlaying(false) }]
    );
  };

  const translateMessage = (message: string) => {
    // Simulated translation
    const translations: any = {
      zu: 'Isicelo sokukhokha esivela kunombolo ongaziwa sitholakele',
      xh: 'Isicelo sentlawulo esivela kwinombolo engaziwayo sifunyenwe',
      af: 'Betalingsversoek van onbekende nommer opgespoor',
      st: 'Kopo ya tefo e tsoang ho nomoro e sa tsebahaleng e fumanoe',
      tn: 'Kopo ya tuelo go tswa mo nomorong e e sa itsiweng e bonwe',
    };
    
    return selectedLanguage === 'en' ? message : translations[selectedLanguage] || message;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="mic" size={40} color="#45B7D1" />
          <Text style={styles.title}>Voice Support</Text>
          <Text style={styles.subtitle}>Multi-language transaction assistance</Text>
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Select Language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageCard,
                    selectedLanguage === lang.code && styles.languageCardActive
                  ]}
                  onPress={() => setSelectedLanguage(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === lang.code && styles.languageNameActive
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.voiceControlSection}>
          <Text style={styles.sectionTitle}>Voice Commands</Text>
          
          <TouchableOpacity
            style={[
              styles.micButton,
              isListening && styles.micButtonActive
            ]}
            onPress={isListening ? stopListening : startListening}
          >
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={60}
              color={isListening ? 'white' : '#45B7D1'}
            />
          </TouchableOpacity>
          
          <Text style={styles.listeningText}>
            {isListening ? 'Listening...' : 'Tap to speak'}
          </Text>

          {transcript !== '' && (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptLabel}>You said:</Text>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          )}
        </View>

        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          
          {sampleTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Ionicons
                  name={
                    transaction.type === 'alert' ? 'alert-circle' :
                    transaction.type === 'success' ? 'checkmark-circle' :
                    'warning'
                  }
                  size={24}
                  color={
                    transaction.type === 'alert' ? '#FF6B6B' :
                    transaction.type === 'success' ? '#51CF66' :
                    '#FFB84D'
                  }
                />
                <Text style={styles.alertAmount}>{transaction.amount}</Text>
              </View>
              
              <Text style={styles.alertMessage}>
                {translateMessage(transaction.message)}
              </Text>
              
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playAudio(transaction.message)}
                disabled={isPlaying}
              >
                <Ionicons name="volume-high" size={20} color="#45B7D1" />
                <Text style={styles.playButtonText}>
                  {isPlaying ? 'Playing...' : 'Play Audio'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Voice Features</Text>
          
          <View style={styles.featureCard}>
            <Ionicons name="language" size={24} color="#45B7D1" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Auto-Translation</Text>
              <Text style={styles.featureDescription}>
                Automatically translates alerts to your preferred language
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Ionicons name="notifications" size={24} color="#45B7D1" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Voice Alerts</Text>
              <Text style={styles.featureDescription}>
                Receive transaction alerts as voice messages
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Ionicons name="shield-checkmark" size={24} color="#45B7D1" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Scam Warnings</Text>
              <Text style={styles.featureDescription}>
                Voice warnings for potential scams in your language
              </Text>
            </View>
          </View>
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
  languageSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  languageList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  languageCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardActive: {
    borderColor: '#45B7D1',
    backgroundColor: '#E8F4F8',
  },
  languageFlag: {
    fontSize: 30,
    marginBottom: 5,
  },
  languageName: {
    fontSize: 12,
    color: '#636E72',
  },
  languageNameActive: {
    color: '#45B7D1',
    fontWeight: '600',
  },
  voiceControlSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  micButtonActive: {
    backgroundColor: '#45B7D1',
  },
  listeningText: {
    fontSize: 16,
    color: '#636E72',
  },
  transcriptBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
  },
  transcriptLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 5,
  },
  transcriptText: {
    fontSize: 16,
    color: '#2D3436',
  },
  alertsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  alertMessage: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 10,
    lineHeight: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontSize: 14,
    color: '#45B7D1',
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    gap: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#636E72',
  },
});

export default VoiceSupportScreen;