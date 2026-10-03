package com.abir.Backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ApiError {
    private final LocalDateTime timestamp;
    private final int status;
    private final String message;
    private final Map<String, String> fieldErrors;

    public ApiError(int status, String message) {
        this(LocalDateTime.now(), status, message, null);
    }

    public ApiError(int status, String message, Map<String, String> fieldErrors) {
        this(LocalDateTime.now(), status, message, fieldErrors);
    }
}
