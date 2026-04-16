package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.CourseResponse;
import com.deeplearnx.domain.entity.Course;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CourseMapper {
  CourseResponse toResponse(Course course);
}
