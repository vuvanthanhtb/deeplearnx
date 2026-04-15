package com.deeplearnx.application.service;

import com.deeplearnx.domain.entity.User;

public interface RefreshTokenService {

  String create(User user);

  User validateAndRotate(String token);

  void revokeAll(User user);
}
