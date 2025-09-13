package com.safepay.model;

/**
 * Request class for scam detection containing the necessary data for analysis.
 */
public class ScamDetectionRequest {
    private String message;
    private String sender;
    // Add any other fields you need for scam detection

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}