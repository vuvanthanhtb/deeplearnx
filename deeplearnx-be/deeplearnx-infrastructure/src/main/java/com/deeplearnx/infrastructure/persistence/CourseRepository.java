package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.domain.entity.Course;
import com.deeplearnx.domain.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

  @Query(value = "SELECT c FROM Course c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))",
      countQuery = "SELECT COUNT(c) FROM Course c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
  Page<Course> searchByName(String name, Pageable pageable);

  Optional<Course> findBySlug(String slug);

  Optional<Course> findByIdAndUser(Long id, User user);

  boolean existsBySlug(String slug);

  boolean existsBySlugAndIdNot(String slug, Long id);
}
