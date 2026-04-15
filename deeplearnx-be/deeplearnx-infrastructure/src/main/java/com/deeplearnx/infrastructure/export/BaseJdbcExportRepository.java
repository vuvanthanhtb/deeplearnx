package com.deeplearnx.infrastructure.export;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

@Slf4j
@FieldDefaults(level = AccessLevel.PROTECTED)
public abstract class BaseJdbcExportRepository {

  protected NamedParameterJdbcTemplate jdbc;

  public void setJdbcExport(NamedParameterJdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public <T> void stream(
      String sql,
      Map<String, Object> params,
      RowMapper<T> mapper,
      Consumer<T> consumer
  ) {

    AtomicInteger rowNum = new AtomicInteger(0);

    jdbc.query(
        sql,
        params,
        rs -> {
          T dto = mapper.mapRow(rs, rowNum.getAndIncrement());
          consumer.accept(dto);
        }
    );
  }
}