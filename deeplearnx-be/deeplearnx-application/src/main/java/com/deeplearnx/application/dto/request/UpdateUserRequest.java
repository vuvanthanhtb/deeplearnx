package com.deeplearnx.application.dto.request;

import com.deeplearnx.core.entity.Role;
import java.util.List;

public record UpdateUserRequest(
    String fullName,
    String email,
    List<Role> roles
) {

}
