package com.safepay.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.safepay.model.ScamDetectionResult;

/**
 * Service for detecting SMS/WhatsApp payment scams targeting South African users
 * This class contains methods for detecting scams based on various criteria.
 */
@Service
public class ScamDetectionService {

    // Urgency keywords that indicate potential scams
    private static final Set<String> URGENCY_KEYWORDS = Set.of(
        "URGENT", "IMMEDIATELY", "EXPIRES", "EXPIRING", "LIMITED TIME",
        "ACT NOW", "DON'T WAIT", "TIME SENSITIVE", "DEADLINE"
    );

    // Fake banking phrases commonly used in scams
    private static final Set<String> FAKE_BANKING_PHRASES = Set.of(
        "FNB ACCOUNT SUSPENDED", "CAPITEC BLOCKED", "ABSA ACCOUNT LOCKED",
        "STANDARD BANK SECURITY ALERT", "NEDBANK VERIFICATION REQUIRED",
        "BANK ACCOUNT DEACTIVATED", "CARD BLOCKED", "ACCOUNT SUSPENDED"
    );

    // Money scam patterns
    private static final Set<String> MONEY_SCAM_PATTERNS = Set.of(
        "YOU'VE WON R", "CLAIM YOUR R", "FREE MONEY", "WINNINGS OF R",
        "LUCKY DRAW", "PRIZE MONEY", "CASH REWARD", "BONUS PAYMENT"
    );

    // Suspicious URL patterns
    private static final Pattern SUSPICIOUS_URL_PATTERN = Pattern.compile(
        "(?i)(bit\\.ly|tinyurl\\.com|goo\\.gl|t\\.co|shorturl|fakebank|scamlink)"
    );

    // Non-HTTPS URL pattern
    private static final Pattern NON_HTTPS_PATTERN = Pattern.compile(
        "(?i)http://[^s]"
    );

    // Poor grammar indicators (common in scam messages)
    private static final Set<String> POOR_GRAMMAR_INDICATORS = Set.of(
        "PLS", "PLZ", "THX", "U R", "YOUR ACCOUNT HAS BEEN", "WE HAVE DETECTED",
        "CLICK HERE", "VERIFY NOW", "UPDATE DETAILS", "CONFIRM IDENTITY"
    );

