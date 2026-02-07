package com.example.shop.web.dto;

import com.example.shop.domain.user.Role;
import com.example.shop.domain.user.User;

public record MeResponse(
        Long id,
        String email,
        String name,
        Role role,
        boolean mustChangePassword
) {
    public static MeResponse from(User user) {
        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.isMustChangePassword()
        );
    }
}

