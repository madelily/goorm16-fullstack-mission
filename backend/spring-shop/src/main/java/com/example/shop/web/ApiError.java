package com.example.shop.web;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        String message,
        LocalDateTime timestamp,
        Map<String, String> fieldErrors
) {
    public static ApiError of(String message) {
        return new ApiError(message, LocalDateTime.now(), null);
    }

    public static ApiError of(String message, Map<String, String> fieldErrors) {
        return new ApiError(message, LocalDateTime.now(), fieldErrors);
    }
}