    /**
     * Analyzes a message for potential scam indicators
     * @param message The SMS/WhatsApp message to analyze
     * @return ScamDetectionResult with analysis results
     */
    public ScamDetectionResult analyzeMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return new ScamDetectionResult(false, 0.0, "LOW",
                Collections.emptyList(), "Message appears to be empty or invalid.");
        }

        List<String> detectedPatterns = new ArrayList<>();
        double confidence = 0.0;
        boolean isScam = false;

        // Convert to uppercase for case-insensitive matching
        String upperMessage = message.toUpperCase();

        // Check for urgency keywords
        for (String keyword : URGENCY_KEYWORDS) {
            if (upperMessage.contains(keyword)) {
                detectedPatterns.add("Urgency keyword: " + keyword);
                confidence += 0.2;
            }
        }

        // Check for fake banking phrases
        for (String phrase : FAKE_BANKING_PHRASES) {
            if (upperMessage.contains(phrase)) {
                detectedPatterns.add("Fake banking phrase: " + phrase);
                confidence += 0.3;
                isScam = true;
            }
        }

        // Check for money scam patterns
        for (String pattern : MONEY_SCAM_PATTERNS) {
            if (upperMessage.contains(pattern)) {
                detectedPatterns.add("Money scam pattern: " + pattern);
                confidence += 0.25;
                isScam = true;
            }
        }

        // Check for suspicious URLs
        if (SUSPICIOUS_URL_PATTERN.matcher(message).find()) {
            detectedPatterns.add("Suspicious URL detected");
            confidence += 0.4;
            isScam = true;
        }

        // Check for non-HTTPS links
        if (NON_HTTPS_PATTERN.matcher(message).find()) {
            detectedPatterns.add("Non-HTTPS link detected");
            confidence += 0.15;
        }

        // Check for poor grammar indicators
        for (String indicator : POOR_GRAMMAR_INDICATORS) {
            if (upperMessage.contains(indicator)) {
                detectedPatterns.add("Poor grammar/formality indicator: " + indicator);
                confidence += 0.1;
            }
        }

        // Additional checks for South African context
        if (upperMessage.contains("SARS") && upperMessage.contains("TAX")) {
            detectedPatterns.add("SARS tax scam pattern");
            confidence += 0.35;
            isScam = true;
        }

        if (upperMessage.contains("COVID") && upperMessage.contains("RELIEF")) {
            detectedPatterns.add("COVID relief scam pattern");
            confidence += 0.3;
            isScam = true;
        }

        // Cap confidence at 1.0
        confidence = Math.min(confidence, 1.0);

        // Determine risk level
        String riskLevel;
        if (confidence >= 0.7 || isScam) {
            riskLevel = "HIGH";
        } else if (confidence >= 0.4) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        // Generate recommendation
        String recommendation = generateRecommendation(riskLevel, detectedPatterns);

        return new ScamDetectionResult(isScam, confidence, riskLevel, detectedPatterns, recommendation);
    }

    /**
     * Generates user-friendly recommendations based on risk level and detected patterns
     */
    private String generateRecommendation(String riskLevel, List<String> detectedPatterns) {
        switch (riskLevel) {
            case "HIGH":
                return "HIGH RISK: This message shows strong indicators of being a scam. " +
                       "Do not click any links, share personal information, or make payments. " +
                       "Report to your bank and authorities if you've already engaged.";

            case "MEDIUM":
                return "MEDIUM RISK: This message contains some suspicious elements. " +
                       "Verify the sender's identity through official channels before taking action. " +
                       "Avoid clicking links from unknown sources.";

            case "LOW":
                return "LOW RISK: This message appears relatively safe, but always verify " +
                       "important information through official channels.";

            default:
                return "Unable to determine risk level. Exercise caution and verify information.";
        }
    }

    /**
     * Batch analysis for multiple messages
     * @param messages List of messages to analyze
     * @return Map of message to analysis result
     */
    public Map<String, ScamDetectionResult> analyzeMessages(List<String> messages) {
        // Analyze each message for potential scams
        // The results are stored in a map with the message as the key and the analysis result as the value
        Map<String, ScamDetectionResult> results = new HashMap<>();
        for (String message : messages) {
            // Analyze the message and store the result
            results.put(message, analyzeMessage(message));
        }
        // Return the map containing all analysis results
        return results;
    }

    /**
     * Detects potential scams in the provided message.
     * This method analyzes the message content for urgency keywords and other indicators of scams.
     * 
     * @param message The message content to analyze.
     * @return ScamDetectionResult containing the results of the detection.
     */
    public ScamDetectionResult detectScam(String message) {
        boolean isScam = false;
        double confidence = 0.0;
        String riskLevel = "LOW";
        List<String> detectedPatterns = new ArrayList<>();
        String recommendation = "No scam detected.";

        if (message != null && !message.trim().isEmpty()) {
            String msgLower = message.toLowerCase();
            // Urgency keywords
            for (String keyword : URGENCY_KEYWORDS) {
                if (msgLower.contains(keyword.toLowerCase())) {
                    detectedPatterns.add("Urgency keyword: " + keyword);
                    isScam = true;
                }
            }
            // Fake banking phrases
            for (String phrase : FAKE_BANKING_PHRASES) {
                if (msgLower.contains(phrase.toLowerCase())) {
                    detectedPatterns.add("Fake banking phrase: " + phrase);
                    isScam = true;
                }
            }
            // Money scam patterns
            for (String pattern : MONEY_SCAM_PATTERNS) {
                if (msgLower.contains(pattern.toLowerCase())) {
                    detectedPatterns.add("Money scam pattern: " + pattern);
                    isScam = true;
                }
            }
            // Suspicious URLs
            if (SUSPICIOUS_URL_PATTERN.matcher(msgLower).find()) {
                detectedPatterns.add("Suspicious URL detected");
                isScam = true;
            }
            // Non-HTTPS links
            if (NON_HTTPS_PATTERN.matcher(message).find()) {
                detectedPatterns.add("Non-HTTPS link detected");
                isScam = true;
            }
            // Poor grammar indicators
            for (String indicator : POOR_GRAMMAR_INDICATORS) {
                if (msgLower.contains(indicator.toLowerCase())) {
                    detectedPatterns.add("Poor grammar indicator: " + indicator);
                    isScam = true;
                }
            }
            // Confidence and risk level
            int patternCount = detectedPatterns.size();
            if (isScam) {
                confidence = Math.min(0.5 + 0.1 * patternCount, 1.0);
                riskLevel = confidence >= 0.8 ? "HIGH" : confidence >= 0.5 ? "MEDIUM" : "LOW";
                // Tailored recommendation
                if (detectedPatterns.stream().anyMatch(p -> p.contains("URL"))) {
                    recommendation = "Suspicious link detected. Do not click or share personal information.";
                } else if (detectedPatterns.stream().anyMatch(p -> p.contains("banking"))) {
                    recommendation = "Potential banking scam detected. Contact your bank through official channels.";
                } else if (detectedPatterns.stream().anyMatch(p -> p.contains("Money scam"))) {
                    recommendation = "Money scam detected. Ignore and delete this message.";
                } else {
                    recommendation = "Potential scam detected. Do not respond or share personal information.";
                }
            } else {
                confidence = 0.1;
                riskLevel = "LOW";
                recommendation = "Message appears safe.";
            }
        } else {
            recommendation = "Message is empty - LOW RISK.";
        }

        return new ScamDetectionResult(isScam, confidence, riskLevel, detectedPatterns, recommendation);
    }
}