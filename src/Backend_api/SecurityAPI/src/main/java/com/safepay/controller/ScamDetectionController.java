package com.safepay.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safepay.model.ScamDetectionRequest;
import com.safepay.model.ScamDetectionResult;
import com.safepay.service.ScamDetectionService;

/**
 * Controller for handling scam detection requests.
 * This class provides endpoints for interacting with the scam detection service.
 */
@RestController
@RequestMapping("/api/scam")
@CrossOrigin(origins = "*")
public class ScamDetectionController {

    @Autowired
    private ScamDetectionService scamDetectionService;

    /**
     * Constructor for ScamDetectionController.
     * 
     * @param scamDetectionService the service used for scam detection.
     */
    public ScamDetectionController(ScamDetectionService scamDetectionService) {
        this.scamDetectionService = scamDetectionService;
    }

    /**
     * Endpoint for detecting scams.
     * 
     * @param request the request containing data for scam detection.
     * @return the result of the scam detection.
     */
    @PostMapping("/detect")
    public ResponseEntity<ScamDetectionResult> detectScam(@RequestBody ScamDetectionRequest request) {
        ScamDetectionResult result = scamDetectionService.detectScam(request.getMessage());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/analyze")
    public ResponseEntity<ScamDetectionResult> analyzeMessage(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        ScamDetectionResult result = scamDetectionService.analyzeMessage(message);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/analyze/batch")
    public ResponseEntity<Map<String, ScamDetectionResult>> analyzeMessages(@RequestBody Map<String, List<String>> request) {
        List<String> messages = request.get("messages");
        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, ScamDetectionResult> results = scamDetectionService.analyzeMessages(messages);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "scam-detection"));
    }
}