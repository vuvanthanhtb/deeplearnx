package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.encryption.EncryptId;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Data
@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

  @JsonSerialize(using = EncryptId.class)
  Long id;
  String username;
  String email;
  String fullName;
  List<String> roles;
  String status;
  String createdAt;
  String createdBy;
  String updatedAt;
  String updatedBy;
}
