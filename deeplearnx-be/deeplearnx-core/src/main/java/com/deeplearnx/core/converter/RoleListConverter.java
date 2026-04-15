package com.deeplearnx.core.converter;

import com.deeplearnx.core.entity.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class RoleListConverter implements AttributeConverter<List<Role>, String> {

  private static final String DELIMITER = ",";

  @Override
  public String convertToDatabaseColumn(List<Role> roles) {
    if (roles == null || roles.isEmpty()) {
      return null;
    }
    return roles.stream().map(Role::name).collect(Collectors.joining(DELIMITER));
  }

  @Override
  public List<Role> convertToEntityAttribute(String value) {
    if (value == null || value.isBlank()) {
      return Collections.emptyList();
    }
    return Arrays.stream(value.split(DELIMITER))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .map(Role::valueOf)
        .collect(Collectors.toList());
  }
}
