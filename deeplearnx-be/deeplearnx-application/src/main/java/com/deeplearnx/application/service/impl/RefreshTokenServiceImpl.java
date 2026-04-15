package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.service.RefreshTokenService;
import com.deeplearnx.core.exception.ConflictException;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.infrastructure.persistence.UserRepository;
import com.deeplearnx.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

  private final JwtService jwtService;
  private final UserRepository userRepository;

  @Override
  public String create(User user) {
    return jwtService.generateRefreshToken(user);
  }

  @Override
  public User validateAndRotate(String token) {
    String username;
    try {
      username = jwtService.extractUsername(token);
    } catch (Exception e) {
      throw new ConflictException("Invalid or expired refresh token");
    }
    if (username == null) {
      throw new ConflictException("Invalid or expired refresh token");
    }
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new NotFoundException("User not found"));
  }

  @Override
  public void revokeAll(User user) {
    // stateless JWT — client phải tự discard token khi logout
  }
}
