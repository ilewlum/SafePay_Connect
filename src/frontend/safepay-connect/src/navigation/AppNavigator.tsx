import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import CreateWalletScreen from '../screens/CreateWalletScreen';
import UpdateWalletScreen from '../screens/UpdateWalletScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import PaymentRequestScreen from '../screens/PaymentRequestScreen';
import PaymentConfirmationScreen from '../screens/PaymentConfirmationScreen';
import TransactionVerifierScreen from '../screens/TransactionVerifierScreen';
import SafeRouteScreen from '../screens/SafeRouteScreen';
import ScamDetectorScreen from '../screens/ScamDetectorScreen';
import TrendingScamsScreen from '../screens/TrendingScamsScreen';
import VoiceSupportScreen from '../screens/VoiceSupportScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack for unauthenticated users
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F7F9FC' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Payment') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Security') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Support') {
            iconName = focused ? 'headset' : 'headset-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#636E72',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Payment" component={PaymentRequestScreen} />
      <Tab.Screen name="Security" component={ScamDetectorScreen} />
      <Tab.Screen name="Support" component={VoiceSupportScreen} />
    </Tab.Navigator>
  );
};

// App Stack for authenticated users (tabs + other screens)
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F7F9FC' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="UpdateWallet" component={UpdateWalletScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
      <Stack.Screen name="TransactionVerifier" component={TransactionVerifierScreen} />
      <Stack.Screen name="SafeRoute" component={SafeRouteScreen} />
      <Stack.Screen name="TrendingScams" component={TrendingScamsScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can add a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;