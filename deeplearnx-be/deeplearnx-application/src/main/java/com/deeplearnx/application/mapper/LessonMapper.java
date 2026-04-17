package com.deeplearnx.application.mapper;

import com.deeplearnx.application.dto.response.LessonResponse;
import com.deeplearnx.core.utils.IdEncoder;
import com.deeplearnx.domain.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = IdEncoder.class)
public interface LessonMapper {

  @Mapping(target = "id", expression = "java(IdEncoder.encode(lesson.getId()))")
  @Mapping(target = "courseId", expression = "java(IdEncoder.encode(lesson.getCourse().getId()))")
  LessonResponse toResponse(Lesson lesson);
}
