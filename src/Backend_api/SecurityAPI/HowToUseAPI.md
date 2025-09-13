# How to Use SafePay Connect API

## Quick Start

### 1. Run the Application
```bash
cd API
mvn spring-boot:run
```
Server runs on: `http://localhost:8080`

### 2. Test Connection
```bash
curl http://localhost:8080/api/scam/health
```

## API Endpoints

### Scam Detection (Traditional)

#### Analyze Single Message
```http
POST /api/scam/analyze
Content-Type: application/json

{
  "message": "URGENT: Your FNB account suspended. Click here to verify."
}
```

**Response:**
```json
{
  "isScam": true,
  "confidence": 0.85,
  "riskLevel": "HIGH",
  "detectedPatterns": ["Urgency keyword: URGENT", "Fake banking phrase: FNB ACCOUNT SUSPENDED"],
  "recommendation": "HIGH RISK: This message shows strong indicators of being a scam..."
}
```

#### Batch Analysis
```http
POST /api/scam/analyze/batch
Content-Type: application/json

{
  "messages": [
    "Your statement is ready",
    "URGENT: Click here to claim R5000!"
  ]
}
```

### AI-Enhanced Scam Detection

#### Single Message Analysis
```http
POST /api/ai-scam/analyze
Content-Type: application/json

{
  "message": "URGENT: Your FNB account suspended. Verify at http://fake-fnb.co.za"
}
```

**Response:**
```json
{
  "isScam": true,
  "confidence": 0.85,
  "riskLevel": "HIGH",
  "detectedPatterns": ["Urgency language detected", "Banking institution mentioned"],
  "recommendation": "HIGH RISK: Strong scam indicators detected...",
  "analysisType": "AI_ENHANCED"
}
```

#### Batch AI Analysis
```http
POST /api/ai-scam/batch-analyze
Content-Type: application/json

{
  "messages": ["Message 1", "Message 2"]
}
```

#### NLP Feature Extraction
```http
POST /api/ai-scam/features
Content-Type: application/json

{
  "message": "URGENT! Your account needs verification NOW!!!"
}
```

### Transaction Security

#### Verify Transaction
```http
POST /api/transaction/verify
Content-Type: application/json

{
  "amount": "1000.00",
  "recipient": "John Doe"
}
```

#### Confirm Transaction
```http
POST /api/transaction/confirm
Content-Type: application/json

{
  "transactionId": "abc123",
  "verificationCode": "123456"
}
```

## Integration Examples

### JavaScript/Node.js
```javascript
const analyzeMessage = async (message) => {
  const response = await fetch('http://localhost:8080/api/ai-scam/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return await response.json();
};
```

### Python
```python
import requests

def analyze_message(message):
    response = requests.post(
        'http://localhost:8080/api/ai-scam/analyze',
        json={'message': message}
    )
    return response.json()
```

### Java
```java
RestTemplate restTemplate = new RestTemplate();
Map<String, String> request = Map.of("message", "Your message here");
ResponseEntity<Map> response = restTemplate.postForEntity(
    "http://localhost:8080/api/ai-scam/analyze", 
    request, 
    Map.class
);
```

## Configuration

### AI Setup (Free Model)
The API uses a free Hugging Face model that requires no token or payment:
- Model: `martin-ha/toxic-comment-model`
- No API token required
- Works out of the box

### CORS Configuration
API allows all origins by default. For production, update `SecurityConfig.java`:
```java
configuration.setAllowedOriginPatterns(Arrays.asList("https://yourdomain.com"));
```

## Error Handling

### Common Responses
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: AI service unavailable (falls back to traditional detection)

### Example Error Response
```json
{
  "error": "Message is required"
}
```

## Testing

Run tests:
```bash
mvn test
```

## Database Access
H2 Console: `http://localhost:8080/h2-console`
- URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)