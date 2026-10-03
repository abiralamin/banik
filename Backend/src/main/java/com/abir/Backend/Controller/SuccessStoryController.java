package com.abir.Backend.Controller;

import com.abir.Backend.dto.women.*;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.WomenSupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/success-stories")
@RequiredArgsConstructor
public class SuccessStoryController {

    private final WomenSupportService womenSupportService;

    @GetMapping
    public List<WomenCommunityPostResponse> getAllSuccessStories() {
        return womenSupportService.getSuccessStories(SecurityUtils.currentUser());
    }

    @GetMapping("/{id}")
    public WomenCommunityPostResponse getSuccessStoryById(@PathVariable Long id) {
        return womenSupportService.getSuccessStoryById(id, SecurityUtils.currentUser());
    }

    @PostMapping
    public WomenCommunityPostResponse createSuccessStory(@Valid @RequestBody CommunityPostCreateRequest request) {
        // All vendors can post success stories
        return womenSupportService.createSuccessStory(SecurityUtils.currentUser(), request);
    }

    @PostMapping("/{id}/like")
    public WomenCommunityPostResponse toggleLike(@PathVariable Long id) {
        return womenSupportService.toggleLike(SecurityUtils.currentUser(), id);
    }

    @PostMapping("/{id}/comments")
    public CommentResponse addComment(@PathVariable Long id, @Valid @RequestBody CommentCreateRequest request) {
        return womenSupportService.addComment(SecurityUtils.currentUser(), id, request);
    }

    @GetMapping("/{id}/comments")
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return womenSupportService.getComments(id);
    }
}
