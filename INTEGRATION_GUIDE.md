# SafePay Connect Integration Guide

## Phase 1 Complete! ✅

### What's Been Set Up

#### Backend Configuration
- ✅ Created `package.json` with all required dependencies
- ✅ Added CORS middleware for cross-origin requests
- ✅ Created `.env` file for sensitive configuration
- ✅ Updated code to use environment variables
- ✅ Installed all dependencies

#### Frontend Configuration
- ✅ Created flexible API configuration (`src/config/api.config.ts`)
- ✅ Updated API service to use centralized configuration
- ✅ Added platform-specific URL handling (Android emulator, iOS simulator, web)

## How to Run the Application

### Step 1: Start the Backend Server

```bash
cd src/Backend_api
npm start
```

The server should start on http://localhost:3000

### Step 2: Verify Backend is Running

Test the root endpoint:
```bash
curl http://localhost:3000/
```

Expected response: "Express + Firestore API running 🚀"

### Step 3: Start the Frontend

In a new terminal:
```bash
cd src/frontend/safepay-connect
npm start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## Testing the Integration

### Test User Registration
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "surname": "User",
    "username": "testuser",
    "phoneNumber": "1234567890",
    "password": "test123",
    "email": "test@example.com"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Configuration for Physical Devices

If testing on a physical device:

1. Find your machine's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update `src/frontend/safepay-connect/src/config/api.config.ts`:
   ```typescript
   const LOCAL_IP = '192.168.1.100'; // Replace with your IP
   export const API_BASE_URL = __DEV__ ? `http://${LOCAL_IP}:3000` : 'https://your-production-api.com';
   ```

3. Ensure both your device and computer are on the same network

## Important Files

### Backend
- `/src/Backend_api/index.js` - Main server file
- `/src/Backend_api/.env` - Environment variables (don't commit!)
- `/src/Backend_api/package.json` - Backend dependencies

### Frontend
- `/src/frontend/safepay-connect/src/services/api.ts` - API service layer
- `/src/frontend/safepay-connect/src/config/api.config.ts` - API configuration
- `/src/frontend/safepay-connect/src/contexts/AuthContext.tsx` - Authentication context

## Security Notes

⚠️ **Important**:
- Never commit the `.env` file or Firebase service account JSON to version control
- Change the JWT_SECRET in production
- Use HTTPS in production
- Implement proper rate limiting for production

## Troubleshooting

### CORS Issues
If you encounter CORS errors, check that:
- Backend has `app.use(cors())` before other middleware
- Frontend is using the correct API URL

### Connection Refused
- Verify backend is running on port 3000
- Check firewall settings
- For physical devices, ensure you're using the correct IP address

### Firebase Errors
- Ensure the Firebase service account JSON file exists
- Check the path in `.env` matches your file location
- Verify Firebase project settings

## Next Steps (Phase 2)

Ready to proceed with Phase 2: Basic Connection Test
- Test backend endpoints with Postman/curl
- Create test buttons in frontend
- Monitor network requests
- Handle any CORS issues