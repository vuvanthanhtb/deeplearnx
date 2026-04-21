package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "roles", expression = "java(user.getRoles() != null ? user.getRoles().stream().map(r -> r.name()).collect(java.util.stream.Collectors.toList()) : java.util.List.of())")
  @Mapping(target = "status", expression = "java(user.getStatus() != null ? user.getStatus().name() : null)")
  @Mapping(target = "createdAt", expression = "java(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)")
  @Mapping(target = "updatedAt", expression = "java(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)")
  UserResponse toResponse(User user);

//  @Mapping(target = "id", ignore = true)
//  @Mapping(target = "password", ignore = true)
//  @Mapping(target = "roles", ignore = true)
//  @Mapping(target = "status", ignore = true)
//  @Mapping(target = "failedLoginAttempts", ignore = true)
//  @Mapping(target = "authorities", ignore = true)
//  @Mapping(target = "createdAt", ignore = true)
//  @Mapping(target = "updatedAt", ignore = true)
//  @Mapping(target = "createdBy", ignore = true)
//  @Mapping(target = "updatedBy", ignore = true)
//  User toEntity(RegisterRequest request);
}
