package com.deeplearnx.infrastructure.export;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ExportRepository extends BaseJdbcExportRepository {

  public ExportRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
    this.setJdbcExport(namedParameterJdbcTemplate);
  }
}
