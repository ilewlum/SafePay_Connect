# SafePay Connect - Frontend

A React Native + Expo mobile application for safer financial transactions in South Africa.

## Features

### 1. AI Scam Detector
- Analyzes WhatsApp, SMS, and email messages for potential scams
- Pattern recognition for common fraud schemes
- Real-time risk assessment with confidence scores

### 2. Transaction Verifier
- QR code-based verification system
- Secure transaction logging
- Transaction history tracking

### 3. Voice Support
- Multi-language support (English, isiZulu, isiXhosa, Afrikaans, Sesotho, Setswana)
- Voice commands and alerts
- Audio playback of transaction notifications

### 4. SafeRoute Finance
- Find safe ATMs and banking locations
- Safety scores based on security features
- Navigation to secure financial service points

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your phone (for testing)

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend/safepay-connect
```

2. Install dependencies:
```bash
npm install
```

### Running the App

1. Start the development server:
```bash
npm start
# or
npx expo start
```

2. Run on your device:
   - Install the Expo Go app from App Store (iOS) or Google Play (Android)
   - Scan the QR code shown in the terminal with Expo Go (Android) or Camera app (iOS)

3. Run on simulator/emulator:
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
safepay-connect/
├── src/
│   └── screens/
│       ├── HomeScreen.tsx          # Main dashboard
│       ├── ScamDetectorScreen.tsx   # AI scam detection
│       ├── TransactionVerifierScreen.tsx # QR verification
│       ├── VoiceSupportScreen.tsx   # Multi-language support
│       └── SafeRouteScreen.tsx      # Safe ATM locations
├── App.tsx                          # Main app with navigation
├── package.json
└── tsconfig.json
```

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: App navigation
- **Expo Vector Icons**: Icon library

## Next Steps

### Backend Integration
- Connect to Node.js/Express backend
- Implement real AI/NLP models for scam detection
- Add blockchain/ledger for transaction verification

### Features to Add
- User authentication
- Real-time notifications
- Integration with banking APIs
- Google Maps integration for SafeRoute
- Voice recognition using speech-to-text APIs
- Multi-language TTS (text-to-speech)

## Testing

The app includes sample data and simulated features for demonstration:
- Scam detector has pre-configured patterns
- Transaction verifier generates mock QR codes
- Voice support simulates language translation
- SafeRoute shows sample safe locations

## Build for Production

```bash
# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android
```

## License

This is a hackathon prototype for SafePay Connect.