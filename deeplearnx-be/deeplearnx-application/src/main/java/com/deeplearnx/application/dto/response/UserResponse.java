package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.annotation.EncodedId;
import java.util.List;

public record UserResponse(
    @EncodedId Long id,
    String username,
    String email,
    String fullName,
    List<String> roles,
    String status,
    String createdAt,
    String createdBy,
    String updatedAt,
    String updatedBy
) {

}
