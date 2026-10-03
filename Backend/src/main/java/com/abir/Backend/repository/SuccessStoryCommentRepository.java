package com.abir.Backend.repository;

import com.abir.Backend.entity.SuccessStoryComment;
import com.abir.Backend.entity.WomenCommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuccessStoryCommentRepository extends JpaRepository<SuccessStoryComment, Long> {
    
    List<SuccessStoryComment> findByPostOrderByCreatedAtAsc(WomenCommunityPost post);
    
    long countByPost(WomenCommunityPost post);
}
