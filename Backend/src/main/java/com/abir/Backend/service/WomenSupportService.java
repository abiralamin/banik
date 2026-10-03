package com.abir.Backend.service;

import com.abir.Backend.dto.women.*;
import com.abir.Backend.entity.Gender;
import com.abir.Backend.entity.SuccessStoryComment;
import com.abir.Backend.entity.SuccessStoryLike;
import com.abir.Backend.entity.User;
import com.abir.Backend.entity.WomenCommunityPost;
import com.abir.Backend.entity.WomenScheme;
import com.abir.Backend.entity.SafetyTip;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.SafetyTipRepository;
import com.abir.Backend.repository.SuccessStoryCommentRepository;
import com.abir.Backend.repository.SuccessStoryLikeRepository;
import com.abir.Backend.repository.WomenCommunityPostRepository;
import com.abir.Backend.repository.WomenSchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WomenSupportService {

    private final WomenSchemeRepository womenSchemeRepository;
    private final WomenCommunityPostRepository communityPostRepository;
    private final SafetyTipRepository safetyTipRepository;
    private final SuccessStoryLikeRepository likeRepository;
    private final SuccessStoryCommentRepository commentRepository;

    public List<WomenSchemeResponse> getActiveSchemes() {
        List<WomenScheme> schemes = womenSchemeRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        return schemes.stream()
                .map(this::toSchemeResponse)
                .collect(Collectors.toList());
    }

    public List<WomenCommunityPostResponse> getSuccessStories() {
        return getSuccessStories(null);
    }

    public List<WomenCommunityPostResponse> getSuccessStories(User currentUser) {
        List<WomenCommunityPost> posts = communityPostRepository.findByIsSuccessStoryTrueOrderByCreatedAtDesc();
        return posts.stream()
                .map(post -> toPostResponse(post, currentUser))
                .collect(Collectors.toList());
    }

    public WomenCommunityPostResponse getSuccessStoryById(Long postId, User currentUser) {
        WomenCommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> ApiException.notFound("Post not found"));
        
        if (!post.isSuccessStory()) {
            throw ApiException.badRequest("Not a success story");
        }
        
        return toPostResponse(post, currentUser);
    }

    public List<WomenCommunityPostResponse> getAllCommunityPosts() {
        List<WomenCommunityPost> posts = communityPostRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .map(post -> toPostResponse(post, null))
                .collect(Collectors.toList());
    }

    public List<SafetyTipResponse> getSafetyTips() {
        List<SafetyTip> tips = safetyTipRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        return tips.stream()
                .map(this::toTipResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WomenCommunityPostResponse createCommunityPost(User user, CommunityPostCreateRequest request) {
        // For success stories, allow all vendors
        // For regular community posts, only allow female vendors
        if (!request.isSuccessStory()) {
            if (user.getVendorProfile() == null || user.getVendorProfile().getGender() != Gender.FEMALE) {
                throw ApiException.forbidden("Only female vendors can access women's community features");
            }
        }

        WomenCommunityPost post = WomenCommunityPost.builder()
                .vendor(user)
                .title(request.title())
                .content(request.content())
                .isSuccessStory(request.isSuccessStory())
                .build();
        post = communityPostRepository.save(post);
        return toPostResponse(post, user);
    }

    @Transactional
    public WomenCommunityPostResponse createSuccessStory(User user, CommunityPostCreateRequest request) {
        // All vendors can post success stories - no gender check
        WomenCommunityPost post = WomenCommunityPost.builder()
                .vendor(user)
                .title(request.title())
                .content(request.content())
                .isSuccessStory(true)
                .build();
        post = communityPostRepository.save(post);
        return toPostResponse(post, user);
    }

    @Transactional
    public WomenCommunityPostResponse toggleLike(User user, Long postId) {
        WomenCommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        if (!post.isSuccessStory()) {
            throw ApiException.badRequest("Only success stories can be liked");
        }

        SuccessStoryLike existingLike = likeRepository.findByPostAndUser(post, user).orElse(null);

        if (existingLike != null) {
            likeRepository.delete(existingLike);
        } else {
            SuccessStoryLike like = SuccessStoryLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            likeRepository.save(like);
        }

        return toPostResponse(post, user);
    }

    @Transactional
    public CommentResponse addComment(User user, Long postId, CommentCreateRequest request) {
        WomenCommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        if (!post.isSuccessStory()) {
            throw ApiException.badRequest("Only success stories can be commented on");
        }

        SuccessStoryComment comment = SuccessStoryComment.builder()
                .post(post)
                .user(user)
                .content(request.content())
                .build();
        comment = commentRepository.save(comment);

        String userName = user.getVendorProfile() != null 
            ? user.getVendorProfile().getFullName() 
            : user.getEmail();

        return new CommentResponse(
                comment.getId(),
                userName,
                comment.getContent(),
                comment.getCreatedAt()
        );
    }

    public List<CommentResponse> getComments(Long postId) {
        WomenCommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        return commentRepository.findByPostOrderByCreatedAtAsc(post).stream()
                .map(comment -> {
                    String userName = comment.getUser() != null 
                        ? (comment.getUser().getVendorProfile() != null 
                            ? comment.getUser().getVendorProfile().getFullName() 
                            : comment.getUser().getEmail())
                        : "Anonymous";
                    return new CommentResponse(
                            comment.getId(),
                            userName,
                            comment.getContent(),
                            comment.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    private WomenSchemeResponse toSchemeResponse(WomenScheme scheme) {
        return new WomenSchemeResponse(
                scheme.getId(),
                scheme.getTitle(),
                scheme.getDescription(),
                scheme.getBenefits(),
                scheme.getEligibilityCriteria(),
                scheme.getApplicationProcess(),
                scheme.getDeadline(),
                scheme.getContactInfo(),
                scheme.isActive(),
                scheme.getCreatedAt()
        );
    }

    private WomenCommunityPostResponse toPostResponse(WomenCommunityPost post, User currentUser) {
        String vendorName = post.getVendor() != null 
            ? (post.getVendor().getVendorProfile() != null 
                ? post.getVendor().getVendorProfile().getFullName() 
                : post.getVendor().getEmail())
            : "Anonymous";
        
        long likesCount = likeRepository.countByPost(post);
        long commentsCount = commentRepository.countByPost(post);
        boolean isLikedByCurrentUser = currentUser != null && likeRepository.findByPostAndUser(post, currentUser).isPresent();
        
        List<CommentResponse> comments = commentRepository.findByPostOrderByCreatedAtAsc(post).stream()
                .map(comment -> {
                    String userName = comment.getUser() != null 
                        ? (comment.getUser().getVendorProfile() != null 
                            ? comment.getUser().getVendorProfile().getFullName() 
                            : comment.getUser().getEmail())
                        : "Anonymous";
                    return new CommentResponse(
                            comment.getId(),
                            userName,
                            comment.getContent(),
                            comment.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
        
        return new WomenCommunityPostResponse(
                post.getId(),
                vendorName,
                post.getTitle(),
                post.getContent(),
                post.isSuccessStory(),
                post.getCreatedAt(),
                likesCount,
                commentsCount,
                isLikedByCurrentUser,
                comments
        );
    }

    private SafetyTipResponse toTipResponse(SafetyTip tip) {
        return new SafetyTipResponse(
                tip.getId(),
                tip.getTitle(),
                tip.getContent(),
                tip.getTipCategory(),
                tip.getEmergencyContact(),
                tip.isActive(),
                tip.getCreatedAt()
        );
    }
}