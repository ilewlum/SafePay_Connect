package com.safepay.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safepay.service.EncryptionService;

/**
 * Controller for handling transaction-related requests.
 * This class provides endpoints for managing transactions.
 */
@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private EncryptionService encryptionService;
    
    /**
     * Endpoint for verifying a transaction.
     * 
     * @param request the request containing transaction details for verification.
     * @return the result of the transaction verification.
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyTransaction(@RequestBody Map<String, String> request) {
        try {
            String amount = request.get("amount");
            String recipient = request.get("recipient");
            
            if (amount == null || recipient == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount and recipient required"));
            }
            
            String transactionId = encryptionService.generateTransactionId();
            String verificationCode = String.valueOf((int)(Math.random() * 900000) + 100000);
            
            return ResponseEntity.ok(Map.of(
                "transactionId", transactionId,
                "verificationCode", verificationCode,
                "status", "pending_verification",
                "expiresIn", 300
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Verification failed"));
        }
    }
    
    /**
     * Endpoint for confirming a transaction.
     * 
     * @param request the request containing transaction details for confirmation.
     * @return the result of the transaction confirmation.
     */
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmTransaction(@RequestBody Map<String, String> request) {
        String transactionId = request.get("transactionId");
        String verificationCode = request.get("verificationCode");
        
        if (transactionId == null || verificationCode == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Transaction ID and verification code required"));
        }
        
        return ResponseEntity.ok(Map.of(
            "transactionId", transactionId,
            "status", "confirmed",
            "timestamp", System.currentTimeMillis()
        ));
    }
}