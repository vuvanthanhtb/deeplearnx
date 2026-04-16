package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.request.RegisterRequest;
import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserResponse toResponse(User user);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "password", ignore = true)
  @Mapping(target = "roles", ignore = true)
  @Mapping(target = "status", ignore = true)
  @Mapping(target = "failedLoginAttempts", ignore = true)
  @Mapping(target = "authorities", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  @Mapping(target = "updatedBy", ignore = true)
  User toEntity(RegisterRequest request);
}
