package com.abir.Backend.Controller;

import com.abir.Backend.dto.AnnouncementRequest;
import com.abir.Backend.entity.Announcement;
import com.abir.Backend.entity.AnnouncementRead;
import com.abir.Backend.entity.User;
import com.abir.Backend.repository.AnnouncementReadRepository;
import com.abir.Backend.repository.AnnouncementRepository;
import com.abir.Backend.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementReadRepository announcementReadRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAnnouncements() {
        try {
            User user = SecurityUtils.currentUser();
            List<Announcement> announcements = announcementRepository.findAll();
            // Sort by createdAt in descending order
            announcements.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

            List<Map<String, Object>> response = announcements.stream()
                    .map(a -> {
                        Map<String, Object> announcementData = new HashMap<>();
                        announcementData.put("id", a.getId());
                        announcementData.put("title", a.getTitle());
                        announcementData.put("message", a.getMessage());
                        announcementData.put("createdAt", a.getCreatedAt());
                        boolean isRead = announcementReadRepository.findByAnnouncementAndUser(a, user).isPresent();
                        announcementData.put("isRead", isRead);
                        return announcementData;
                    })
                    .toList();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Integer>> getUnreadCount() {
        try {
            User user = SecurityUtils.currentUser();
            List<Announcement> allAnnouncements = announcementRepository.findAll();
            long unreadCount = allAnnouncements.stream()
                    .filter(a -> announcementReadRepository.findByAnnouncementAndUser(a, user).isEmpty())
                    .count();
            Map<String, Integer> response = new HashMap<>();
            response.put("count", (int) unreadCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            User user = SecurityUtils.currentUser();
            Announcement announcement = announcementRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Announcement not found"));

            if (announcementReadRepository.findByAnnouncementAndUser(announcement, user).isEmpty()) {
                AnnouncementRead announcementRead = AnnouncementRead.builder()
                        .announcement(announcement)
                        .user(user)
                        .build();
                announcementReadRepository.save(announcementRead);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark as read: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/unread")
    public ResponseEntity<?> markAsUnread(@PathVariable Long id) {
        try {
            User user = SecurityUtils.currentUser();
            Announcement announcement = announcementRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Announcement not found"));

            announcementReadRepository.findByAnnouncementAndUser(announcement, user)
                    .ifPresent(announcementReadRepository::delete);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark as unread: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        try {
            Announcement announcement = Announcement.builder()
                    .title(request.getTitle())
                    .message(request.getMessage())
                    .build();
            Announcement saved = announcementRepository.save(announcement);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create announcement: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete announcement: " + e.getMessage());
        }
    }
}
