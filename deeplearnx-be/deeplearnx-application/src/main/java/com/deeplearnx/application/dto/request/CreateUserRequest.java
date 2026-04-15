package com.deeplearnx.application.dto.request;

import com.deeplearnx.core.entity.Role;
import java.util.List;

public record CreateUserRequest(
    String username,
    String email,
    String password,
    String fullName,
    List<Role> roles
) {

}
