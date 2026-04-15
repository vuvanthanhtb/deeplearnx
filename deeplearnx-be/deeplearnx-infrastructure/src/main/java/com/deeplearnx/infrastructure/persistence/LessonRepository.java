package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.domain.entity.Course;
import com.deeplearnx.domain.entity.Lesson;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

  @Query("SELECT l, l.course.name as courseName FROM Lesson l WHERE l.course.slug = :courseSlug ORDER BY l.position")
  List<Lesson> searchByCourseSlug(String courseSlug);

  boolean existsByCourseAndSlug(Course course, String slug);

  boolean existsByCourseAndSlugAndIdNot(Course course, String slug, Long id);
}
