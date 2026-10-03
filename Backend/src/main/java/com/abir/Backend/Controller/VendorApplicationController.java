package com.abir.Backend.Controller;

import com.abir.Backend.dto.application.ApplicationDocumentResponse;
import com.abir.Backend.dto.application.ApplicationResponse;
import com.abir.Backend.dto.application.ApplicationSubmitRequest;
import com.abir.Backend.entity.DocumentType;
import com.abir.Backend.repository.ApplicationDocumentRepository;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.LicenseApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/applications")
@RequiredArgsConstructor
public class VendorApplicationController {

    private final LicenseApplicationService applicationService;
    private final ApplicationDocumentRepository documentRepository;

    @PostMapping
    public ResponseEntity<ApplicationResponse> submit(@Valid @RequestBody ApplicationSubmitRequest request) {
        return ResponseEntity.ok(applicationService.submit(SecurityUtils.currentUser(), request));
    }

    @GetMapping
    public List<ApplicationResponse> listMine() {
        return applicationService.listMine(SecurityUtils.currentUser());
    }

    @GetMapping("/{id}")
    public ApplicationResponse get(@PathVariable Long id) {
        return applicationService.get(SecurityUtils.currentUser(), id);
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Void> withdraw(@PathVariable Long id) {
        applicationService.withdraw(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Void> payFee(@PathVariable Long id) {
        applicationService.payApplicationFee(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/{id}/documents", consumes = "multipart/form-data")
    public ResponseEntity<Void> uploadDocument(@PathVariable Long id,
                                                @RequestParam DocumentType docType,
                                                @RequestParam MultipartFile file) {
        applicationService.uploadDocument(SecurityUtils.currentUser(), id, docType, file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/documents")
    public List<ApplicationDocumentResponse> getDocuments(@PathVariable Long id) {
        return documentRepository.findByApplicationId(id)
                .stream()
                .map(ApplicationDocumentResponse::fromEntity)
                .toList();
    }
}
