package com.example.shop.web;

import com.example.shop.service.UserService;
import com.example.shop.web.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserPasswordController {

    private final UserService userService;

    public UserPasswordController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        String email = authentication.getName();
        userService.changePassword(email, request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}

