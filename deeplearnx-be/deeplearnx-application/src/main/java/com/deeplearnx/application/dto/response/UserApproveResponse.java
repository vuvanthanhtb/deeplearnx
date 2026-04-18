package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.annotation.EncodedId;
import java.util.List;

public record UserApproveResponse(
    @EncodedId Long id,
    @EncodedId Long userId,
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
