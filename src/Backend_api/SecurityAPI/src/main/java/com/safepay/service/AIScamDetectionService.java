package com.safepay.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.safepay.model.ScamDetectionResult;

/**
 * Service for AI-based scam detection.
 * This class contains the business logic for detecting scams using AI techniques.
 */
@Service
public class AIScamDetectionService {
    /**
     * Analyzes a message for scam indicators and returns a ScamDetectionResult.
     * This method is used by controllers to provide a simple interface.
     * @param message The message to analyze.
     * @return ScamDetectionResult containing scam analysis.
     */
    public ScamDetectionResult analyzeMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return new ScamDetectionResult(false, 0.0, "LOW", new ArrayList<>(), "Message is empty - LOW RISK");
        }
        double traditionalScore = performTraditionalAnalysis(message);
        double aiScore = performAIAnalysis(message);
        double sentimentScore = analyzeSentiment(message);
        double finalConfidence = (traditionalScore * 0.4) + (aiScore * 0.4) + (sentimentScore * 0.2);
        finalConfidence = Math.min(finalConfidence, 1.0);
        List<String> patterns = detectPatterns(message);
        boolean isScam = finalConfidence >= 0.6;
        String riskLevel = finalConfidence >= 0.8 ? "HIGH" : finalConfidence >= 0.4 ? "MEDIUM" : "LOW";
        String recommendation = generateAdvancedRecommendation(finalConfidence, patterns);
        return new ScamDetectionResult(isScam, finalConfidence, riskLevel, patterns, recommendation);
    }
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String HUGGING_FACE_API = "https://api-inference.huggingface.co/models/martin-ha/toxic-comment-model";
    private final String HF_TOKEN = ""; // Free model - no token required
    
    // Advanced pattern matching
    private final Pattern phonePattern = Pattern.compile("(?:(?:\\+27|0)[1-9]\\d{8})|(?:0[6-8]\\d{8})");
    private final Pattern bankingPattern = Pattern.compile("(?i)(fnb|capitec|absa|standard bank|nedbank|african bank)");
    private final Pattern amountPattern = Pattern.compile("R\\s*\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?");
    private final Pattern urgencyPattern = Pattern.compile("(?i)(urgent|asap|immediately|expires?|deadline|limited time)");
    
    // South African specific scam indicators
    private final Set<String> saScamKeywords = Set.of(
        "sassa", "covid relief", "ters", "uif", "sars refund", "lottery sa", 
        "capitec sms", "fnb cellphone banking", "nedbank money", "absa cash send"
    );
    
    /**
     * Detects scams based on the provided request.
     * 
     * @param request the request containing data for scam detection.
     * @return the result of the scam detection.
     */
    // public ScamDetectionResult detectScam(ScamDetectionRequest request) {
    //     String message = request.getMessage();
    //     if (message == null || message.trim().isEmpty()) {
    //         return new ScamDetectionResult(false, 0.0, "LOW", new ArrayList<>(), "Message is empty - LOW RISK");
    //     }
    //     double traditionalScore = performTraditionalAnalysis(message);
    //     double aiScore = performAIAnalysis(message);
    //     double sentimentScore = analyzeSentiment(message);
    //     double finalConfidence = (traditionalScore * 0.4) + (aiScore * 0.4) + (sentimentScore * 0.2);
    //     finalConfidence = Math.min(finalConfidence, 1.0);
    //     List<String> patterns = detectPatterns(message);
    //     boolean isScam = finalConfidence >= 0.6;
    //     String riskLevel = finalConfidence >= 0.8 ? "HIGH" : finalConfidence >= 0.4 ? "MEDIUM" : "LOW";
    //     String recommendation = generateAdvancedRecommendation(finalConfidence, patterns);
    //     return new ScamDetectionResult(isScam, finalConfidence, riskLevel, patterns, recommendation);
    // }
    
    private double performTraditionalAnalysis(String message) {
        String lower = message.toLowerCase();
        double score = 0.0;
        
        // Urgency indicators
        if (urgencyPattern.matcher(message).find()) score += 0.2;
        
        // Banking + verification combo
        if (bankingPattern.matcher(message).find() && lower.contains("verify")) score += 0.3;
        
        // Money amounts with suspicious context
        if (amountPattern.matcher(message).find() && 
            (lower.contains("won") || lower.contains("claim"))) score += 0.25;
        
        // SA-specific scams
        for (String keyword : saScamKeywords) {
            if (lower.contains(keyword)) score += 0.15;
        }
        
        // Suspicious links
        if (message.matches(".*https?://(?!.*\\.(fnb|capitec|absa|standardbank|nedbank)\\.co\\.za).*")) {
            score += 0.3;
        }
        
        return Math.min(score, 1.0);
    }
    
    private double performAIAnalysis(String message) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (!HF_TOKEN.isEmpty()) {
                headers.setBearerAuth(HF_TOKEN);
            }
            
            Map<String, Object> requestBody = Map.of("inputs", message);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                HUGGING_FACE_API, HttpMethod.POST, entity,
                (Class<List<Map<String, Object>>>) (Class<?>) List.class);

            if (response.getBody() != null && !response.getBody().isEmpty()) {
                List<Map<String, Object>> results = response.getBody();
                if (!results.isEmpty()) {
                    Map<String, Object> result = results.get(0);
                    if (result.containsKey("score")) {
                        Double score = (Double) result.get("score");
                        return score > 0.5 ? score : 0.0;
                    }
                }
            }
        } catch (Exception e) {
            // Fallback to rule-based if AI fails
            return performFallbackAI(message);
        }
        
        return 0.0;
    }
    
    private double performFallbackAI(String message) {
        // Simple NLP-like analysis as fallback
        String[] words = message.toLowerCase().split("\\s+");
        Set<String> scamWords = Set.of("urgent", "winner", "claim", "verify", "suspended", 
            "click", "prize", "lottery", "congratulations", "free", "guaranteed");
        
        long scamWordCount = Arrays.stream(words)
            .filter(scamWords::contains)
            .count();
        
        return Math.min((double) scamWordCount / words.length * 2, 1.0);
    }
    
    private double analyzeSentiment(String message) {
        // Simple sentiment analysis for urgency/pressure tactics
        String lower = message.toLowerCase();
        double urgencyScore = 0.0;

        String[] urgentPhrases = {"act now", "don't wait", "limited time", "expires soon", 
            "immediate action", "verify now", "click here now"};

        for (String phrase : urgentPhrases) {
            if (lower.contains(phrase)) urgencyScore += 0.2;
        }

        // Excessive punctuation (!!!, ???)
        if (message.matches(".*[!?]{3,}.*")) urgencyScore += 0.1;

        // ALL CAPS words
        long capsWords = Arrays.stream(message.split("\\s+"))
            .filter(word -> word.length() > 2 && word.equals(word.toUpperCase()))
            .count();

        if (capsWords > 2) urgencyScore += 0.15;

        return Math.min(urgencyScore, 1.0);
    }
    
    private List<String> detectPatterns(String message) {
        List<String> patterns = new ArrayList<>();
        String lower = message.toLowerCase();
        
        if (phonePattern.matcher(message).find()) {
            patterns.add("South African phone number detected");
        }
        
        if (bankingPattern.matcher(message).find()) {
            patterns.add("Banking institution mentioned");
        }
        
        if (amountPattern.matcher(message).find()) {
            patterns.add("Monetary amount in Rand detected");
        }
        
        if (urgencyPattern.matcher(message).find()) {
            patterns.add("Urgency language detected");
        }
        
        if (lower.contains("verify") && lower.contains("account")) {
            patterns.add("Account verification request");
        }
        
        if (message.matches(".*https?://bit\\.ly.*|.*tinyurl.*|.*t\\.co.*")) {
            patterns.add("Shortened URL detected");
        }
        
        for (String keyword : saScamKeywords) {
            if (lower.contains(keyword)) {
                patterns.add("SA-specific scam keyword: " + keyword);
            }
        }
        
        return patterns;
    }
    
    private String generateAdvancedRecommendation(double confidence, List<String> patterns) {
        if (confidence >= 0.8) {
            return "HIGH RISK: Strong scam indicators detected. Block sender, do not respond, " +
                   "and report to SAFPS (South African Fraud Prevention Service).";
        } else if (confidence >= 0.6) {
            return "MEDIUM-HIGH RISK: Multiple suspicious patterns found. Verify through " +
                   "official bank channels before taking any action.";
        } else if (confidence >= 0.4) {
            return "MEDIUM RISK: Some concerning elements detected. Exercise caution and " +
                   "verify sender identity through official means.";
        } else {
            return "LOW RISK: Message appears legitimate, but always verify important " +
                   "financial communications through official channels.";
        }
    }
}