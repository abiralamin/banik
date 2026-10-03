package com.abir.Backend.service;

import com.abir.Backend.dto.feedback.FeedbackCreateRequest;
import com.abir.Backend.dto.feedback.FeedbackResponse;
import com.abir.Backend.entity.Feedback;
import com.abir.Backend.entity.User;
import com.abir.Backend.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public List<FeedbackResponse> getAllFeedback() {
        List<Feedback> feedback = feedbackRepository.findByIsAnonymousFalseOrderByCreatedAtDesc();
        return feedback.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getMyFeedback(User vendor) {
        List<Feedback> feedback = feedbackRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
        return feedback.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackResponse submitFeedback(User vendor, FeedbackCreateRequest request) {
        Feedback feedback = Feedback.builder()
                .vendor(request.isAnonymous() ? null : vendor)
                .rating(request.rating())
                .message(request.message())
                .featureRequest(request.featureRequest())
                .isAnonymous(request.isAnonymous())
                .build();
        feedback = feedbackRepository.save(feedback);
        return toResponse(feedback);
    }

    private FeedbackResponse toResponse(Feedback feedback) {
        String vendorName = feedback.getVendor() != null 
            ? (feedback.getVendor().getVendorProfile() != null 
                ? feedback.getVendor().getVendorProfile().getFullName() 
                : feedback.getVendor().getEmail())
            : "Anonymous";
        String vendorEmail = feedback.getVendor() != null ? feedback.getVendor().getEmail() : null;
        
        return new FeedbackResponse(
                feedback.getId(),
                vendorName,
                vendorEmail,
                feedback.getRating(),
                feedback.getMessage(),
                feedback.getFeatureRequest(),
                feedback.isAnonymous(),
                feedback.getCreatedAt()
        );
    }
}