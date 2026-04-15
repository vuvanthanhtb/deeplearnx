package com.deeplearnx.application.service.impl.export;

import com.deeplearnx.application.service.export.UserExportService;
import com.deeplearnx.core.sql.DynamicSqlBuilder;
import com.deeplearnx.core.utils.DataUtils;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class UserExportServiceImpl extends BaseExportService<UserExportServiceImpl.UserRow>
    implements UserExportService {

  private static final String BASE_SQL = """
      SELECT
        u.username,
        u.email,
        COALESCE(u.full_name, '')                    AS full_name,
        ARRAY_TO_STRING(u.roles, ', ')               AS roles,
        u.status,
        TO_CHAR(u.created_at, 'DD/MM/YYYY HH24:MI') AS created_at
      FROM users u
      WHERE 1=1
      """;

  private static final RowMapper<UserRow> ROW_MAPPER = (rs, rowNum) -> new UserRow(
      rs.getString("username"),
      rs.getString("email"),
      rs.getString("full_name"),
      rs.getString("roles"),
      rs.getString("status"),
      rs.getString("created_at")
  );

  @Value("${export.template.user}")
  private String templatePath;

  @Override
  public void export(String username, String email, String fullName,
      String fromDate, String toDate, HttpServletResponse response) throws Exception {

    boolean hasKeyword = !DataUtils.isNullObject(username)
        || !DataUtils.isNullObject(email)
        || !DataUtils.isNullObject(fullName);

    String from = resolveFrom(fromDate);
    String to = resolveTo(toDate);

    DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);
    builder.andLike("u.username", "username", username, true, true)
        .andLike("u.email", "email", email, true, true)
        .andLike("u.full_name", "fullName", fullName, true, true)
        .andGreaterOrEqual("u.created_at", "fromDate", LocalDate.parse(from))
        .andSmaller("u.created_at", "toDate", LocalDate.parse(nextDay(to)));
    builder.append(" ORDER BY u.created_at DESC");

    doExport(templatePath, from, to, hasKeyword, builder, ROW_MAPPER,
        (engine, row, stt) -> engine.writeRow(stt.getAndIncrement(),
            row.username(), row.email(), row.fullName(),
            row.roles(), row.status(), row.createdAt()),
        response, "BAO_CAO_DANH_SACH_TAI_KHOAN.xlsx");
  }

  record UserRow(
      String username, String email, String fullName,
      String roles, String status, String createdAt
  ) {

  }
}
