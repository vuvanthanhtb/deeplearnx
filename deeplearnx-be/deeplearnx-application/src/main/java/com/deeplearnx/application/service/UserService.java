package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.core.response.PageResponse;
import com.deeplearnx.domain.entity.User;

public interface UserService {

  User findByUsername(String username);

  PageResponse<UserResponse> findAll(String username, String email, String fullName, String role,
      String status, String fromDate, String toDate, int page, int size);

  UserResponse findById(Long id);
}
