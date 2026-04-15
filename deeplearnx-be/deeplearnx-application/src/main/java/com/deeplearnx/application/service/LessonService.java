package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.request.CreateLessonRequest;
import com.deeplearnx.application.dto.request.UpdateLessonRequest;
import com.deeplearnx.application.dto.response.LessonResponse;
import java.util.List;

public interface LessonService {

  List<LessonResponse> findByCourseSlug(String courseSlug);

  LessonResponse findById(Long id);

  LessonResponse create(CreateLessonRequest request);

  LessonResponse update(Long id, UpdateLessonRequest request);

  void delete(Long id);
}
