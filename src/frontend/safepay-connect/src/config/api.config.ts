import { Platform } from 'react-native';

// Backend URL Configuration
// Option 1: Local testing (update IP as needed)
const LOCAL_IP = '196.42.64.255';

// Option 2: Deployed backend (update when deployed)
const PRODUCTION_URL = 'https://your-backend.render.com'; // Update when deployed!

// Option 3: Ngrok tunnel (UPDATE THIS WITH YOUR NGROK URL)
const NGROK_URL = 'https://wild-papayas-sin.loca.lt'; // ← LocalTunnel URL

const getApiUrl = () => {
  if (__DEV__) {
    // Choose your backend for development:
    // ===================================

    return `http://${LOCAL_IP}:3000`; // Local network (Expo Go on same WiFi)
    //return NGROK_URL; // ← Using ngrok for expo.dev testing
    // return PRODUCTION_URL; // Deployed backend (when available)
  } else {
    // Production environment
    return PRODUCTION_URL;
  }
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Wallet
  CREATE_WALLET: '/createWallet',
  VIEW_WALLET: '/viewWallet',
  UPDATE_WALLET: '/updateWallet',

  // Transactions
  CREATE_TRANSACTION: '/createTransaction',
  GET_TRANSACTION: '/getTransaction',
};

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};