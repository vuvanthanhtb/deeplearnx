package com.deeplearnx.application.dto.request;

public record CreateLessonRequest(
    String title,
    String videoUrl,
    Integer position,
    String courseSlug
) {

}
