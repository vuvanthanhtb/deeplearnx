package com.deeplearnx.application.dto.response;

import java.time.LocalDateTime;

public record CourseResponse(
    String id,
    String name,
    String slug,
    String description,
    LocalDateTime createdAt,
    long lessonCount
) {

}
