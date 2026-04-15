package com.deeplearnx.infrastructure.converter;

import com.deeplearnx.core.entity.UserApproveStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UserApproveStatusConverter implements AttributeConverter<UserApproveStatus, String> {

  @Override
  public String convertToDatabaseColumn(UserApproveStatus status) {
    return status != null ? status.name() : null;
  }

  @Override
  public UserApproveStatus convertToEntityAttribute(String value) {
    if (value == null) {
      return null;
    }
    // Handle legacy 'PENDING' value migrated from old data
    if ("PENDING".equalsIgnoreCase(value)) {
      return UserApproveStatus.APPROVING;
    }
    return UserApproveStatus.valueOf(value);
  }
}
