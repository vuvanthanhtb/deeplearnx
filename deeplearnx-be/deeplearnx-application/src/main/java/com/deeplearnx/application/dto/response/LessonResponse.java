package com.deeplearnx.application.dto.response;

public record LessonResponse(
    String id,
    String courseId,
    String title,
    String slug,
    String videoUrl,
    Integer position
) {

}
