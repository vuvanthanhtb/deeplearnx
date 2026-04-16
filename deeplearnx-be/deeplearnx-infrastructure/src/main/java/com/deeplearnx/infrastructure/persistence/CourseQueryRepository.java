package com.deeplearnx.infrastructure.persistence;

import static com.deeplearnx.core.utils.DateUtils.nextDay;
import static com.deeplearnx.core.utils.DateUtils.parseDate;

import com.deeplearnx.core.sql.DynamicSqlBuilder;
import com.deeplearnx.domain.entity.Course;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CourseQueryRepository {

  private static final String BASE_SQL = """
      SELECT u.id,
             u.name,
             u.slug,
             u.description,
             u.created_at,
             u.updated_at,
             COALESCE(u.created_by, '') AS created_by,
             COALESCE(u.updated_by, '') AS updated_by
      FROM courses u
      WHERE 1=1
      """;
  private static final RowMapper<Course> ROW_MAPPER = (rs, rowNum) -> {
    Course course = new Course();
    course.setId(rs.getLong("id"));
    course.setName(rs.getString("name"));
    course.setSlug(rs.getString("slug"));
    course.setDescription(rs.getString("description"));
    course.setCreatedAt(rs.getTimestamp("created_at") != null
        ? rs.getTimestamp("created_at").toLocalDateTime()
        : null);
    course.setUpdatedAt(rs.getTimestamp("updated_at") != null
        ? rs.getTimestamp("updated_at").toLocalDateTime()
        : null);
    course.setCreatedBy(rs.getString("created_by"));
    course.setUpdatedBy(rs.getString("updated_by"));
    return course;
  };
  private final NamedParameterJdbcTemplate jdbc;

  public Page<Course> search(String name,
      String fromDate, String toDate, Pageable pageable) {

    DynamicSqlBuilder builder = new DynamicSqlBuilder(BASE_SQL);
    builder.andLike("u.name", "name", name, true, true)
        .andGreaterOrEqual("u.updated_at", "fromDate", parseDate(fromDate))
        .andSmaller("u.updated_at", "toDate", parseDate(nextDay(toDate)));

    String baseSql = builder.getSql().toString();
    String countSql = "SELECT COUNT(*) FROM (" + baseSql + ") t";
    String dataSql = baseSql + " ORDER BY u.updated_at DESC LIMIT :limit OFFSET :offset";

    Long total = jdbc.queryForObject(countSql, builder.getParams(), Long.class);

    Map<String, Object> pageParams = new HashMap<>(builder.getParams());
    pageParams.put("limit", pageable.getPageSize());
    pageParams.put("offset", pageable.getOffset());

    List<Course> content = jdbc.query(dataSql, pageParams, ROW_MAPPER);

    return new PageImpl<>(content, pageable, total != null ? total : 0L);
  }
}
