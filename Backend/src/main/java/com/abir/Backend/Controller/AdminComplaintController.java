package com.abir.Backend.Controller;

import com.abir.Backend.dto.complaint.ComplaintActionRequest;
import com.abir.Backend.dto.complaint.ComplaintResponse;
import com.abir.Backend.entity.ComplaintStatus;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/complaints")
@RequiredArgsConstructor
public class AdminComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    public Page<ComplaintResponse> list(@RequestParam(required = false) ComplaintStatus status,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size) {
        return complaintService.adminList(status, PageRequest.of(page, size));
    }

    @PostMapping("/{id}/action")
    public ComplaintResponse action(@PathVariable Long id, @Valid @RequestBody ComplaintActionRequest request) {
        return complaintService.adminAction(SecurityUtils.currentUser(), id, request);
    }
}
