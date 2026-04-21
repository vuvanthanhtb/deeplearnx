package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.UserApproveResponse;
import com.deeplearnx.domain.entity.UserApproveDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserApproveMapper {

  @Mapping(target = "action", expression = "java(detail.getAction() != null ? detail.getAction().name() : null)")
  @Mapping(target = "status", expression = "java(detail.getStatus() != null ? detail.getStatus().name() : null)")
  @Mapping(target = "roles", expression = "java(detail.getRoles() != null ? detail.getRoles().stream().map(r -> r.name()).collect(java.util.stream.Collectors.toList()) : java.util.List.of())")
  @Mapping(target = "createdAt", expression = "java(detail.getCreatedAt() != null ? detail.getCreatedAt().toString() : null)")
  @Mapping(target = "updatedAt", expression = "java(detail.getUpdatedAt() != null ? detail.getUpdatedAt().toString() : null)")
  UserApproveResponse toResponse(UserApproveDetail detail);
}
