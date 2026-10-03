package com.abir.Backend.repository;

import com.abir.Backend.entity.SuccessStoryLike;
import com.abir.Backend.entity.WomenCommunityPost;
import com.abir.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SuccessStoryLikeRepository extends JpaRepository<SuccessStoryLike, Long> {
    
    Optional<SuccessStoryLike> findByPostAndUser(WomenCommunityPost post, User user);
    
    List<SuccessStoryLike> findByPost(WomenCommunityPost post);
    
    long countByPost(WomenCommunityPost post);
    
    void deleteByPostAndUser(WomenCommunityPost post, User user);
}
