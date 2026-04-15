package com.deeplearnx.application.service.impl.export;

import com.deeplearnx.core.export.ExcelExportEngine;
import com.deeplearnx.core.sql.DynamicSqlBuilder;
import com.deeplearnx.core.utils.ExportUtils;
import com.deeplearnx.infrastructure.export.BaseReportExporter;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.util.StringUtils;

/**
 * Template chung cho các export service.
 * <p>
 * Cách dùng trong subclass:
 * <pre>
 *   String from = resolveFrom(fromDate);   // áp dụng default nếu null
 *   String to   = resolveTo(toDate);
 *
 *   DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);
 *   builder.andLike(...)
 *          .andGreaterOrEqual("col", "fromDate", from)
 *          .andSmaller("col", "toDate", nextDay(to))
 *          .append(" ORDER BY ...");
 *
 *   doExport(templatePath, from, to, hasKeyword, builder, ROW_MAPPER,
 *       (engine, row, stt) -> engine.writeRow(stt.getAndIncrement(), ...),
 *       os);
 * </pre>
 */
public abstract class BaseExportService<T> {

  protected static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  @Autowired
  private BaseReportExporter exporter;
  @Autowired
  private TemplateResolver templateResolver;
  @Value("${export.start-row:4}")
  private int startRow;

  /**
   * Số ngày mặc định khi fromDate/toDate null. Override để thay đổi.
   */
  protected int defaultDays() {
    return 90;
  }

  // ── Helpers để subclass gọi trước khi build DynamicSqlBuilder ────────────

  /**
   * fromDate null → today - defaultDays().
   */
  protected String resolveFrom(String fromDate) {
    return StringUtils.hasText(fromDate)
        ? fromDate
        : LocalDate.now().minusDays(defaultDays()).format(DATE_FMT);
  }

  /**
   * toDate null → today.
   */
  protected String resolveTo(String toDate) {
    return StringUtils.hasText(toDate)
        ? toDate
        : LocalDate.now().format(DATE_FMT);
  }

  /**
   * Ngày tiếp theo — dùng cho điều kiện < để toDate là inclusive.
   */
  protected String nextDay(String date) {
    if (!StringUtils.hasText(date)) {
      return null;
    }
    try {
      return LocalDate.parse(date).plusDays(1).format(DATE_FMT);
    } catch (DateTimeParseException e) {
      return null;
    }
  }

  // ── Export chính ──────────────────────────────────────────────────────────

  /**
   * @param templatePath đường dẫn template (classpath: hoặc filesystem)
   * @param resolvedFrom ngày bắt đầu đã resolve (không null)
   * @param resolvedTo   ngày kết thúc đã resolve (không null)
   * @param hasKeyword   true → header Excel hiển thị "Tất cả" thay vì khoảng ngày
   * @param builder      DynamicSqlBuilder đã build đầy đủ (bao gồm ORDER BY)
   * @param rowMapper    JDBC RowMapper
   * @param rowWriter    (engine, row, stt) → ghi 1 dòng vào Excel
   * @param response     OutputStream kết quả
   * @param fileName     Tên file được trả về
   */
  protected void doExport(
      String templatePath,
      String resolvedFrom,
      String resolvedTo,
      boolean hasKeyword,
      DynamicSqlBuilder builder,
      RowMapper<T> rowMapper,
      TriConsumer<ExcelExportEngine, T, AtomicInteger> rowWriter,
      HttpServletResponse response,
      String fileName
  ) throws Exception {

    String displayFrom = hasKeyword ? null : resolvedFrom;
    String displayTo = hasKeyword ? null : resolvedTo;

    String resolvedPath = templateResolver.resolve(templatePath);
    AtomicInteger stt = new AtomicInteger(1);

    response.setContentType(ExportUtils.contentType);
    response.setHeader(ExportUtils.accessControlExposeHeaders, ExportUtils.contentDisposition);
    response.setHeader(ExportUtils.contentDisposition,
        ExportUtils.getAttachmentAndFileName(fileName));

    exporter.export(
        resolvedPath, startRow,
        builder.getSql().toString(), builder.getParams(),
        rowMapper,
        (ExcelExportEngine engine, T row) -> rowWriter.accept(engine, row, stt),
        response.getOutputStream(), displayFrom, displayTo
    );
  }

  @FunctionalInterface
  public interface TriConsumer<A, B, C> {

    void accept(A a, B b, C c);
  }
}
