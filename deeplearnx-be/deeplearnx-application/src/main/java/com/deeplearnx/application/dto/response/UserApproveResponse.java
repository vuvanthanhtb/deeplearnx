package com.deeplearnx.application.dto.response;

import java.util.List;

public record UserApproveResponse(
    String id,
    String userId,
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
