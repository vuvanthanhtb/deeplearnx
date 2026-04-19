package com.deeplearnx.application.dto.response;

public record LessonResponse(
    Long id,
    Long courseId,
    String title,
    String slug,
    String videoUrl,
    Integer position
) {

}
