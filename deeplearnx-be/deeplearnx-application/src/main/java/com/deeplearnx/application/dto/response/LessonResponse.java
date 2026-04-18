package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.annotation.EncodedId;

public record LessonResponse(
    @EncodedId Long id,
    @EncodedId Long courseId,
    String title,
    String slug,
    String videoUrl,
    Integer position
) {

}
