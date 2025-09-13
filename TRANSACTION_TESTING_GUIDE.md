# Complete Transaction Testing Guide - Phase 5 ✅

## Overview
This guide provides comprehensive testing procedures for all transaction features integrated in Phase 5. Follow these tests to ensure your transaction system is working correctly.

## Prerequisites

### 1. Backend Setup
```bash
# Navigate to backend directory
cd src/Backend_api

# Install dependencies if not already done
npm install

# Start the test server (with in-memory database)
npm run start:test
```

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd src/frontend/safepay-connect

# Install dependencies if needed
npm install

# Start the frontend
npm start
```

## Test User Setup

### Create Two Test Users

#### User 1 (Sender)
```json
{
  "email": "sender@test.com",
  "password": "test123",
  "fullName": "John Sender",
  "username": "johnsender"
}
```

#### User 2 (Receiver)
```json
{
  "email": "receiver@test.com",
  "password": "test123",
  "fullName": "Jane Receiver",
  "username": "janereceiver"
}
```

## Test Scenarios

### Test 1: User Registration and Wallet Creation

#### Steps:
1. **Register User 1**
   - Open app → Register
   - Enter User 1 details
   - Submit registration
   - ✅ Should navigate to login

2. **Login as User 1**
   - Enter credentials
   - ✅ Should navigate to home

3. **Create Wallet for User 1**
   - Navigate to Wallet → Create Wallet
   - Bank: FNB
   - Account Type: Savings Account
   - Account Number: 1234567890
   - ✅ Wallet should be created

4. **Repeat for User 2**
   - Register, login, create wallet
   - Bank: Capitec
   - Account Type: Cheque Account
   - Account Number: 0987654321

### Test 2: Send Money Transaction

#### Steps:
1. **Login as User 1 (Sender)**

2. **Navigate to Send Money**
   - Wallet → Send Money
   - OR Payment Request screen

3. **Enter Transaction Details**
   ```
   Recipient: janereceiver
   Amount: 150.00
   Reference: Test payment
   ```

4. **Confirm Transaction**
   - Review details in confirmation dialog
   - Tap Confirm
   - ✅ Should show success message

5. **Verify in Wallet**
   - Navigate back to Wallet
   - Pull to refresh
   - ✅ Should see transaction as "sent" (red/negative)

### Test 3: Receive Money Verification

#### Steps:
1. **Login as User 2 (Receiver)**

2. **Check Wallet**
   - Navigate to Wallet
   - Pull to refresh
   - ✅ Should see transaction as "received" (green/positive)
   - ✅ Balance should be updated

### Test 4: Transaction Details View

#### Steps:
1. **From Wallet Screen**
   - Tap on any transaction
   - ✅ Should navigate to Transaction Details

2. **Verify Details Display**
   - ✅ Transaction ID visible
   - ✅ Amount correct
   - ✅ Sender/Receiver info correct
   - ✅ Timestamp displayed
   - ✅ Reference shown
   - ✅ Status indicator working

### Test 5: Transaction Verification

#### Steps:
1. **Navigate to Transaction Verifier**
   - From bottom navigation

2. **Get Transaction ID**
   - Copy from Transaction Details screen
   - Format: TX_XXXXX

3. **Verify Transaction**
   - Enter transaction ID
   - Tap Verify
   - ✅ Should show verification status
   - ✅ Should display transaction details

### Test 6: Error Handling

#### Test Invalid Recipient
```
Recipient: nonexistentuser
Amount: 50
```
✅ Should show "Invalid User" error

#### Test No Wallet Sender
- Create new user without wallet
- Try to send money
✅ Should show "Sender has no wallet" error

#### Test Invalid Amount
```
Amount: -50 or 0 or abc
```
✅ Should show validation error

#### Test Empty Fields
- Leave recipient or amount empty
✅ Should show "Please enter recipient username and amount"

## API Testing with cURL

### 1. Get Authentication Token
```bash
# Windows (Git Bash)
TOKEN=$(curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sender@test.com","password":"test123"}' \
  -s | python -m json.tool | grep token | cut -d'"' -f4)

echo $TOKEN
```

### 2. Create Transaction
```bash
curl -X POST http://localhost:3000/createTransaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"username":"janereceiver","amount":100,"reference":"API test payment"}'
```

### 3. Get Transaction
```bash
# Replace TX_12345 with actual transaction ID
curl -X GET http://localhost:3000/getTransaction/TX_12345 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. View Wallet with Transactions
```bash
curl -X GET http://localhost:3000/viewWallet \
  -H "Authorization: Bearer $TOKEN"
```

## Expected Responses

### Successful Transaction Creation
```json
{
  "message": "Transaction created successfully",
  "transactionId": "TX_12345",
  "transaction": {
    "id": "TX_12345",
    "senderID": "user1",
    "receiverID": "user2",
    "amount": 100,
    "reference": "Test payment",
    "status": "completed",
    "timestamp": "2025-01-13T10:00:00.000Z"
  }
}
```

### Wallet with Transactions
```json
{
  "wallet": {
    "id": "wallet1",
    "userID": "user1",
    "bank": "FNB",
    "type": "Savings Account",
    "accountNumber": "1234567890",
    "balance": 900
  },
  "transactions": [
    {
      "id": "TX_12345",
      "amount": 100,
      "type": "sent",
      "reference": "Test payment",
      "timestamp": "2025-01-13T10:00:00.000Z"
    }
  ]
}
```

## Troubleshooting

### Issue: "Cannot read properties of undefined"
**Solution**: Ensure both users have wallets created before attempting transactions

### Issue: "Invalid User" when sending money
**Solution**: 
- Check username spelling (case-sensitive)
- Don't include @ symbol
- Ensure recipient user exists

### Issue: Transaction not showing in wallet
**Solution**: Pull to refresh the wallet screen

### Issue: "Network request failed"
**Solution**: 
- Check backend is running (`npm run start:test`)
- Verify API URL in `src/config/api.config.ts`
- For Android emulator, use `10.0.2.2` instead of `localhost`

### Issue: Token expired
**Solution**: Logout and login again to get new token

## Performance Checklist

- [ ] Registration completes in < 2 seconds
- [ ] Login completes in < 1 second
- [ ] Wallet creation completes in < 2 seconds
- [ ] Transaction creation completes in < 2 seconds
- [ ] Transaction list loads in < 1 second
- [ ] Pull to refresh works smoothly
- [ ] No memory leaks after multiple transactions
- [ ] Error messages display immediately

## Security Verification

- [ ] Tokens required for all protected endpoints
- [ ] Can only send from own wallet
- [ ] Can only view own transactions
- [ ] Passwords are hashed (check database)
- [ ] Tokens expire appropriately
- [ ] No sensitive data in console logs

## UI/UX Validation

- [ ] Loading states display during API calls
- [ ] Success messages are clear
- [ ] Error messages are helpful
- [ ] Navigation flows are intuitive
- [ ] Forms have proper validation
- [ ] Confirmation dialogs prevent accidents
- [ ] Pull to refresh is discoverable
- [ ] Transaction status colors are consistent

## Next Steps

Once all tests pass:

1. **Document any issues found**
2. **Test with real Firebase backend**
3. **Add more test users for complex scenarios**
4. **Test edge cases (large amounts, special characters)**
5. **Proceed to Phase 6 (Advanced Features)**

## Test Summary Report

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ | Working with validation |
| User Login | ✅ | Token persisted |
| Wallet Creation | ✅ | All fields saved |
| Send Money | ✅ | Updates both wallets |
| View Transactions | ✅ | Shows in history |
| Transaction Details | ✅ | All info displayed |
| Verify Transaction | ✅ | Ownership validated |
| Error Handling | ✅ | Comprehensive messages |
| Token Auth | ✅ | All endpoints protected |
| Pull to Refresh | ✅ | Updates data |