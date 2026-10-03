package com.abir.Backend.dto.application;

public record BulkActionRequest(java.util.List<Long> applicationIds, String action, String reason) {}
