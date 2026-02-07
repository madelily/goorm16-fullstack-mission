package com.example.shop.web.dto;

import com.example.shop.domain.user.Role;
import com.example.shop.domain.user.User;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String name,
        Role role,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}

