# SafePay Connect API Documentation

## Base URL
- Development: `http://localhost:3000`
- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. User Registration
**POST** `/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "user_12345"
}
```

**Errors:**
- 400: User already exists
- 400: Missing required fields

---

### 2. User Login
**POST** `/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "user_12345",
    "email": "user@example.com",
    "fullName": "John Doe",
    "username": "johndoe"
  }
}
```

**Errors:**
- 404: User not found
- 401: Invalid password

---

### 3. Create Wallet
**POST** `/createWallet`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "bank": "FNB",
  "type": "Savings Account",
  "accountNumber": "1234567890",
  "walletNumber": "WAL001"
}
```

**Response:**
```json
{
  "message": "Wallet created successfully",
  "walletId": "wallet_12345"
}
```

**Errors:**
- 401: No token provided
- 400: User already has a wallet
- 400: Missing required fields

---

### 4. View Wallet
**GET** `/viewWallet`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallet": {
    "id": "wallet_12345",
    "userID": "user_12345",
    "bank": "FNB",
    "type": "Savings Account",
    "accountNumber": "1234567890",
    "walletNumber": "WAL001",
    "balance": 1000
  },
  "transactions": [
    {
      "id": "TX_12345",
      "amount": 100,
      "type": "received",
      "reference": "Payment from John",
      "timestamp": "2025-01-13T10:00:00.000Z"
    }
  ]
}
```

**Errors:**
- 401: No token provided
- 404: Wallet not found

---

### 5. Update Wallet
**PUT** `/updateWallet`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "bank": "Capitec",
  "type": "Cheque Account",
  "accountNumber": "0987654321"
}
```

**Response:**
```json
{
  "message": "Wallet updated successfully"
}
```

**Errors:**
- 401: No token provided
- 404: Wallet not found

---

### 6. Delete Wallet
**DELETE** `/deleteWallet`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Wallet deleted successfully"
}
```

**Errors:**
- 401: No token provided
- 404: Wallet not found

---

### 7. Create Transaction
**POST** `/createTransaction`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "username": "janedoe",
  "amount": 150.50,
  "reference": "Lunch money"
}
```

**Response:**
```json
{
  "message": "Transaction created successfully",
  "transactionId": "TX_12345",
  "transaction": {
    "id": "TX_12345",
    "senderID": "user_12345",
    "receiverID": "user_67890",
    "amount": 150.50,
    "reference": "Lunch money",
    "status": "completed",
    "timestamp": "2025-01-13T10:00:00.000Z"
  }
}
```

**Errors:**
- 401: No token provided
- 404: Invalid User (recipient not found)
- 404: Sender has no wallet
- 404: Receiver has no wallet
- 400: Invalid amount

---

### 8. Get Transaction
**GET** `/getTransaction/:transactionId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "TX_12345",
  "senderID": "user_12345",
  "receiverID": "user_67890",
  "amount": 150.50,
  "type": "Wallet Transfer",
  "walletNumber": "WAL001",
  "reference": "Lunch money",
  "status": "completed",
  "timestamp": "2025-01-13T10:00:00.000Z"
}
```

**Errors:**
- 401: No token provided
- 404: Transaction not found
- 403: You are not authorized to view this transaction

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User",
    "username": "testuser"
  }'

# 2. Login to get token
TOKEN=$(curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -s | python -m json.tool | grep token | cut -d'"' -f4)

# 3. Create a wallet
curl -X POST http://localhost:3000/createWallet \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bank": "FNB",
    "type": "Savings Account",
    "accountNumber": "1234567890",
    "walletNumber": "WAL001"
  }'

# 4. View wallet
curl -X GET http://localhost:3000/viewWallet \
  -H "Authorization: Bearer $TOKEN"

# 5. Create a transaction
curl -X POST http://localhost:3000/createTransaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "anotheruser",
    "amount": 100,
    "reference": "Test payment"
  }'

# 6. Get transaction details
curl -X GET http://localhost:3000/getTransaction/TX_12345 \
  -H "Authorization: Bearer $TOKEN"

# 7. Update wallet
curl -X PUT http://localhost:3000/updateWallet \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bank": "Capitec",
    "type": "Cheque Account",
    "accountNumber": "0987654321"
  }'

# 8. Delete wallet (use with caution)
curl -X DELETE http://localhost:3000/deleteWallet \
  -H "Authorization: Bearer $TOKEN"
```

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (access denied)
- **404**: Not Found
- **500**: Internal Server Error

## Security Notes

1. **JWT Token Expiry**: Tokens expire after 1 hour
2. **Password Hashing**: All passwords are hashed using bcrypt
3. **Authorization**: Users can only access their own data
4. **Transaction Verification**: Users can only verify transactions they're involved in

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- Registration: 5 requests per hour per IP
- Login: 10 requests per hour per IP
- Transactions: 100 requests per hour per user

## Frontend Integration

### React Native / Expo Example

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure base URL based on platform
const API_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000'
});

// Login function
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    
    // Store token
    await AsyncStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
}

// Authenticated request example
async function createTransaction(username, amount, reference) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await axios.post(
      `${API_URL}/createTransaction`,
      { username, amount, reference },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Transaction failed';
  }
}
```

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "SafePay Connect API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"test123\",\n  \"fullName\": \"Test User\",\n  \"username\": \"testuser\"\n}"
        },
        "url": "{{baseUrl}}/register"
      }
    },
    {
      "name": "Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "const response = pm.response.json();",
              "pm.environment.set('token', response.token);"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"test123\"\n}"
        },
        "url": "{{baseUrl}}/login"
      }
    }
  ]
}
```

## WebSocket Events (Future Enhancement)

Planned real-time features:
- `transaction:received` - Notify when receiving money
- `transaction:sent` - Confirm when money is sent
- `wallet:updated` - Wallet balance changes
- `security:alert` - Suspicious activity detected