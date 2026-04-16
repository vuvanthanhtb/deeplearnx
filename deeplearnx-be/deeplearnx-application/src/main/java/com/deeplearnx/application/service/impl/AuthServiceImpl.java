package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.LoginRequest;
import com.deeplearnx.application.dto.request.RefreshTokenRequest;
import com.deeplearnx.application.dto.request.RegisterRequest;
import com.deeplearnx.application.dto.response.AuthResponse;
import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.application.mapper.UserMapper;
import com.deeplearnx.application.service.AuthService;
import com.deeplearnx.application.service.RefreshTokenService;
import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.entity.UserApproveStatus;
import com.deeplearnx.core.exception.ConflictException;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.domain.entity.UserApprove;
import com.deeplearnx.infrastructure.persistence.UserApproveRepository;
import com.deeplearnx.infrastructure.persistence.UserRepository;
import com.deeplearnx.infrastructure.security.JwtService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private static final int MAX_FAILED_ATTEMPTS = 5;

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final UserApproveRepository userApproveRepository;
  private final PasswordEncoder passwordEncoder;
  private final ObjectMapper objectMapper;
  private final RefreshTokenService refreshTokenService;
  private final UserMapper userMapper;

  @Override
  public String register(RegisterRequest request) {
    log.info("Register request for username={}", request.username());
    if (userRepository.existsByUsername(request.username())) {
      throw new ConflictException("Username already taken");
    }
    if (userRepository.existsByEmail(request.email())) {
      throw new ConflictException("Email already registered");
    }

    RegisterRequest encodedRequest = new RegisterRequest(
        request.username(),
        request.email(),
        passwordEncoder.encode(request.password()),
        request.fullName()
    );

    UserApprove approve = new UserApprove();
    approve.setAction(UserApproveAction.REGISTER);
    approve.setStatus(UserApproveStatus.APPROVING);
    approve.setPayload(toJson(encodedRequest));
    approve.setUsername(request.username());
    approve.setEmail(request.email());
    approve.setFullName(request.fullName());
    approve.setRoles(List.of(Role.USER));
    userApproveRepository.save(approve);
    log.info("Register approval created for username={}", request.username());
    return "Registration submitted successfully. Please wait for approver approval.";
  }

  @Override
  public AuthResponse login(LoginRequest request) {
    log.info("Login attempt for username={}", request.username());
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.username(), request.password())
      );
    } catch (BadCredentialsException e) {
      log.warn("Login failed for username={}", request.username());
      handleFailedAttempt(request.username());
      throw e;
    }
    User user = userRepository.findByUsername(request.username())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    resetFailedAttempts(user);
    log.info("Login successful for username={}", request.username());
    return buildAuthResponse(user);
  }

  @Override
  public AuthResponse refresh(RefreshTokenRequest request) {
    User user = refreshTokenService.validateAndRotate(request.refreshToken());
    return buildAuthResponse(user);
  }

  @Override
  public void logout(User currentUser) {
    log.info("Logout for username={}", currentUser.getUsername());
    refreshTokenService.revokeAll(currentUser);
  }

  @Override
  public UserResponse getProfile(User user) {
    return userMapper.toResponse(user);
  }

  private void handleFailedAttempt(String username) {
    userRepository.findByUsername(username).ifPresent(user -> {
      int attempts = user.getFailedLoginAttempts() + 1;
      user.setFailedLoginAttempts(attempts);
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        user.setStatus(com.deeplearnx.core.entity.UserStatus.LOCKED);
      }
      userRepository.save(user);
    });
  }

  private void resetFailedAttempts(User user) {
    if (user.getFailedLoginAttempts() > 0) {
      user.setFailedLoginAttempts(0);
      userRepository.save(user);
    }
  }

  private AuthResponse buildAuthResponse(User user) {
    return new AuthResponse(
        jwtService.generateToken(user),
        refreshTokenService.create(user)
    );
  }

  private String toJson(Object obj) {
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize payload", e);
    }
  }
}
