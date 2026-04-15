package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateLessonRequest;
import com.deeplearnx.application.dto.request.UpdateLessonRequest;
import com.deeplearnx.application.dto.response.LessonResponse;
import com.deeplearnx.application.mapper.LessonMapper;
import com.deeplearnx.application.service.LessonService;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.core.utils.SlugUtils;
import com.deeplearnx.domain.entity.Course;
import com.deeplearnx.domain.entity.Lesson;
import com.deeplearnx.infrastructure.persistence.CourseRepository;
import com.deeplearnx.infrastructure.persistence.LessonRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

  private final LessonRepository lessonRepository;
  private final CourseRepository courseRepository;
  private final LessonMapper lessonMapper;

  @Override
  public List<LessonResponse> findByCourseSlug(String courseSlug) {
    List<Lesson> result = lessonRepository.searchByCourseSlug(courseSlug);
    return result.stream().map(lessonMapper::toResponse).toList();
  }

  @Override
  public LessonResponse findById(Long id) {
    return lessonMapper.toResponse(getLesson(id));
  }

  @Override
  public LessonResponse create(CreateLessonRequest request) {
    log.info("Create lesson title={} in course={}", request.title(), request.courseSlug());
    Course course = getCourse(request.courseSlug());
    if (course == null) {
      throw new NotFoundException("Course not found");
    }
    String slug = generateUniqueSlug(request.title(), course, null);
    Lesson lesson = new Lesson();
    lesson.setCourse(course);
    lesson.setTitle(request.title());
    lesson.setSlug(slug);
    lesson.setVideoUrl(request.videoUrl());
    lesson.setPosition(request.position());
    return lessonMapper.toResponse(lessonRepository.save(lesson));
  }

  @Override
  public LessonResponse update(Long id, UpdateLessonRequest request) {
    log.info("Update lesson id={}", id);
    Lesson lesson = getLesson(id);
    if (StringUtils.hasText(request.title()) && !request.title().equals(lesson.getTitle())) {
      lesson.setTitle(request.title());
      lesson.setSlug(generateUniqueSlug(request.title(), lesson.getCourse(), lesson.getId()));
    }
    if (request.videoUrl() != null) {
      lesson.setVideoUrl(request.videoUrl());
    }
    if (request.position() != null) {
      lesson.setPosition(request.position());
    }
    return lessonMapper.toResponse(lessonRepository.save(lesson));
  }

  @Override
  public void delete(Long id) {
    log.info("Delete lesson id={}", id);
    getLesson(id);
    lessonRepository.deleteById(id);
  }

  private Course getCourse(String slug) {
    return courseRepository.findBySlug(slug)
        .orElseThrow(() -> new NotFoundException("Course not found"));
  }

  private Lesson getLesson(Long id) {
    return lessonRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Lesson not found"));
  }

  private String generateUniqueSlug(String title, Course course, Long excludeId) {
    String base = SlugUtils.toSlug(title);
    String slug = base;
    int counter = 1;
    while (lessonRepository.existsByCourseAndSlugAndIdNot(course, slug,
        excludeId != null ? excludeId : 0L)) {
      slug = base + "-" + counter++;
    }
    return slug;
  }
}
