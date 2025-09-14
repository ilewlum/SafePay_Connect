import React, { useState } from 'react';
import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ScamDetectorScreen = () => {
  const [message, setMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scamPatterns = [
    { pattern: /click.*link|verify.*account/i, indicator: 'Contains suspicious link request', type: 'Phishing attempt' },
    { pattern: /congratulations.*won|claim.*prize/i, indicator: 'Mentions unexpected prize or winnings', type: 'Prize scam' },
    { pattern: /urgent.*action|immediate.*response/i, indicator: 'Creates false sense of urgency', type: 'Pressure tactic' },
    { pattern: /send.*money|transfer.*funds/i, indicator: 'Requests money transfer', type: 'Financial fraud' },
    { pattern: /otp|one.*time.*password/i, indicator: 'Asks for OTP or password', type: 'Credential theft' },
    { pattern: /suspended.*account|blocked.*card/i, indicator: 'Claims account issues', type: 'Account scam' },
    { pattern: /tax.*refund|government.*grant/i, indicator: 'Mentions government money', type: 'Government impersonation' },
    { pattern: /bitcoin|cryptocurrency|investment/i, indicator: 'Promotes investment opportunity', type: 'Investment scam' },
  ];

  const analyzeMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message to analyze');
      return;
    }

    setAnalyzing(true);
    
    setTimeout(() => {
      let detectedPatterns = [];
      let riskScore = 0;
      
      for (const pattern of scamPatterns) {
        if (pattern.pattern.test(message)) {
          detectedPatterns.push(pattern);
          riskScore += 30;
        }
      }

      // Additional risk factors
      if (message.includes('http') || message.includes('bit.ly')) riskScore += 20;
      if (message.match(/[A-Z]{5,}/)) riskScore += 10; // All caps words
      if (message.includes('!!!') || message.includes('???')) riskScore += 10;

      let riskLevel = 'low';
      if (riskScore >= 60) riskLevel = 'high';
      else if (riskScore >= 30) riskLevel = 'medium';

      const confidence = Math.min(95, 70 + (detectedPatterns.length * 8));

      let recommendation = '';
      if (riskLevel === 'high') {
        recommendation = 'DO NOT respond to this message. Delete it immediately and block the sender. If you\'ve already shared any information, contact your bank immediately.';
      } else if (riskLevel === 'medium') {
        recommendation = 'Be cautious with this message. Verify the sender through official channels before taking any action. Do not click any links or share personal information.';
      } else {
        recommendation = 'This message appears relatively safe, but always remain vigilant. Never share sensitive information via SMS or messaging apps.';
      }

      setResult({
        riskLevel,
        patterns: detectedPatterns,
        confidence,
        recommendation,
      });
      setAnalyzing(false);
    }, 1500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA94D';
      case 'low': return '#4ECDC4';
      default: return '#636E72';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={50} color="#4ECDC4" />
          <Text style={styles.title}>AI Scam Detector</Text>
          <Text style={styles.subtitle}>Analyze suspicious messages instantly</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Paste Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Paste any WhatsApp, SMS, or email message here..."
            placeholderTextColor="#B2BEC3"
            multiline
            numberOfLines={8}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={analyzeMessage}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="scan" size={24} color="white" />
              <Text style={styles.scanButtonText}>Scan Message</Text>
            </>
          )}
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Confidence Level</Text>
                <Text style={styles.confidenceValue}>{result.confidence}%</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Risk Level</Text>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(result.riskLevel) }]}>
                  <Text style={styles.riskText}>{result.riskLevel.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {result.patterns.length > 0 && (
              <View style={styles.patternsSection}>
                <Text style={styles.sectionTitle}>Detected Scam Patterns</Text>
                {result.patterns.map((pattern: any, index: number) => (
                  <View key={index} style={styles.patternItem}>
                    <Ionicons name="alert-circle" size={20} color={getRiskColor(result.riskLevel)} />
                    <View style={styles.patternContent}>
                      <Text style={styles.patternIndicator}>{pattern.indicator}</Text>
                      <Text style={styles.patternType}>{pattern.type}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.recommendationSection}>
              <Text style={styles.sectionTitle}>Recommendation</Text>
              <View style={[styles.recommendationCard, { borderLeftColor: getRiskColor(result.riskLevel) }]}>
                <Ionicons 
                  name={result.riskLevel === 'low' ? 'checkmark-circle' : 'warning'} 
                  size={24} 
                  color={getRiskColor(result.riskLevel)} 
                />
                <Text style={styles.recommendationText}>{result.recommendation}</Text>
              </View>
            </View>
          </View>
        )}
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
  inputSection: {
    margin: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    minHeight: 180,
    color: '#2D3436',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scanButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  resultContainer: {
    margin: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 8,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  riskBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  patternsSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  patternContent: {
    flex: 1,
    marginLeft: 12,
  },
  patternIndicator: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '500',
    marginBottom: 4,
  },
  patternType: {
    fontSize: 12,
    color: '#636E72',
    fontStyle: 'italic',
  },
  recommendationSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F9FC',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
    marginLeft: 12,
  },
});

export default ScamDetectorScreen;