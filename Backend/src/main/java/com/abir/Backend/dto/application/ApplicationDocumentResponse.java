package com.abir.Backend.dto.application;

import com.abir.Backend.entity.DocumentType;

import java.time.LocalDateTime;

public record ApplicationDocumentResponse(
        Long id,
        DocumentType docType,
        String filePath,
        String originalName,
        LocalDateTime uploadedAt
) {
    public static ApplicationDocumentResponse fromEntity(com.abir.Backend.entity.ApplicationDocument doc) {
        return new ApplicationDocumentResponse(
                doc.getId(),
                doc.getDocType(),
                doc.getFilePath(),
                doc.getOriginalName(),
                doc.getUploadedAt()
        );
    }
}
