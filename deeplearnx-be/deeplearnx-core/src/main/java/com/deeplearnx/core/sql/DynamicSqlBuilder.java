package com.deeplearnx.core.sql;

import com.deeplearnx.core.utils.DataUtils;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import org.springframework.util.StringUtils;

@Getter
public class DynamicSqlBuilder {

  private final StringBuilder sql;
  private final HashMap<String, Object> params;

  public DynamicSqlBuilder() {
    this.sql = new StringBuilder();
    this.params = new HashMap<>();
  }

  public DynamicSqlBuilder(String baseSql) {
    this.sql = new StringBuilder(baseSql);
    this.params = new HashMap<>();
  }

  public DynamicSqlBuilder append(String text) {
    this.sql.append(text);
    return this;
  }

  /**
   * Thêm param bắt buộc (không điều kiện).
   */
  public DynamicSqlBuilder param(String name, Object value) {
    this.params.put(name, value);
    return this;
  }

  /**
   * AND col = :paramName nếu value != null.
   */
  public DynamicSqlBuilder andEqual(String columnExpr, String paramName, Object value) {
    if (value != null) {
      this.sql.append(" AND ").append(columnExpr).append(" = :").append(paramName).append(" ");
      this.params.put(paramName, value);
    }
    return this;
  }

  /**
   * AND col >= :paramName nếu value != null.
   */
  public DynamicSqlBuilder andGreaterOrEqual(String columnExpr, String paramName, Object value) {
    if (value != null) {
      this.sql.append(" AND ").append(columnExpr).append(" >= :").append(paramName).append(" ");
      this.params.put(paramName, value);
    }
    return this;
  }

  /**
   * AND col < :paramName nếu value != null.
   */
  public DynamicSqlBuilder andSmaller(String columnExpr, String paramName, Object value) {
    if (value != null) {
      this.sql.append(" AND ").append(columnExpr).append(" < :").append(paramName).append(" ");
      this.params.put(paramName, value);
    }
    return this;
  }

  /**
   * AND col IN (:p_0, :p_1, ...) — tự expand từng phần tử thành named param riêng. Bỏ qua nếu
   * collection rỗng.
   */
  public DynamicSqlBuilder andIn(String columnExpr, String paramName, Collection<?> values) {
    if (values == null || values.isEmpty()) {
      return this;
    }

    List<String> generatedNames = new ArrayList<>();
    int index = 0;
    for (Object value : values) {
      String genName = paramName + "_" + index++;
      generatedNames.add(":" + genName);
      this.params.put(genName, value);
    }

    this.sql.append(" AND ").append(columnExpr)
        .append(" IN (").append(String.join(", ", generatedNames)).append(") ");
    return this;
  }

  /**
   * AND col IN (:p_0, :p_1, ...) — bắt buộc phải có phần tử. Nếu collection rỗng → AND 1 = 0 (không
   * có kết quả).
   */
  public DynamicSqlBuilder andInRequired(String paramName, Collection<?> values) {
    if (values == null || values.isEmpty()) {
      this.sql.append(" AND 1 = 0 ");
      return this;
    }

    List<String> placeholders = new ArrayList<>();
    int index = 0;
    for (Object value : values) {
      String genName = paramName + "_" + index++;
      placeholders.add(":" + genName);
      this.params.put(genName, value);
    }

    String expanded = String.join(", ", placeholders);
    replaceInSql(":" + paramName, expanded);
    return this;
  }

  /**
   * AND col ILIKE :paramName (case-insensitive, PostgreSQL).
   * <p>
   * likePrefix = true → thêm % phía trước likeSuffix = true → thêm % phía sau
   * <p>
   * Bỏ qua nếu value null/blank.
   */
  public DynamicSqlBuilder andLike(String columnExpr, String paramName, String value,
      boolean likePrefix, boolean likeSuffix) {
    if (DataUtils.isNullObject(value)) {
      return this;
    }

    StringBuilder pattern = new StringBuilder();
    if (likePrefix) {
      pattern.append("%");
    }
    pattern.append(value);
    if (likeSuffix) {
      pattern.append("%");
    }

    this.sql.append(" AND ").append(columnExpr).append(" ILIKE :").append(paramName).append(" ");
    this.params.put(paramName, pattern.toString());
    return this;
  }

  /**
   * AND với điều kiện SQL thô (params phải tự add bằng param()).
   */
  public DynamicSqlBuilder andRaw(String condition, Map<String, Object> params) {
    if (!StringUtils.hasText(condition)) {
      return this;
    }

    this.sql.append(" AND ").append(condition.trim()).append(" ");

    if (params != null && !params.isEmpty()) {
      params.forEach((k, v) -> {
        if (!StringUtils.hasText(k)) {
          throw new IllegalArgumentException("Param key must not be blank");
        }
        if (this.params.containsKey(k)) {
          throw new IllegalArgumentException("Duplicate param key: " + k);
        }
        this.params.put(k, v);
      });
    }

    return this;
  }

  private void replaceInSql(String target, String replacement) {
    int idx = this.sql.indexOf(target);
    if (idx < 0) {
      throw new IllegalStateException(
          "Cannot find param " + target + " in SQL: " + this.sql);
    }
    this.sql.replace(idx, idx + target.length(), replacement);
  }
}
