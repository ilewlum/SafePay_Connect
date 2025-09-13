import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ScamDetectorScreen from './src/screens/ScamDetectorScreen';
import PaymentConfirmationScreen from './src/screens/PaymentConfirmationScreen';
import PaymentRequestScreen from './src/screens/PaymentRequestScreen';
import TrendingScamsScreen from './src/screens/TrendingScamsScreen';
import WalletScreen from './src/screens/WalletScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Detector') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Confirm') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Request') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#636E72',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#F7F9FC',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Detector" 
        component={ScamDetectorScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Detector'
        }}
      />
      <Tab.Screen 
        name="Confirm" 
        component={PaymentConfirmationScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Confirm'
        }}
      />
      <Tab.Screen 
        name="Request" 
        component={PaymentRequestScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Request'
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Wallet'
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="TrendingScams" 
          component={TrendingScamsScreen}
          options={{ 
            headerShown: true, 
            title: 'Trending Scams',
            headerStyle: {
              backgroundColor: '#F7F9FC',
            },
            headerTintColor: '#2D3436',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
