package com.abir.Backend.Controller;

import com.abir.Backend.dto.women.*;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.WomenSupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/women-support")
@RequiredArgsConstructor
public class WomenSupportController {

    private final WomenSupportService womenSupportService;

    @GetMapping("/schemes")
    public List<WomenSchemeResponse> getSchemes() {
        return womenSupportService.getActiveSchemes();
    }

    @GetMapping("/community/success-stories")
    public List<WomenCommunityPostResponse> getSuccessStories() {
        return womenSupportService.getSuccessStories(SecurityUtils.currentUser());
    }

    @GetMapping("/community/success-stories/{id}")
    public WomenCommunityPostResponse getSuccessStoryById(@PathVariable Long id) {
        return womenSupportService.getSuccessStoryById(id, SecurityUtils.currentUser());
    }

    @GetMapping("/community/posts")
    public List<WomenCommunityPostResponse> getAllCommunityPosts() {
        return womenSupportService.getAllCommunityPosts();
    }

    @PostMapping("/community/posts")
    public WomenCommunityPostResponse createCommunityPost(@Valid @RequestBody CommunityPostCreateRequest request) {
        return womenSupportService.createCommunityPost(SecurityUtils.currentUser(), request);
    }

    @PostMapping("/community/success-stories/{id}/like")
    public WomenCommunityPostResponse toggleLike(@PathVariable Long id) {
        return womenSupportService.toggleLike(SecurityUtils.currentUser(), id);
    }

    @PostMapping("/community/success-stories/{id}/comments")
    public CommentResponse addComment(@PathVariable Long id, @Valid @RequestBody CommentCreateRequest request) {
        return womenSupportService.addComment(SecurityUtils.currentUser(), id, request);
    }

    @GetMapping("/community/success-stories/{id}/comments")
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return womenSupportService.getComments(id);
    }

    @GetMapping("/safety-tips")
    public List<SafetyTipResponse> getSafetyTips() {
        return womenSupportService.getSafetyTips();
    }
}