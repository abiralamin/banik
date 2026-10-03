package com.abir.Backend.security;

import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {
    private SecurityUtils() {}

    public static com.abir.Backend.entity.User currentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof AuthenticatedUser au) {
            return au.getUser();
        }
        throw new IllegalStateException("No authenticated user in context");
    }
}
