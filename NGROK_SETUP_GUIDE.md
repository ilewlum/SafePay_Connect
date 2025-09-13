# Ngrok Setup Guide for Expo.dev Testing

## Quick Setup Instructions

### Step 1: Start Your Backend Server

Open a terminal and run:

```bash
# Navigate to backend directory
cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\Backend_api"

# Start the test backend (with in-memory database)
npm run start:test
```

You should see:
```
Test server running on port 3000
Using in-memory database for testing
```

✅ Keep this terminal open - you'll see all API logs here!

### Step 2: Create Ngrok Tunnel

Open a **NEW terminal** and run:

```bash
# Create tunnel to expose port 3000
ngrok http 3000
```

You'll see something like:
```
Forwarding  https://abc123xyz.ngrok-free.app -> http://localhost:3000
```

📝 **Copy the HTTPS URL** (e.g., `https://abc123xyz.ngrok-free.app`)

### Step 3: Update Frontend Configuration

1. Open `src/frontend/safepay-connect/src/config/api.config.ts`

2. Update with your ngrok URL:

```typescript
// Backend URL Configuration
const LOCAL_IP = '172.16.1.124';
const PRODUCTION_URL = 'https://your-backend.render.com';

// Add your ngrok URL here:
const NGROK_URL = 'https://abc123xyz.ngrok-free.app'; // ← YOUR NGROK URL

const getApiUrl = () => {
  if (__DEV__) {
    return NGROK_URL; // ← Use ngrok for testing
  } else {
    return PRODUCTION_URL;
  }
};
```

### Step 4: Test Your Backend

Verify the tunnel is working:

```bash
# Test in browser or curl
curl https://abc123xyz.ngrok-free.app

# Should return:
# "SafePay Connect API Server"
```

### Step 5: Start Expo for Testing

Open a **third terminal**:

```bash
# Navigate to frontend
cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\frontend\safepay-connect"

# Start Expo
npm start
```

### Step 6: Test on expo.dev

1. **Scan QR code** with Expo Go app
2. **Or** publish to Expo:
   ```bash
   expo publish
   ```
3. Access via expo.dev on any device

## Important Notes

### ⚠️ Ngrok Limitations (Free Tier)

- **URL changes** every time you restart ngrok
- **8-hour limit** per session
- **Limited requests** (40 requests/minute)
- **"Visit Site" warning** on first access (click to proceed)

### 🔄 When Ngrok URL Changes

1. Copy new URL from ngrok terminal
2. Update `api.config.ts` with new URL
3. Restart Expo (Ctrl+C, then `npm start`)
4. Clear app cache if needed

## Terminal Setup Summary

 You'll have 3 terminals running:

| Terminal | Command | Purpose |
|----------|---------|----------|
| 1 | `npm run start:test` | Backend server with logs |
| 2 | `ngrok http 3000` | Tunnel to expose backend |
| 3 | `npm start` | Expo development server |

## Testing Checklist

- [ ] Backend running on port 3000
- [ ] Ngrok tunnel active
- [ ] Frontend updated with ngrok URL
- [ ] Can access ngrok URL in browser
- [ ] Expo server running
- [ ] App connects to backend

## Troubleshooting

### "Failed to fetch" Error
- Check ngrok is still running
- Verify URL in api.config.ts
- Ensure backend is running
- Try refreshing Expo app

### "Ngrok tunnel expired"
- Restart ngrok: `ngrok http 3000`
- Update new URL in frontend
- Restart Expo

### "Too many connections" Error
- Free ngrok has connection limits
- Wait a minute and retry
- Consider ngrok paid plan for production testing

### Backend Logs Not Showing
- Ensure you're running `npm run start:test`
- Check the first terminal window
- All console.log statements will appear there

## Example API Test

Once everything is running, test your API:

```bash
# Replace with your ngrok URL
NGROK_URL="https://abc123xyz.ngrok-free.app"

# Test root endpoint
curl $NGROK_URL

# Test registration
curl -X POST $NGROK_URL/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ngrok.com","password":"test123","fullName":"Ngrok Test","username":"ngroktest"}'
```

## Next Steps

1. ✅ Test all app features through ngrok
2. ✅ Monitor backend logs for issues
3. ⏳ Consider deploying to Render.com for stable URL
4. ⏳ Build for TestFlight when ready

## Ngrok Dashboard

View request details at:
- http://localhost:4040 (while ngrok is running)
- Shows all requests, responses, and timing

---

**Remember:** Update the ngrok URL in `api.config.ts` every time you restart ngrok!