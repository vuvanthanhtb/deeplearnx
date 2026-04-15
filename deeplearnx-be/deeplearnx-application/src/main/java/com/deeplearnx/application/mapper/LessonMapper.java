package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.LessonResponse;
import com.deeplearnx.domain.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {

  @Mapping(target = "courseId", source = "course.id")
  LessonResponse toResponse(Lesson lesson);
}
