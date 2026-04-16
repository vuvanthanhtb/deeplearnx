package com.deeplearnx.application.dto.response;

import java.util.List;

public record CourseImportResult(
    int total,
    int success,
    int failed,
    List<CourseImportRowResult> failures
) {

}
