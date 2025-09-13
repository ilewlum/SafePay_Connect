# iOS Physical Device Testing Setup Guide

## Current Configuration
- **PC IP Address:** 172.16.1.124
- **Backend Port:** 3000
- **Backend URL:** http://172.16.1.124:3000

## Step 1: Windows Firewall Configuration ✅

### Option A: Using Windows Defender Firewall (GUI)
1. Open Windows Security
2. Go to "Firewall & network protection"
3. Click "Advanced settings"
4. Click "Inbound Rules" on the left
5. Click "New Rule..." on the right
6. Select "Port" → Next
7. Select "TCP" and enter "3000" → Next
8. Select "Allow the connection" → Next
9. Check all profiles (Domain, Private, Public) → Next
10. Name it "SafePay Backend" → Finish

### Option B: Using Command Prompt (Admin)
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="SafePay Backend" dir=in action=allow protocol=TCP localport=3000
```

## Step 2: Start Backend Server

```bash
# Navigate to backend directory
cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\Backend_api"

# Use the test backend (with in-memory database)
npm run start:test

# The server should show:
# Test server running on port 3000
# Using in-memory database for testing
```

## Step 3: Install Expo Go on iPhone

1. Open App Store on your iPhone
2. Search for "Expo Go"
3. Install the app by Expo (Expo Go)
4. Create an Expo account if you don't have one

## Step 4: Build and Run the App

### In the frontend directory:
```bash
cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\frontend\safepay-connect"

# Install dependencies if not done
npm install

# Start Expo
npm start
```

### This will:
1. Start Metro bundler
2. Show a QR code in the terminal
3. Open Expo DevTools in browser (optional)

## Step 5: Connect iPhone to App

### Method 1: QR Code (Recommended)
1. Open Expo Go app on iPhone
2. Tap "Scan QR Code"
3. Scan the QR code from terminal or browser
4. App will load and connect

### Method 2: Manual Entry
1. In Expo Go, tap "Enter URL manually"
2. Enter: `exp://172.16.1.124:8081`
3. Tap "Connect"

## Step 6: Test the Connection

1. **Launch the app** on your iPhone
2. **Try Registration:**
   - Tap "Register"
   - Enter test details:
     - Email: test@iphone.com
     - Password: test123
     - Full Name: iPhone Test
     - Username: iphonetest
   - Submit

3. **If successful:** You'll be redirected to login
4. **If it fails:** Check troubleshooting below

## Troubleshooting

### "Network request failed" Error
1. **Check WiFi:** Ensure both PC and iPhone are on same network
2. **Check IP:** Run `ipconfig` again to verify IP hasn't changed
3. **Check Firewall:** Temporarily disable Windows Firewall to test
4. **Check Backend:** Ensure backend is running (`npm run start:test`)

### "Cannot connect to Metro bundler"
1. Ensure Expo is running (`npm start`)
2. Try clearing Expo cache: `expo start -c`
3. Restart Expo Go app on iPhone

### Backend Not Accessible
Test from iPhone Safari:
1. Open Safari on iPhone
2. Go to: http://172.16.1.124:3000
3. Should see: "SafePay Connect API Server"

If not accessible:
- Check Windows Firewall rules
- Try pinging PC from another device
- Ensure no VPN is active

## Quick Test URLs

Test these in iPhone Safari to verify connectivity:
- Backend status: http://172.16.1.124:3000
- Expo bundler: http://172.16.1.124:8081

## Security Note

⚠️ **Important:** The firewall rule opens port 3000 to your network. After testing:
1. Remove the firewall rule OR
2. Restrict it to specific IP addresses
3. Never leave development servers exposed unnecessarily

## Building for Production (iOS)

When ready for App Store:

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios
```

### Local Build (Requires Mac)
```bash
# On a Mac with Xcode installed
expo build:ios
```

## Current API Configuration

The app is configured to use:
```typescript
// src/config/api.config.ts
const LOCAL_IP = '172.16.1.124';
API_BASE_URL = 'http://172.16.1.124:3000';
```

## Test Credentials

For testing, use these pre-configured users:

**User 1:**
- Email: sender@test.com
- Password: test123
- Username: johnsender

**User 2:**
- Email: receiver@test.com
- Password: test123
- Username: janereceiver

## Next Steps

1. ✅ Test all features on iPhone
2. ✅ Verify transactions work
3. ⏳ Set up real Firebase (when ready)
4. ⏳ Deploy backend to cloud
5. ⏳ Update API URL for production
6. ⏳ Submit to App Store

## Support

If you encounter issues:
1. Check all devices are on same WiFi
2. Verify IP address hasn't changed
3. Ensure backend is running
4. Check firewall settings
5. Test with curl from another device

---

**Ready to test!** Your iPhone should now be able to connect to the backend running on your PC.