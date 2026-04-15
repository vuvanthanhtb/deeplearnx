package com.deeplearnx.application.dto.request;

public record UpdateLessonRequest(
    String title,
    String videoUrl,
    Integer position
) {

}
