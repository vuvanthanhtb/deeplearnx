package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateCourseRequest;
import com.deeplearnx.application.dto.request.UpdateCourseRequest;
import com.deeplearnx.application.dto.response.CourseResponse;
import com.deeplearnx.application.service.CourseService;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.core.response.PageResponse;
import com.deeplearnx.core.utils.SlugUtils;
import com.deeplearnx.domain.entity.Course;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.infrastructure.persistence.CourseRepository;
import com.deeplearnx.infrastructure.persistence.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

  private final CourseRepository courseRepository;
  private final LessonRepository lessonRepository;

  @Override
  public PageResponse<CourseResponse> findAll(String name, int page, int size) {
    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<Course> result = StringUtils.hasText(name)
        ? courseRepository.searchByName(name, pageable)
        : courseRepository.findAll(pageable);
    return PageResponse.of(result, this::toResponseWithCount);
  }

  @Override
  public CourseResponse findById(Long id) {
    return toResponseWithCount(getCourse(id));
  }

  @Override
  public CourseResponse findBySlug(String slug) {
    Course course = courseRepository.findBySlug(slug)
        .orElseThrow(() -> new NotFoundException("Course not found"));
    return toResponseWithCount(course);
  }

  @Override
  public CourseResponse create(CreateCourseRequest request, User currentUser) {
    log.info("Create course name={} by user={}", request.name(), currentUser.getUsername());
    String slug = generateUniqueSlug(request.name(), null);
    Course course = new Course();
    course.setName(request.name());
    course.setSlug(slug);
    course.setDescription(request.description());
    course.setUser(currentUser);
    return toResponseWithCount(courseRepository.save(course));
  }

  @Override
  public CourseResponse update(Long id, UpdateCourseRequest request) {
    log.info("Update course id={}", id);
    Course course = getCourse(id);
    if (StringUtils.hasText(request.name()) && !request.name().equals(course.getName())) {
      course.setName(request.name());
      course.setSlug(generateUniqueSlug(request.name(), course.getId()));
    }
    if (request.description() != null) {
      course.setDescription(request.description());
    }
    return toResponseWithCount(courseRepository.save(course));
  }

  @Override
  public void delete(Long id) {
    log.info("Delete course id={}", id);
    getCourse(id);
    courseRepository.deleteById(id);
  }

  private CourseResponse toResponseWithCount(Course course) {
    long count = lessonRepository.countByCourse_Id(course.getId());
    return new CourseResponse(course.getId(), course.getName(), course.getSlug(),
        course.getDescription(), course.getCreatedAt(), count);
  }

  private Course getCourse(Long id) {
    return courseRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Course not found"));
  }

  private String generateUniqueSlug(String name, Long excludeId) {
    String base = SlugUtils.toSlug(name);
    String slug = base;
    int counter = 1;
    while (courseRepository.existsBySlugAndIdNot(slug, excludeId != null ? excludeId : 0L)) {
      slug = base + "-" + counter++;
    }
    return slug;
  }
}
