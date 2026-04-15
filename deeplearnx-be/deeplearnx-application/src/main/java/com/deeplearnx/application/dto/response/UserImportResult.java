package com.deeplearnx.application.dto.response;

import java.util.List;

public record UserImportResult(
    int total,
    int success,
    int failed,
    List<UserImportRowResult> failures
) {

}
