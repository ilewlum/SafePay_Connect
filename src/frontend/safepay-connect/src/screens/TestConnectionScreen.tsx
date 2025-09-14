import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';

const TestConnectionScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (test: string, success: boolean, response: any) => {
    setResults(prev => [...prev, { test, success, response, timestamp: new Date().toISOString() }]);
  };

  const testRootEndpoint = async () => {
    setLoading(true);
    try {
      // Simulate connection test with dummy API
      addResult('Root Endpoint', true, 'Connected to dummy API (demo mode)');
      Alert.alert('Success', 'Connected to dummy backend!');
    } catch (error: any) {
      addResult('Root Endpoint', false, error.message);
      Alert.alert('Error', 'Failed to connect: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const testUser = {
        name: 'Test',
        surname: 'User',
        username: `testuser_${Date.now()}`,
        phoneNumber: '1234567890',
        password: 'test123',
        email: `test_${Date.now()}@example.com`,
      };

      const data = await api.register(testUser);
      addResult('Registration', true, data);
      Alert.alert('Success', 'User registered successfully!');
      return testUser.email;
    } catch (error: any) {
      addResult('Registration', false, error.message);
      Alert.alert('Error', 'Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (email?: string) => {
    setLoading(true);
    try {
      const loginData = {
        email: email || 'john@example.com',
        password: email ? 'test123' : 'password123',
      };

      const data = await api.login(loginData);
      addResult('Login', true, data);
      Alert.alert('Success', 'Login successful! Token received.');
      return data.token;
    } catch (error: any) {
      addResult('Login', false, error.message);
      Alert.alert('Error', 'Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults([]);
    await testRootEndpoint();
    const email = await testRegistration();
    if (email) {
      await testLogin(email);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API Connection Test</Text>
        <Text style={styles.subtitle}>Using: Dummy API (Demo Mode)</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Test Root Endpoint" onPress={testRootEndpoint} disabled={loading} />
        <View style={styles.buttonSpacer} />
        <Button title="Test Registration" onPress={() => testRegistration()} disabled={loading} />
        <View style={styles.buttonSpacer} />
        <Button title="Test Login" onPress={() => testLogin()} disabled={loading} />
        <View style={styles.buttonSpacer} />
        <Button title="Run All Tests" onPress={runAllTests} disabled={loading} color="#4CAF50" />
        <View style={styles.buttonSpacer} />
        <Button title="Clear Results" onPress={clearResults} disabled={loading} color="#FF6B6B" />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Testing connection...</Text>
        </View>
      )}

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {results.map((result, index) => (
          <View key={index} style={[styles.resultItem, result.success ? styles.success : styles.error]}>
            <Text style={styles.resultTest}>{result.test}</Text>
            <Text style={styles.resultStatus}>{result.success ? '✓ Success' : '✗ Failed'}</Text>
            <Text style={styles.resultResponse}>
              {typeof result.response === 'string'
                ? result.response
                : JSON.stringify(result.response, null, 2)}
            </Text>
            <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    borderLeftWidth: 4,
  },
  success: {
    borderLeftColor: '#4CAF50',
  },
  error: {
    borderLeftColor: '#FF6B6B',
  },
  resultTest: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultStatus: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  resultResponse: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  resultTimestamp: {
    fontSize: 10,
    color: '#999',
  },
});

export default TestConnectionScreen;