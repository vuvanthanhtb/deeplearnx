package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.request.LoginRequest;
import com.deeplearnx.application.dto.request.RefreshTokenRequest;
import com.deeplearnx.application.dto.request.RegisterRequest;
import com.deeplearnx.application.dto.response.AuthResponse;
import com.deeplearnx.domain.entity.User;

public interface AuthService {

  String register(RegisterRequest request);

  AuthResponse login(LoginRequest request);

  AuthResponse refresh(RefreshTokenRequest request);

  void logout(User currentUser);
}
