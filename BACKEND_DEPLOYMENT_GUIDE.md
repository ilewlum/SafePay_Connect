# Backend Deployment Guide for TestFlight

## Quick Start - Render.com Deployment (Free)

### Step 1: Prepare Backend for Deployment

1. **Create a GitHub repository** for your backend:
   ```bash
   cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\Backend_api"
   git init
   git add .
   git commit -m "Initial backend commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/safepay-backend.git
   git push -u origin main
   ```

2. **Add a start script** in package.json (already done):
   ```json
   "scripts": {
     "start": "node index.js",
     "start:test": "node index-test.js"
   }
   ```

### Step 2: Deploy to Render.com

1. **Sign up** at [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your backend repository

3. **Configure Service**:
   ```
   Name: safepay-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm run start:test
   Plan: Free
   ```

4. **Add Environment Variables**:
   - Click "Environment" tab
   - Add: `JWT_SECRET` = `your_secure_jwt_secret_key_here`
   - Add: `PORT` = `3000`

5. **Deploy**: Click "Create Web Service"

6. **Get Your URL**: After deployment, you'll get:
   ```
   https://safepay-backend.onrender.com
   ```

### Step 3: Update Frontend Configuration

```typescript
// src/config/api.config.ts
const PRODUCTION_URL = 'https://safepay-backend.onrender.com';
```

---

## Alternative: Local Testing with Ngrok

### For Quick Testing Without Deployment:

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   # OR download from https://ngrok.com/download
   ```

2. **Run Backend Locally**:
   ```bash
   cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\Backend_api"
   npm run start:test
   ```

3. **Create Tunnel**:
   ```bash
   ngrok http 3000
   ```

4. **Get URL**:
   ```
   Forwarding: https://abc123def.ngrok.io → http://localhost:3000
   ```

5. **Update Frontend**:
   ```typescript
   const NGROK_URL = 'https://abc123def.ngrok.io';
   ```

---

## Running Backend Locally (For Development)

### Commands:
```bash
# Navigate to backend
cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\Backend_api"

# For test database (in-memory)
npm run start:test

# For Firebase (requires setup)
npm start

# Watch logs
# The terminal will show all API requests and responses
```

### Viewing Logs:
- All console.log statements appear in terminal
- Request logs show: method, path, body
- Error logs show: stack traces, error messages

---

## TestFlight Build Configuration

### Using EAS Build:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login**:
   ```bash
   eas login
   ```

3. **Configure**:
   ```bash
   cd "C:\Users\tsian\OneDrive - University of Cape Town\2025\InterVarsity Hackathon\SafePay_Connect\src\frontend\safepay-connect"
   eas build:configure
   ```

4. **Update eas.json**:
   ```json
   {
     "build": {
       "preview": {
         "ios": {
           "simulator": false,
           "distribution": "internal"
         }
       },
       "production": {
         "ios": {
           "distribution": "app-store"
         }
       }
     }
   }
   ```

5. **Build for TestFlight**:
   ```bash
   eas build --platform ios --profile preview
   ```

6. **Submit to TestFlight**:
   ```bash
   eas submit --platform ios
   ```

---

## Backend Monitoring

### Render.com Dashboard:
- View logs: Dashboard → Your Service → Logs
- Monitor metrics: Dashboard → Metrics
- Check deploy status: Dashboard → Events

### Local Development:
```bash
# Terminal 1: Backend with logs
npm run start:test

# Terminal 2: Test requests
curl http://localhost:3000
```

---

## Production Checklist

### Before TestFlight Submission:

- [ ] Backend deployed to Render/Railway/etc
- [ ] Frontend API URL updated to production
- [ ] Environment variables set (JWT_SECRET)
- [ ] Test all endpoints from deployed URL
- [ ] Remove all console.log statements
- [ ] Enable CORS for your domain only
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Configure rate limiting
- [ ] Set up Firebase (for production)

### API URLs by Environment:

| Environment | Backend URL | Frontend Config |
|------------|-------------|----------------|
| Local Dev | http://localhost:3000 | LOCAL_IP |
| TestFlight Testing | https://safepay-backend.onrender.com | PRODUCTION_URL |
| Production | https://api.safepay.com | PRODUCTION_URL |

---

## Common Issues

### "Failed to fetch" in TestFlight app:
- Check backend is deployed and running
- Verify URL in api.config.ts
- Check CORS settings in backend

### "Unauthorized" errors:
- Verify JWT_SECRET matches in backend
- Check token expiration (1 hour default)

### Slow response times:
- Free tier services sleep after inactivity
- First request may take 30+ seconds
- Consider paid tier for production

---

## Next Steps

1. **Deploy backend** to Render.com
2. **Update frontend** with production URL
3. **Build app** with EAS
4. **Submit to TestFlight**
5. **Test thoroughly**
6. **Monitor logs** for issues

---

## Support Commands

```bash
# Check if backend is accessible
curl https://your-backend.onrender.com

# Test login endpoint
curl -X POST https://your-backend.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# View render logs (from dashboard)
# Or use their CLI: render logs
```