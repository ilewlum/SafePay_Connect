package com.safepay.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safepay.model.ScamDetectionResult;
import com.safepay.service.AIScamDetectionService;
import com.safepay.service.NLPFeatureExtractor;

/**
 * Controller for handling AI scam detection requests.
 * This class provides endpoints for interacting with the AI scam detection service.
 */
@RestController
@RequestMapping("/api/ai-scam")
@CrossOrigin(origins = "*")
public class AIScamController {
    
    @Autowired
    private AIScamDetectionService aiScamService;
    
    @Autowired
    private NLPFeatureExtractor featureExtractor;
    
    /**
     * Endpoint for detecting scams using AI.
     * 
     * @param request the request containing data for scam detection.
     * @return the result of the scam detection.
     */
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeWithAI(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }
        
        ScamDetectionResult result = aiScamService.analyzeMessage(message);
        
        return ResponseEntity.ok(Map.of(
            "isScam", result.isScam(),
            "confidence", result.getConfidence(),
            "riskLevel", result.getRiskLevel(),
            "detectedPatterns", result.getDetectedPatterns(),
            "recommendation", result.getRecommendation(),
            "analysisType", "AI_ENHANCED"
        ));
    }
    
    /**
     * Endpoint for batch analyzing messages for scams.
     * 
     * @param request the request containing an array of messages for scam detection.
     * @return the results of the scam detection for the batch of messages.
     */
    @PostMapping("/batch-analyze")
    public ResponseEntity<Map<String, Object>> batchAnalyze(@RequestBody Map<String, List<String>> request) {
        List<String> messages = request.get("messages");
        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Messages array is required"));
        }
        
        List<Map<String, Object>> results = new ArrayList<>();
        for (String message : messages) {
            ScamDetectionResult result = aiScamService.analyzeMessage(message);
            results.add(Map.of(
                "message", message,
                "isScam", result.isScam(),
                "confidence", result.getConfidence(),
                "riskLevel", result.getRiskLevel()
            ));
        }
        
        return ResponseEntity.ok(Map.of(
            "results", results,
            "totalAnalyzed", results.size(),
            "scamCount", results.stream().mapToInt(r -> (Boolean) r.get("isScam") ? 1 : 0).sum()
        ));
    }
    
    /**
     * Endpoint for extracting features from a message.
     * 
     * @param request the request containing the message for feature extraction.
     * @return the extracted features of the message.
     */
    @PostMapping("/features")
    public ResponseEntity<Map<String, Object>> extractFeatures(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }
        
        Map<String, Double> features = featureExtractor.extractFeatures(message);
        
        return ResponseEntity.ok(Map.of(
            "message", message,
            "features", features,
            "featureCount", features.size()
        ));
    }
}