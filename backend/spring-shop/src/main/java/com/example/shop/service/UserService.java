package com.example.shop.service;

import com.example.shop.domain.user.Role;
import com.example.shop.domain.user.User;
import com.example.shop.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(User user) {
        return signup(user.getEmail(), user.getPassword(), user.getName());
    }

    public User signup(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateEmailException();
        }

        String encodedPassword = passwordEncoder.encode(password);
        User newUser = new User(email, encodedPassword, name, Role.USER);
        return userRepository.save(newUser);
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalStateException("현재 비밀번호가 올바르지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustChangePassword(false);
    }
}
