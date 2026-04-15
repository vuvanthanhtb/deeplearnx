package com.deeplearnx.config;

import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserStatus;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.infrastructure.persistence.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${superadmin.username}")
  private String username;

  @Value("${superadmin.email}")
  private String email;

  @Value("${superadmin.password}")
  private String password;

  @Value("${superadmin.fullName}")
  private String fullName;

  @Override
  public void run(@NonNull ApplicationArguments args) {
    if (userRepository.existsByUsername(username)) {
      log.info("Superadmin already exists, skipping initialization.");
      return;
    }

    User superadmin = new User();
    superadmin.setUsername(username);
    superadmin.setEmail(email);
    superadmin.setPassword(passwordEncoder.encode(password));
    superadmin.setFullName(fullName);
    superadmin.setRoles(List.of(Role.SUPERADMIN));
    superadmin.setStatus(UserStatus.ACTIVE);

    userRepository.save(superadmin);
    log.info("Superadmin account created: {}", username);
  }
}
