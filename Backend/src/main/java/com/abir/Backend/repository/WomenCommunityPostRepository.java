package com.abir.Backend.repository;

import com.abir.Backend.entity.WomenCommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WomenCommunityPostRepository extends JpaRepository<WomenCommunityPost, Long> {
    List<WomenCommunityPost> findByIsSuccessStoryTrueOrderByCreatedAtDesc();
    List<WomenCommunityPost> findAllByOrderByCreatedAtDesc();
}