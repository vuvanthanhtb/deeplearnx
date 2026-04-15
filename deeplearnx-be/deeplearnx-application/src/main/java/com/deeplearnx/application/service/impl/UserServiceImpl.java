package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.application.mapper.UserMapper;
import com.deeplearnx.application.service.UserService;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.core.response.PageResponse;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.infrastructure.persistence.UserQueryRepository;
import com.deeplearnx.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final UserQueryRepository userQueryRepository;
  private final UserMapper userMapper;

  @Override
  public User findByUsername(String username) {
    return userRepository.findByUsername(username).orElse(null);
  }

  @Override
  public PageResponse<UserResponse> findAll(String username, String email, String fullName,
      String role, String status, String fromDate, String toDate, int page, int size) {
    return PageResponse.of(
        userQueryRepository.search(username, email, fullName, role, status, fromDate, toDate,
            PageRequest.of(page, size)),
        userMapper::toResponse);
  }

  @Override
  public UserResponse findById(Long id) {
    return userMapper.toResponse(
        userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found")));
  }
}
