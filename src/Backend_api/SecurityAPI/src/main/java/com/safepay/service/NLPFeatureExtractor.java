package com.safepay.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class NLPFeatureExtractor {
    
    private final Pattern wordPattern = Pattern.compile("\\b\\w+\\b");
    
    public Map<String, Double> extractFeatures(String message) {
        Map<String, Double> features = new HashMap<>();
        
        if (message == null || message.trim().isEmpty()) {
            return features;
        }
        
        String[] words = message.toLowerCase().split("\\s+");
        
        // Basic text statistics
        features.put("word_count", (double) words.length);
        features.put("char_count", (double) message.length());
        features.put("avg_word_length", calculateAvgWordLength(words));
        
        // Linguistic features
        features.put("exclamation_ratio", countPattern(message, "!") / (double) message.length());
        features.put("question_ratio", countPattern(message, "\\?") / (double) message.length());
        features.put("caps_ratio", calculateCapsRatio(message));
        features.put("digit_ratio", calculateDigitRatio(message));
        
        // Scam-specific features
        features.put("urgency_score", calculateUrgencyScore(words));
        features.put("money_mention_score", calculateMoneyScore(message));
        features.put("banking_score", calculateBankingScore(message));
        features.put("verification_score", calculateVerificationScore(words));
        
        // Readability and grammar
        features.put("grammar_score", calculateGrammarScore(message));
        features.put("spelling_errors", (double) countSpellingErrors(words));
        
        return features;
    }
    
    private double calculateAvgWordLength(String[] words) {
        return Arrays.stream(words)
            .mapToInt(String::length)
            .average()
            .orElse(0.0);
    }
    
    private int countPattern(String text, String pattern) {
        return text.split(pattern, -1).length - 1;
    }
    
    private double calculateCapsRatio(String message) {
        long capsCount = message.chars()
            .filter(Character::isUpperCase)
            .count();
        return (double) capsCount / message.length();
    }
    
    private double calculateDigitRatio(String message) {
        long digitCount = message.chars()
            .filter(Character::isDigit)
            .count();
        return (double) digitCount / message.length();
    }
    
    private double calculateUrgencyScore(String[] words) {
        Set<String> urgentWords = Set.of("urgent", "immediately", "asap", "now", 
            "quick", "fast", "hurry", "deadline", "expires", "limited");
        
        return Arrays.stream(words)
            .filter(urgentWords::contains)
            .count() / (double) words.length;
    }
    
    private double calculateMoneyScore(String message) {
        String lower = message.toLowerCase();
        double score = 0.0;
        
        if (lower.contains("r") && message.matches(".*R\\s*\\d+.*")) score += 0.3;
        if (lower.contains("money")) score += 0.2;
        if (lower.contains("cash")) score += 0.2;
        if (lower.contains("prize") || lower.contains("win")) score += 0.3;
        
        return Math.min(score, 1.0);
    }
    
    private double calculateBankingScore(String message) {
        String lower = message.toLowerCase();
        double score = 0.0;
        
        String[] banks = {"fnb", "capitec", "absa", "standard bank", "nedbank", "african bank"};
        for (String bank : banks) {
            if (lower.contains(bank)) score += 0.2;
        }
        
        String[] bankingTerms = {"account", "card", "pin", "otp", "banking"};
        for (String term : bankingTerms) {
            if (lower.contains(term)) score += 0.1;
        }
        
        return Math.min(score, 1.0);
    }
    
    private double calculateVerificationScore(String[] words) {
        Set<String> verifyWords = Set.of("verify", "confirm", "update", "validate", 
            "authenticate", "check", "review");
        
        return Arrays.stream(words)
            .filter(verifyWords::contains)
            .count() / (double) words.length;
    }
    
    private double calculateGrammarScore(String message) {
        // Simple grammar quality indicators
        double score = 1.0;
        
        // Penalize for common grammar issues in scams
        if (message.matches(".*\\b(u r|ur|pls|plz|thx)\\b.*")) score -= 0.3;
        if (message.matches(".*[a-z][A-Z].*")) score -= 0.2; // Mixed case within words
        if (!message.matches(".*[.!?]$")) score -= 0.1; // No proper ending
        
        return Math.max(score, 0.0);
    }
    
    private int countSpellingErrors(String[] words) {
        // Simple heuristic for common misspellings in scams
        Set<String> commonMisspellings = Set.of("recieve", "seperate", "occured", 
            "definately", "goverment", "bussiness");
        
        return (int) Arrays.stream(words)
            .filter(commonMisspellings::contains)
            .count();
    }
}