package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.entity.UserApproveStatus;
import com.deeplearnx.core.sql.DynamicSqlBuilder;
import com.deeplearnx.domain.entity.UserApproveDetail;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
public class UserApproveQueryRepository {

  private static final String BASE_SQL = """
      SELECT ua.id,
             ua.user_id,
             ua.action,
             ua.status,
             ua.payload,
             COALESCE(ua.username, '')                    AS username,
             COALESCE(ua.email, '')                       AS email,
             COALESCE(ua.full_name, '')                   AS full_name,
             COALESCE(ua.roles, '')                       AS roles,
             ua.created_at,
             ua.updated_at,
             COALESCE(ua.created_by, '')                  AS created_by,
             COALESCE(ua.updated_by, '')                  AS updated_by
      FROM user_approves ua
      WHERE 1=1
      """;

  private static final RowMapper<UserApproveDetail> ROW_MAPPER = (rs, rowNum) -> {
    String rolesStr = rs.getString("roles");
    List<Role> roles = StringUtils.hasText(rolesStr)
        ? Arrays.stream(rolesStr.split(","))
            .map(String::trim)
            .map(Role::valueOf)
            .collect(Collectors.toList())
        : List.of();

    UserApproveDetail detail = new UserApproveDetail();
    detail.setId(rs.getLong("id"));
    detail.setUserId(rs.getObject("user_id") != null ? rs.getLong("user_id") : null);
    detail.setAction(UserApproveAction.valueOf(rs.getString("action")));
    detail.setStatus(UserApproveStatus.valueOf(rs.getString("status")));
    detail.setPayload(rs.getString("payload"));
    detail.setUsername(rs.getString("username"));
    detail.setEmail(rs.getString("email"));
    detail.setFullName(rs.getString("full_name"));
    detail.setRoles(roles);
    detail.setCreatedAt(rs.getTimestamp("created_at") != null
        ? rs.getTimestamp("created_at").toLocalDateTime() : null);
    detail.setUpdatedAt(rs.getTimestamp("updated_at") != null
        ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
    detail.setCreatedBy(rs.getString("created_by"));
    detail.setUpdatedBy(rs.getString("updated_by"));
    return detail;
  };

  private final NamedParameterJdbcTemplate jdbc;

  public Page<UserApproveDetail> search(String action, String status, String createdBy,
      String fromDate, String toDate, Pageable pageable) {

    DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);

    if (StringUtils.hasText(action)) {
      builder.andEqual("ua.action", "action", action.toUpperCase());
    }
    if (StringUtils.hasText(status)) {
      builder.andEqual("ua.status", "status", status.toUpperCase());
    }
    builder.andLike("ua.created_by", "createdBy", createdBy, true, true)
        .andGreaterOrEqual("ua.created_at", "fromDate", parseDate(fromDate))
        .andSmaller("ua.created_at", "toDate", parseDate(nextDay(toDate)));

    String baseSql = builder.getSql().toString();
    String countSql = "SELECT COUNT(*) FROM (" + baseSql + ") t";
    String dataSql = baseSql + " ORDER BY ua.created_at DESC LIMIT :limit OFFSET :offset";

    Long total = jdbc.queryForObject(countSql, builder.getParams(), Long.class);

    Map<String, Object> pageParams = new HashMap<>(builder.getParams());
    pageParams.put("limit", pageable.getPageSize());
    pageParams.put("offset", pageable.getOffset());

    return new PageImpl<>(
        jdbc.query(dataSql, pageParams, ROW_MAPPER),
        pageable,
        total != null ? total : 0L);
  }

  public Optional<UserApproveDetail> findById(Long id) {
    DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);
    builder.andEqual("ua.id", "id", id);
    List<UserApproveDetail> result = jdbc.query(builder.getSql().toString(), builder.getParams(),
        ROW_MAPPER);
    return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
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
