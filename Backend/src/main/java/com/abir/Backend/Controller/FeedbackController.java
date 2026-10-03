package com.abir.Backend.Controller;

import com.abir.Backend.dto.feedback.FeedbackCreateRequest;
import com.abir.Backend.dto.feedback.FeedbackResponse;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    public List<FeedbackResponse> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/my")
    public List<FeedbackResponse> getMyFeedback() {
        return feedbackService.getMyFeedback(SecurityUtils.currentUser());
    }

    @PostMapping
    public FeedbackResponse submitFeedback(@Valid @RequestBody FeedbackCreateRequest request) {
        return feedbackService.submitFeedback(SecurityUtils.currentUser(), request);
    }
}