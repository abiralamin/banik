package com.abir.Backend.service;

import com.abir.Backend.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf");

    @Value("${app.upload.dir}")
    private String uploadDir;

    public String store(MultipartFile file, String subFolder) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("Uploaded file is empty");
        }
        String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String extension = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase()
                : "";
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw ApiException.badRequest("Unsupported file type: " + extension + ". Only PDF files are allowed.");
        }

        try {
            Path folder = Path.of(uploadDir, subFolder);
            Files.createDirectories(folder);
            String safeName = UUID.randomUUID() + "." + extension;
            Path target = folder.resolve(safeName);
            file.transferTo(target);
            return subFolder + "/" + safeName;
        } catch (IOException e) {
            throw ApiException.badRequest("Failed to store uploaded file: " + e.getMessage());
        }
    }
}
