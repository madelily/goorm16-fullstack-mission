package com.example.shop.service;

import com.example.shop.domain.user.User;
import com.example.shop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String mailFrom;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${app.mail.from:help@sampleshop.test}") String mailFrom
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
    }

    public void resetWithTempPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return;
        }

        String tempPassword = TempPasswordGenerator.generate(12);
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setMustChangePassword(true);

        sendTempPasswordEmail(email, tempPassword);
    }

    private void sendTempPasswordEmail(String to, String tempPassword) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(to);
        msg.setSubject("[Sample Shop] 임시 비밀번호 안내");
        msg.setText("""
                요청하신 임시 비밀번호를 안내드립니다.

                임시 비밀번호: %s

                로그인 후 반드시 비밀번호를 변경해 주세요.
                만약 본인이 요청하지 않았다면 고객센터로 문의해 주세요.
                """.formatted(tempPassword));
        mailSender.send(msg);
    }
}

