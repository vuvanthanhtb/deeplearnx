package com.deeplearnx.infrastructure.export;

import com.deeplearnx.core.export.ExcelExportEngine;
import java.io.OutputStream;
import java.util.Map;
import java.util.function.BiConsumer;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class BaseReportExporter {

  private final ExportRepository repo;

  public <T> void export(
      String templatePath,
      int startRow,
      String sql,
      Map<String, Object> params,
      RowMapper<T> mapper,
      BiConsumer<ExcelExportEngine, T> rowWriter,
      OutputStream os,
      String fromDate,
      String toDate
  ) throws Exception {

    ExcelExportEngine excel = new ExcelExportEngine();

    excel.init(templatePath, startRow, fromDate, toDate);

    repo.stream(
        sql,
        params,
        mapper,
        dto -> {
          rowWriter.accept(excel, dto);
        }
    );

    excel.flush(os);
  }
}