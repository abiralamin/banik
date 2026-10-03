package com.abir.Backend.Controller;

import com.abir.Backend.dto.women.WomenSchemeResponse;
import com.abir.Backend.entity.WomenScheme;
import com.abir.Backend.repository.WomenSchemeRepository;
import com.abir.Backend.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/women-support")
@RequiredArgsConstructor
public class AdminWomenSupportController {

    private final WomenSchemeRepository womenSchemeRepository;

    @GetMapping("/schemes")
    public List<WomenSchemeResponse> getAllSchemes() {
        List<WomenScheme> schemes = womenSchemeRepository.findAllByOrderByCreatedAtDesc();
        return schemes.stream()
                .map(this::toSchemeResponse)
                .toList();
    }

    @PostMapping("/schemes")
    public WomenSchemeResponse createScheme(@Valid @RequestBody WomenSchemeRequest request) {
        WomenScheme scheme = WomenScheme.builder()
                .title(request.title())
                .description(request.description())
                .benefits(request.benefits())
                .eligibilityCriteria(request.eligibilityCriteria())
                .applicationProcess(request.applicationProcess())
                .deadline(request.deadline())
                .contactInfo(request.contactInfo())
                .isActive(true)
                .build();
        scheme = womenSchemeRepository.save(scheme);
        return toSchemeResponse(scheme);
    }

    @PutMapping("/schemes/{id}")
    public WomenSchemeResponse updateScheme(@PathVariable Long id, @Valid @RequestBody WomenSchemeRequest request) {
        WomenScheme scheme = womenSchemeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        scheme.setTitle(request.title());
        scheme.setDescription(request.description());
        scheme.setBenefits(request.benefits());
        scheme.setEligibilityCriteria(request.eligibilityCriteria());
        scheme.setApplicationProcess(request.applicationProcess());
        scheme.setDeadline(request.deadline());
        scheme.setContactInfo(request.contactInfo());

        scheme = womenSchemeRepository.save(scheme);
        return toSchemeResponse(scheme);
    }

    @DeleteMapping("/schemes/{id}")
    public void deleteScheme(@PathVariable Long id) {
        womenSchemeRepository.deleteById(id);
    }

    @PatchMapping("/schemes/{id}/toggle-active")
    public WomenSchemeResponse toggleActive(@PathVariable Long id) {
        WomenScheme scheme = womenSchemeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));
        scheme.setActive(!scheme.isActive());
        scheme = womenSchemeRepository.save(scheme);
        return toSchemeResponse(scheme);
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

    record WomenSchemeRequest(
            String title,
            String description,
            String benefits,
            String eligibilityCriteria,
            String applicationProcess,
            String deadline,
            String contactInfo
    ) {}
}
