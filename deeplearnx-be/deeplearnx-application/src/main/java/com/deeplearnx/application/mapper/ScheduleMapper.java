package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.request.CreateScheduleRequest;
import com.deeplearnx.application.dto.request.UpdateScheduleRequest;
import com.deeplearnx.application.dto.response.ScheduleResponse;
import com.deeplearnx.core.utils.IdEncoder;
import com.deeplearnx.domain.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", imports = IdEncoder.class)
public interface ScheduleMapper {

  @Mapping(target = "id", expression = "java(IdEncoder.encode(schedule.getId()))")
  ScheduleResponse toResponse(Schedule schedule);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "user", ignore = true)
  @Mapping(target = "status", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  @Mapping(target = "updatedBy", ignore = true)
  Schedule toEntity(CreateScheduleRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "user", ignore = true)
  @Mapping(target = "status", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  @Mapping(target = "updatedBy", ignore = true)
  void update(UpdateScheduleRequest request, @MappingTarget Schedule schedule);
}
