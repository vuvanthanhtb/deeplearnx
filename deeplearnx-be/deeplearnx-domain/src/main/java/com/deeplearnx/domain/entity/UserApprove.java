package com.deeplearnx.domain.entity;

import com.deeplearnx.core.entity.BaseEntity;
import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.entity.UserApproveStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_approves")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserApprove extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // null for REGISTER/CREATE (user doesn't exist yet)
  private Long userId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserApproveAction action;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserApproveStatus status;

  // JSON payload for CREATE/REGISTER/UPDATE actions
  @Column(columnDefinition = "TEXT")
  private String payload;

  // Snapshot of user info at the time of request
  private String username;
  private String email;
  private String fullName;

  @Convert(converter = com.deeplearnx.core.converter.RoleListConverter.class)
  @Column(name = "roles", columnDefinition = "TEXT")
  private List<Role> roles;
}
