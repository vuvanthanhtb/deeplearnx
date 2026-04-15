package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserStatus;
import com.deeplearnx.core.sql.DynamicSqlBuilder;
import com.deeplearnx.domain.entity.User;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
@RequiredArgsConstructor
public class UserQueryRepository {

  private static final String BASE_SQL = """
      SELECT u.id,
             u.username,
             u.email,
             COALESCE(u.full_name, '') AS full_name,
             ARRAY_TO_STRING(u.roles, ',') AS roles,
             u.status,
             u.created_at,
             u.updated_at,
             COALESCE(u.created_by, '') AS created_by,
             COALESCE(u.updated_by, '') AS updated_by
      FROM users u
      WHERE 1=1
      """;
  private static final RowMapper<User> ROW_MAPPER = (rs, rowNum) -> {
    String rolesStr = rs.getString("roles");
    List<Role> roles = (rolesStr != null && !rolesStr.isBlank())
        ? Arrays.stream(rolesStr.split(","))
        .map(String::trim)
        .map(Role::valueOf)
        .collect(Collectors.toList())
        : List.of();

    User user = new User();
    user.setId(rs.getLong("id"));
    user.setUsername(rs.getString("username"));
    user.setEmail(rs.getString("email"));
    user.setFullName(rs.getString("full_name"));
    user.setRoles(roles);
    user.setStatus(UserStatus.valueOf(rs.getString("status")));
    user.setCreatedAt(rs.getTimestamp("created_at") != null
        ? rs.getTimestamp("created_at").toLocalDateTime()
        : null);
    user.setUpdatedAt(rs.getTimestamp("updated_at") != null
        ? rs.getTimestamp("updated_at").toLocalDateTime()
        : null);
    user.setCreatedBy(rs.getString("created_by"));
    user.setUpdatedBy(rs.getString("updated_by"));
    return user;
  };
  private final NamedParameterJdbcTemplate jdbc;

  public Page<User> search(String username, String email, String fullName, String role,
      String status,
      String fromDate, String toDate, Pageable pageable) {

    DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);
    builder.andLike("u.username", "username", username, true, true)
        .andLike("u.email", "email", email, true, true)
        .andLike("u.full_name", "fullName", fullName, true, true)
        .andEqual("u.status", "status", status)
        .andGreaterOrEqual("u.updated_at", "fromDate", parseDate(fromDate))
        .andSmaller("u.updated_at", "toDate", parseDate(nextDay(toDate)));

    if (StringUtils.hasText(role)) {
      builder.andRaw(":role = ANY(u.roles)", Map.of("role", role));
    }

    String baseSql = builder.getSql().toString();
    String countSql = "SELECT COUNT(*) FROM (" + baseSql + ") t";
    String dataSql = baseSql + " ORDER BY u.updated_at DESC LIMIT :limit OFFSET :offset";

    Long total = jdbc.queryForObject(countSql, builder.getParams(), Long.class);

    Map<String, Object> pageParams = new HashMap<>(builder.getParams());
    pageParams.put("limit", pageable.getPageSize());
    pageParams.put("offset", pageable.getOffset());

    List<User> content = jdbc.query(dataSql, pageParams, ROW_MAPPER);

    return new PageImpl<>(content, pageable, total != null ? total : 0L);
  }

  private LocalDate parseDate(String date) {
    if (!StringUtils.hasText(date)) {
      return null;
    }
    try {
      return LocalDate.parse(date);
    } catch (DateTimeParseException e) {
      return null;
    }
  }

  private String nextDay(String date) {
    if (!StringUtils.hasText(date)) {
      return null;
    }
    try {
      return LocalDate.parse(date).plusDays(1).toString();
    } catch (DateTimeParseException e) {
      return null;
    }
  }
}
