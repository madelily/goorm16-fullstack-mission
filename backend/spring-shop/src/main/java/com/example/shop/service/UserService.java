package com.example.shop.service;

import com.example.shop.domain.user.Role;
import com.example.shop.domain.user.User;
import com.example.shop.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User signup(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        User newUser = new User(user.getEmail(), user.getPassword(), Role.USER);
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
}

