package com.deeplearnx.application.dto.response;

import java.util.List;

public record LessonImportResult(
    int total,
    int success,
    int failed,
    List<LessonImportRowResult> failures
) {

}
