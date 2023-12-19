package com.kob.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println(passwordEncoder.encode("12345678"));
        System.out.println(passwordEncoder.matches("12345678", "$2a$10$/JTj9mzvFvDgaeqFO8ShNuW9VMLyLawzmm/ARO9eGFfsxCFrO89G."));
    }

}
