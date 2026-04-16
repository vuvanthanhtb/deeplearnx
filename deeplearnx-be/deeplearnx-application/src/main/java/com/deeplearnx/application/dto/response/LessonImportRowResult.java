package com.deeplearnx.application.dto.response;

public record LessonImportRowResult(
    int row,
    String courseSlug,
    String title,
    String reason
) {

}
