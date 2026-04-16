package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.CourseResponse;
import com.deeplearnx.domain.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {
  @Mapping(target = "lessonCount", expression = "java(count)")
  CourseResponse toResponse(Course course, long count);
}
