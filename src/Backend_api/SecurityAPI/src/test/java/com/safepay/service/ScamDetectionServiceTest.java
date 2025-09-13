package com.safepay.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.safepay.model.ScamDetectionResult;

@SpringBootTest
public class ScamDetectionServiceTest {

    @Autowired
    private ScamDetectionService scamDetectionService;

    @Test
    public void testAnalyzeScamMessage() {
        // Test message with multiple scam indicators
        String scamMessage = "URGENT: Your FNB account has been suspended. " +
                           "Click here to verify: http://fakebank.co.za/verify " +
                           "You've won R5000! Claim now!";

        ScamDetectionResult result = scamDetectionService.analyzeMessage(scamMessage);

        assertTrue(result.isScam());
        assertEquals("HIGH", result.getRiskLevel());
        assertTrue(result.getConfidence() > 0.7);
        assertFalse(result.getDetectedPatterns().isEmpty());
        assertTrue(result.getRecommendation().contains("HIGH RISK"));
    }

    @Test
    public void testAnalyzeSafeMessage() {
        // Test legitimate message
        String safeMessage = "Your monthly statement is ready. " +
                           "Please log into your online banking at https://www.fnb.co.za";

        ScamDetectionResult result = scamDetectionService.analyzeMessage(safeMessage);

        assertFalse(result.isScam());
        assertEquals("LOW", result.getRiskLevel());
        assertTrue(result.getConfidence() < 0.4);
        assertTrue(result.getRecommendation().contains("LOW RISK"));
    }

    @Test
    public void testUrgencyKeywords() {
        String message = "URGENT: Your payment is due immediately!";
        ScamDetectionResult result = scamDetectionService.analyzeMessage(message);

        assertTrue(result.getDetectedPatterns().stream()
                .anyMatch(pattern -> pattern.contains("Urgency keyword")));
        assertTrue(result.getConfidence() > 0);
    }

    @Test
    public void testFakeBankingPhrase() {
        String message = "FNB ACCOUNT SUSPENDED - Please verify your details";
        ScamDetectionResult result = scamDetectionService.analyzeMessage(message);

        assertTrue(result.isScam());
        assertTrue(result.getDetectedPatterns().stream()
                .anyMatch(pattern -> pattern.contains("Fake banking phrase")));
        assertTrue(result.getConfidence() >= 0.3);
    }

    @Test
    public void testMoneyScamPattern() {
        String message = "Congratulations! You've won R10000 in our lucky draw!";
        ScamDetectionResult result = scamDetectionService.analyzeMessage(message);

        assertTrue(result.isScam());
        assertTrue(result.getDetectedPatterns().stream()
                .anyMatch(pattern -> pattern.contains("Money scam pattern")));
    }

    @Test
    public void testSuspiciousUrl() {
        String message = "Please click this link: https://bit.ly/scam-link";
        ScamDetectionResult result = scamDetectionService.analyzeMessage(message);

        assertTrue(result.isScam());
        assertTrue(result.getDetectedPatterns().stream()
                .anyMatch(pattern -> pattern.contains("Suspicious URL")));
    }

    @Test
    public void testEmptyMessage() {
        ScamDetectionResult result = scamDetectionService.analyzeMessage("");

        assertFalse(result.isScam());
        assertEquals("LOW", result.getRiskLevel());
        assertEquals(0.0, result.getConfidence());
        assertTrue(result.getRecommendation().contains("empty"));
    }

    @Test
    public void testNullMessage() {
        ScamDetectionResult result = scamDetectionService.analyzeMessage(null);

        assertFalse(result.isScam());
        assertEquals("LOW", result.getRiskLevel());
        assertEquals(0.0, result.getConfidence());
    }
}