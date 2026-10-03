package com.abir.Backend.Controller;

import com.abir.Backend.dto.complaint.ComplaintResponse;
import com.abir.Backend.dto.complaint.ComplaintSubmitRequest;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/complaints")
@RequiredArgsConstructor
public class VendorComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ComplaintResponse submit(@Valid @RequestBody ComplaintSubmitRequest request) {
        return complaintService.submit(SecurityUtils.currentUser(), request);
    }

    @GetMapping
    public List<ComplaintResponse> listMine(@RequestParam(required = false) Long licenseId) {
        return complaintService.listMine(SecurityUtils.currentUser(), licenseId);
    }

    @GetMapping("/{id}")
    public ComplaintResponse get(@PathVariable Long id) {
        return complaintService.get(SecurityUtils.currentUser(), id);
    }

    @PostMapping(value = "/{id}/evidence", consumes = "multipart/form-data")
    public ResponseEntity<Void> addEvidence(@PathVariable Long id, @RequestParam MultipartFile file) {
        complaintService.addEvidence(SecurityUtils.currentUser(), id, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/follow-up")
    public ResponseEntity<Void> followUp(@PathVariable Long id, @RequestParam String comment) {
        complaintService.followUp(SecurityUtils.currentUser(), id, comment);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<Void> close(@PathVariable Long id) {
        complaintService.closeByVendor(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<Void> escalate(@PathVariable Long id) {
        complaintService.escalate(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok().build();
    }
}
