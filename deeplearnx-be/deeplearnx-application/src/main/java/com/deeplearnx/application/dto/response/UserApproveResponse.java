package com.deeplearnx.application.dto.response;

import java.util.List;

public record UserApproveResponse(
    Long id,
    Long userId,
    String username,
    String email,
    String fullName,
    List<String> roles,
    String action,
    String status,
    String payload,
    String createdAt,
    String createdBy,
    String updatedAt,
    String updatedBy
) {

}
