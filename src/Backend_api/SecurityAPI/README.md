# SafePay Connect API - AI Enhanced

## Advanced AI/NLP & Security Integration

### Features
- **AI-Powered Scam Detection**: Hugging Face BERT model integration
- **Advanced NLP Analysis**: Feature extraction and sentiment analysis
- **Multi-layered Detection**: Traditional ML + AI + Sentiment scoring
- **South African Context**: Localized scam patterns and banking terms
- **Batch Processing**: Analyze multiple messages simultaneously

### API Endpoints

#### AI-Enhanced Scam Detection
```
POST /api/ai-scam/analyze
{
  "message": "URGENT: Your FNB account suspended. Verify at http://fake-fnb.co.za"
}

Response:
{
  "isScam": true,
  "confidence": 0.85,
  "riskLevel": "HIGH",
  "detectedPatterns": [
    "Urgency language detected",
    "Banking institution mentioned", 
    "Shortened URL detected"
  ],
  "recommendation": "HIGH RISK: Strong scam indicators detected...",
  "analysisType": "AI_ENHANCED"
}
```

#### Batch Analysis
```
POST /api/ai-scam/batch-analyze
{
  "messages": [
    "Your statement is ready",
    "URGENT: Click here to claim R5000!"
  ]
}

Response:
{
  "results": [...],
  "totalAnalyzed": 2,
  "scamCount": 1
}
```

#### NLP Feature Extraction
```
POST /api/ai-scam/features
{
  "message": "URGENT! Your account needs verification NOW!!!"
}

Response:
{
  "features": {
    "word_count": 6.0,
    "urgency_score": 0.33,
    "caps_ratio": 0.45,
    "exclamation_ratio": 0.08
  }
}
```

### AI Model Integration

#### Hugging Face Setup
1. Get API token from https://huggingface.co/settings/tokens
2. Update `application.properties`:
```
huggingface.api.token=hf_your_actual_token_here
```

#### Models Used
- **Primary**: `unitary/toxic-bert` - Toxicity/scam detection
- **Fallback**: Rule-based NLP when API unavailable

### Advanced Detection Features

#### Multi-layered Analysis
- **Traditional ML** (40%): Pattern matching, keywords
- **AI Model** (40%): BERT-based toxicity detection  
- **Sentiment Analysis** (20%): Urgency and pressure tactics

#### South African Localization
- Banking institutions: FNB, Capitec, ABSA, Standard Bank, Nedbank
- Local scam types: SASSA, COVID relief, TERS, UIF
- Currency patterns: Rand (R) amount detection
- Phone number patterns: SA mobile formats

#### NLP Features
- Text statistics (word count, character count)
- Linguistic patterns (caps ratio, punctuation)
- Grammar quality scoring
- Spelling error detection
- Urgency and pressure language

### Running the Application
```bash
cd API
mvn spring-boot:run
```

Server: http://localhost:8080

### Integration Notes
- **Frontend**: Call `/api/ai-scam/analyze` for real-time detection
- **Backend**: Use batch processing for historical analysis
- **Fallback**: System works without AI token (reduced accuracy)