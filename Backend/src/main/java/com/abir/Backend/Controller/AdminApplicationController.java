package com.abir.Backend.Controller;

import com.abir.Backend.dto.application.ApplicationDecisionRequest;
import com.abir.Backend.dto.application.ApplicationDocumentResponse;
import com.abir.Backend.dto.application.ApplicationResponse;
import com.abir.Backend.dto.application.BulkActionRequest;
import com.abir.Backend.entity.ApplicationDocument;
import com.abir.Backend.entity.ApplicationStatus;
import com.abir.Backend.entity.DocumentType;
import com.abir.Backend.repository.ApplicationDocumentRepository;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.LicenseApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
public class AdminApplicationController {

    private final LicenseApplicationService applicationService;
    private final ApplicationDocumentRepository documentRepository;

    @GetMapping
    public Page<ApplicationResponse> list(@RequestParam(required = false) ApplicationStatus status,
                                           @RequestParam(required = false) String search,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        return applicationService.adminList(status, search, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt")));
    }

    @GetMapping("/{id}")
    public ApplicationResponse get(@PathVariable Long id) {
        return applicationService.adminGet(id);
    }

    @GetMapping("/{id}/documents")
    public List<ApplicationDocumentResponse> getDocuments(@PathVariable Long id) {
        return documentRepository.findByApplicationId(id)
                .stream()
                .map(ApplicationDocumentResponse::fromEntity)
                .toList();
    }

    @PostMapping(value = "/{id}/documents", consumes = "multipart/form-data")
    public ResponseEntity<Void> uploadDocument(@PathVariable Long id,
                                                @RequestParam DocumentType docType,
                                                @RequestParam MultipartFile file) {
        applicationService.uploadDocumentAdmin(id, docType, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/decision")
    public ApplicationResponse decide(@PathVariable Long id, @Valid @RequestBody ApplicationDecisionRequest request) {
        return applicationService.decide(SecurityUtils.currentUser(), id, request);
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> bulk(@RequestBody BulkActionRequest request) {
        applicationService.bulkDecide(SecurityUtils.currentUser(), request);
        return ResponseEntity.ok().build();
    }
}
