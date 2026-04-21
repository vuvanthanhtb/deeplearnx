package com.deeplearnx.application.dto.response;

import java.util.List;

public record ImportResult<T>(
    int total,
    int success,
    int failed,
    List<T> failures
) {

}
