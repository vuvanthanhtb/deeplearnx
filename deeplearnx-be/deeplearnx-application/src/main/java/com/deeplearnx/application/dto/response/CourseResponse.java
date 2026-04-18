package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.annotation.EncodedId;
import java.time.LocalDateTime;

public record CourseResponse(
    @EncodedId Long id,
    String name,
    String slug,
    String description,
    LocalDateTime createdAt,
    long lessonCount
) {

}
