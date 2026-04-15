package com.deeplearnx.application.service.impl.export;

import com.deeplearnx.application.service.export.CourseExportService;
import com.deeplearnx.core.sql.DynamicSqlBuilder;
import com.deeplearnx.core.utils.DataUtils;
import jakarta.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class CourseExportServiceImpl extends BaseExportService<CourseExportServiceImpl.CourseRow>
    implements CourseExportService {

  private static final String BASE_SQL = """
      SELECT
        c.name,
        c.slug,
        COALESCE(c.description, '')                  AS description,
        TO_CHAR(c.created_at, 'DD/MM/YYYY HH24:MI') AS created_at,
        COALESCE(u.username, '')                     AS created_by
      FROM courses c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE 1=1
      """;

  private static final RowMapper<CourseRow> ROW_MAPPER = (rs, rowNum) -> new CourseRow(
      rs.getString("name"),
      rs.getString("slug"),
      rs.getString("description"),
      rs.getString("created_at"),
      rs.getString("created_by")
  );

  @Value("${export.template.course}")
  private String templatePath;

  @Override
  public void export(String name, String fromDate, String toDate, HttpServletResponse response)
      throws Exception {

    boolean hasKeyword = !DataUtils.isNullObject(name);

    String from = resolveFrom(fromDate);
    String to   = resolveTo(toDate);

    DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);
    builder.andLike("c.name", "name", name, true, true)
           .andGreaterOrEqual("c.created_at", "fromDate", LocalDate.parse(from))
           .andSmaller("c.created_at", "toDate", LocalDate.parse(nextDay(to)));
    builder.append(" ORDER BY c.created_at DESC");

    doExport(templatePath, from, to, hasKeyword, builder, ROW_MAPPER,
        (engine, row, stt) -> engine.writeRow(stt.getAndIncrement(),
            row.name(), row.slug(), row.description(), row.createdAt(), row.createdBy()),
        response, "BAO_CAO_DANH_SACH_KHOA_HOC.xlsx");
  }

  record CourseRow(
      String name, String slug, String description, String createdAt, String createdBy
  ) {}
}
