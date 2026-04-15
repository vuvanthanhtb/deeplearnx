package com.deeplearnx.application.dto.response;

public record UserImportRowResult(
    int row,
    String username,
    String email,
    String reason
) {

}
