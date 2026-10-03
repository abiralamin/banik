package com.abir.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "application_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private LicenseApplication application;

    @Enumerated(EnumType.STRING)
    @Column(name = "doc_type", nullable = false, length = 20)
    private DocumentType docType;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "original_name")
    private String originalName;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
