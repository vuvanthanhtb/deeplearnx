package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.encryption.EncryptId;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserApproveResponse{
  @JsonSerialize(using = EncryptId.class)
  Long id;
  String userId;
  String username;
  String email;
  String fullName;
  List<String> roles;
  String action;
  String status;
  String createdAt;
  String createdBy;
  String updatedAt;
  String updatedBy;
}
