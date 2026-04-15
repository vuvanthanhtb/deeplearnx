package com.deeplearnx.domain.entity;

import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.entity.UserApproveStatus;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class UserApproveDetail {

  // user_approves fields
  private Long id;
  private Long userId;
  private UserApproveAction action;
  private UserApproveStatus status;
  private String payload;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String createdBy;
  private String updatedBy;

  // joined from users
  private String username;
  private String email;
  private String fullName;
  private List<Role> roles;
}
