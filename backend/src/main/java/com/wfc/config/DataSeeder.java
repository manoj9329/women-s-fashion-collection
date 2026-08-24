package com.wfc.config;

import com.wfc.entity.User;
import com.wfc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@wfc.com")) {
            User admin = User.builder()
                    .email("admin@wfc.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .name("Shop Owner")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin created: admin@wfc.com / Admin@123");
        }
    }
}
