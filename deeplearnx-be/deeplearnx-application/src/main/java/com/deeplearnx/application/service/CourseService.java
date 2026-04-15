package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.request.CreateCourseRequest;
import com.deeplearnx.application.dto.request.UpdateCourseRequest;
import com.deeplearnx.application.dto.response.CourseResponse;
import com.deeplearnx.core.response.PageResponse;
import com.deeplearnx.domain.entity.User;

public interface CourseService {

  PageResponse<CourseResponse> findAll(String name, int page, int size);

  CourseResponse findById(Long id);

  CourseResponse findBySlug(String slug);

  CourseResponse create(CreateCourseRequest request, User currentUser);

  CourseResponse update(Long id, UpdateCourseRequest request);

  void delete(Long id);
}
