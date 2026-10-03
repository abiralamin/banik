package com.abir.Backend.repository;

import com.abir.Backend.entity.Announcement;
import com.abir.Backend.entity.AnnouncementRead;
import com.abir.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnouncementReadRepository extends JpaRepository<AnnouncementRead, Long> {
    Optional<AnnouncementRead> findByAnnouncementAndUser(Announcement announcement, User user);
    void deleteByAnnouncementAndUser(Announcement announcement, User user);
}