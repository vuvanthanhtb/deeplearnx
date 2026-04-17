package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.CourseResponse;
import com.deeplearnx.core.utils.IdEncoder;
import com.deeplearnx.domain.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = IdEncoder.class)
public interface CourseMapper {

  @Mapping(target = "id", expression = "java(IdEncoder.encode(course.getId()))")
  @Mapping(target = "lessonCount", expression = "java(count)")
  CourseResponse toResponse(Course course, long count);
}
