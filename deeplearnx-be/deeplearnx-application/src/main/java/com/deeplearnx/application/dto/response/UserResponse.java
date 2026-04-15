package com.deeplearnx.application.dto.response;

import java.util.List;

public record UserResponse(Long id, String username, String email, String fullName,
                           List<String> roles, String status, String createdAt, String createdBy,
                           String updatedAt, String updatedBy) {

}
