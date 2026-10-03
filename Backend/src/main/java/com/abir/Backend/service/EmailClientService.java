package com.abir.Backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Talks to the standalone Node.js + Nodemailer email microservice (EmailService/).
 * Failures are logged but never block the caller's business flow (email is best-effort).
 */
@Service
@Slf4j
public class EmailClientService {

    private final RestClient restClient;

    public EmailClientService(@Value("${app.email-service.base-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public void sendOtpEmail(String toEmail, String code, String purpose) {
        send("/send-otp", Map.of("to", toEmail, "code", code, "purpose", purpose));
    }

    public void sendNotificationEmail(String toEmail, String subject, String message) {
        send("/send-notification", Map.of("to", toEmail, "subject", subject, "message", message));
    }

    private void send(String path, Map<String, String> body) {
        try {
            restClient.post().uri(path).body(body).retrieve().toBodilessEntity();
        } catch (Exception ex) {
            log.warn("Email service call to {} failed: {}", path, ex.getMessage());
        }
    }
}
