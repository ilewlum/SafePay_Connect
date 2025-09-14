import React, { useState } from 'react';
import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, surname, username, email, phoneNumber, password, confirmPassword } = formData;

    // Validation
    if (!name || !surname || !username || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Call the real registration API
      const registrationData = {
        name,
        surname,
        username,
        email,
        phoneNumber,
        password,
      };

      await register(registrationData);

      Alert.alert(
        'Success!',
        'Your account has been created successfully. Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#2D3436" />
              </TouchableOpacity>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join SafePay Connect</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#B2BEC3"
                    value={formData.name}
                    onChangeText={(text) => updateFormData('name', text)}
                  />
                </View>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Surname"
                    placeholderTextColor="#B2BEC3"
                    value={formData.surname}
                    onChangeText={(text) => updateFormData('surname', text)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#636E72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#B2BEC3"
                  value={formData.username}
                  onChangeText={(text) => updateFormData('username', text)}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#636E72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#B2BEC3"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#636E72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#B2BEC3"
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateFormData('phoneNumber', text)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#636E72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#B2BEC3"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#636E72"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#636E72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#B2BEC3"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry={!showPassword}
                />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Creating Account...' : 'Register'}
                </Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  halfInput: {
    width: '48%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
  },
  registerButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#636E72',
  },
  linkText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
});

export default RegisterScreen;