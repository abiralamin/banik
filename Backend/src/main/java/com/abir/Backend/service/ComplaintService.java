package com.abir.Backend.service;

import com.abir.Backend.dto.complaint.ComplaintActionRequest;
import com.abir.Backend.dto.complaint.ComplaintResponse;
import com.abir.Backend.dto.complaint.ComplaintSubmitRequest;
import com.abir.Backend.entity.*;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.ComplaintEvidenceRepository;
import com.abir.Backend.repository.ComplaintHistoryRepository;
import com.abir.Backend.repository.ComplaintRepository;
import com.abir.Backend.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final ComplaintRepository complaintRepository;
    private final ComplaintEvidenceRepository evidenceRepository;
    private final ComplaintHistoryRepository historyRepository;
    private final LicenseRepository licenseRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ComplaintResponse submit(User vendor, ComplaintSubmitRequest req) {
        License license = licenseRepository.findById(req.licenseId())
                .orElseThrow(() -> ApiException.notFound("Selected license not found"));
        if (!license.getVendor().getId().equals(vendor.getId())) {
            throw ApiException.forbidden("You do not have access to this license");
        }
        Complaint complaint = Complaint.builder()
                .vendor(vendor)
                .license(license)
                .trackingNumber(generateTrackingNumber())
                .subject(req.subject())
                .category(ComplaintCategory.valueOf(req.category().toUpperCase()))
                .description(req.description())
                .priority(req.priority() == null || req.priority().isBlank() ? Priority.MEDIUM : Priority.valueOf(req.priority().toUpperCase()))
                .anonymous(req.anonymous())
                .status(ComplaintStatus.OPEN)
                .build();
        complaint = complaintRepository.save(complaint);
        recordHistory(complaint, vendor, "SUBMITTED", "Complaint submitted");
        return toResponse(complaint);
    }

    @Transactional
    public void addEvidence(User vendor, Long complaintId, MultipartFile file) {
        Complaint complaint = getOwnedOrThrow(vendor, complaintId);
        String path = fileStorageService.store(file, "complaints/" + complaintId);
        evidenceRepository.save(com.abir.Backend.entity.ComplaintEvidence.builder()
                .complaint(complaint).filePath(path).build());
    }

    public List<ComplaintResponse> listMine(User vendor, Long licenseId) {
        List<Complaint> complaints = licenseId != null
                ? complaintRepository.findByLicenseIdOrderByCreatedAtDesc(licenseId)
                : complaintRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
        return complaints.stream()
                .filter(c -> c.getVendor().getId().equals(vendor.getId()))
                .map(this::toResponse).toList();
    }

    public List<ComplaintResponse> listForVendorAdmin(Long vendorId) {
        return complaintRepository.findByVendorIdOrderByCreatedAtDesc(vendorId)
                .stream().map(this::toResponse).toList();
    }

    public ComplaintResponse get(User vendor, Long id) {
        return toResponse(getOwnedOrThrow(vendor, id));
    }

    @Transactional
    public void followUp(User vendor, Long id, String comment) {
        Complaint complaint = getOwnedOrThrow(vendor, id);
        recordHistory(complaint, vendor, "FOLLOW_UP", comment);
    }

    @Transactional
    public void closeByVendor(User vendor, Long id) {
        Complaint complaint = getOwnedOrThrow(vendor, id);
        complaint.setStatus(ComplaintStatus.CLOSED);
        complaintRepository.save(complaint);
        recordHistory(complaint, vendor, "CLOSED_BY_VENDOR", null);
    }

    @Transactional
    public void escalate(User vendor, Long id) {
        Complaint complaint = getOwnedOrThrow(vendor, id);
        complaint.setPriority(Priority.HIGH);
        complaintRepository.save(complaint);
        recordHistory(complaint, vendor, "ESCALATED", "Escalated by vendor");
    }

    public Page<ComplaintResponse> adminList(ComplaintStatus status, Pageable pageable) {
        Page<Complaint> page = status != null ? complaintRepository.findByStatus(status, pageable) : complaintRepository.findAll(pageable);
        return page.map(this::toResponse);
    }

    @Transactional
    public ComplaintResponse adminAction(User admin, Long id, ComplaintActionRequest req) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Complaint not found"));
        switch (req.action().toUpperCase()) {
            case "IN_PROGRESS" -> complaint.setStatus(ComplaintStatus.IN_PROGRESS);
            case "RESOLVE" -> complaint.setStatus(ComplaintStatus.RESOLVED);
            case "CLOSE" -> complaint.setStatus(ComplaintStatus.CLOSED);
            case "REOPEN" -> complaint.setStatus(ComplaintStatus.OPEN);
            case "RESPOND" -> { /* comment recorded in history below */ }
            default -> throw ApiException.badRequest("Unknown action: " + req.action());
        }
        complaintRepository.save(complaint);
        recordHistory(complaint, admin, req.action().toUpperCase(), req.comment());
        return toResponse(complaint);
    }

    private String generateTrackingNumber() {
        return "CMP-" + System.currentTimeMillis() % 1000000 + "-" + (100 + RANDOM.nextInt(900));
    }

    private Complaint getOwnedOrThrow(User vendor, Long id) {
        Complaint c = complaintRepository.findById(id).orElseThrow(() -> ApiException.notFound("Complaint not found"));
        if (!c.getVendor().getId().equals(vendor.getId())) {
            throw ApiException.forbidden("You do not have access to this complaint");
        }
        return c;
    }

    private void recordHistory(Complaint complaint, User actor, String action, String comment) {
        historyRepository.save(com.abir.Backend.entity.ComplaintHistory.builder()
                .complaint(complaint).actor(actor).action(action).comment(comment).build());
    }

    private ComplaintResponse toResponse(Complaint c) {
        return new ComplaintResponse(c.getId(),
                c.getLicense() == null ? null : c.getLicense().getId(),
                c.getLicense() == null ? null : c.getLicense().getLicenseNumber(),
                c.getLicense() == null ? null : c.getLicense().getZone().getName(),
                c.getTrackingNumber(), c.getSubject(), c.getCategory().name(),
                c.getDescription(), c.getPriority().name(), c.isAnonymous(), c.getStatus().name(), c.getCreatedAt());
    }
}
