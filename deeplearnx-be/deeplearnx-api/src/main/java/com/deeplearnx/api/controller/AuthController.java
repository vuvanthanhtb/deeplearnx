package com.deeplearnx.api.controller;

import com.deeplearnx.application.dto.request.LoginRequest;
import com.deeplearnx.application.dto.request.RefreshTokenRequest;
import com.deeplearnx.application.dto.request.RegisterRequest;
import com.deeplearnx.application.dto.response.AuthResponse;
import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.application.mapper.UserMapper;
import com.deeplearnx.application.service.AuthService;
import com.deeplearnx.core.response.ApiResponse;
import com.deeplearnx.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final UserMapper userMapper;

  @PostMapping("/register")
  public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(authService.register(request)));
  }

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.login(request)));
  }

  @PostMapping("/refresh")
  public ResponseEntity<ApiResponse<AuthResponse>> refresh(
      @RequestBody RefreshTokenRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.refresh(request)));
  }

  @PostMapping("/logout")
  public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal User currentUser) {
    authService.logout(currentUser);
    return ResponseEntity.ok(ApiResponse.ok("Logged out successfully"));
  }

  @GetMapping("/me")
  public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(ApiResponse.ok(userMapper.toResponse(user)));
  }
}
