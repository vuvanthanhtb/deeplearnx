package com.deeplearnx.application.dto.response;

import java.time.LocalDateTime;

public record CourseResponse(
    Long id,
    String name,
    String slug,
    String description,
    LocalDateTime createdAt,
    long lessonCount
) {

}
