package com.deeplearnx.domain.entity;

import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.entity.UserApproveStatus;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class UserApproveDetail {

  private Long id;
  private Long userId;
  private UserApproveAction action;
  private UserApproveStatus status;
  private String username;
  private String email;
  private String fullName;
  private List<Role> roles;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String createdBy;
  private String updatedBy;
}
