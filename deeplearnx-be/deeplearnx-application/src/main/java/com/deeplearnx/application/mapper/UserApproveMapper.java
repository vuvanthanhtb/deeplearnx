package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.UserApproveResponse;
import com.deeplearnx.domain.entity.UserApproveDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserApproveMapper {

  @Mapping(target = "action", expression = "java(detail.getAction() != null ? detail.getAction().name() : null)")
  @Mapping(target = "status", expression = "java(detail.getStatus() != null ? detail.getStatus().name() : null)")
  UserApproveResponse toResponse(UserApproveDetail detail);
}
