package com.abir.Backend.dto.complaint;

import jakarta.validation.constraints.NotBlank;

public record ComplaintActionRequest(@NotBlank String action, String comment) {}
// actions: RESPOND, IN_PROGRESS, RESOLVE, CLOSE, REOPEN, ESCALATE, REASSIGN
