package com.safepay.model;

import java.util.List;

public class ScamDetectionResult {
    private boolean isScam;
    private double confidence;
    private String riskLevel;
    private List<String> detectedPatterns;
    private String recommendation;

    public ScamDetectionResult(boolean isScam, double confidence, String riskLevel, 
                              List<String> detectedPatterns, String recommendation) {
        this.isScam = isScam;
        this.confidence = confidence;
        this.riskLevel = riskLevel;
        this.detectedPatterns = detectedPatterns;
        this.recommendation = recommendation;
    }

    public boolean isScam() { return isScam; }
    public double getConfidence() { return confidence; }
    public String getRiskLevel() { return riskLevel; }
    public List<String> getDetectedPatterns() { return detectedPatterns; }
    public String getRecommendation() { return recommendation; }
}