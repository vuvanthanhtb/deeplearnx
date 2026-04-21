package com.deeplearnx.application.dto.response;

import java.util.List;

public record BulkActionResult(
    int total,
    int success,
    int failed,
    List<BulkActionFailure> failures
) {

  public record BulkActionFailure(
      String id,
      String reason
  ) {

  }
}
