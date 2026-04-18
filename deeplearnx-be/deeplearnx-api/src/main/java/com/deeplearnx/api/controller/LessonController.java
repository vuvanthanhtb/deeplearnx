package com.deeplearnx.api.controller;

import com.deeplearnx.application.dto.request.CreateLessonRequest;
import com.deeplearnx.application.dto.request.UpdateLessonRequest;
import com.deeplearnx.application.dto.response.LessonImportResult;
import com.deeplearnx.application.dto.response.LessonResponse;
import com.deeplearnx.application.service.LessonImportService;
import com.deeplearnx.application.service.LessonService;
import com.deeplearnx.core.annotation.EncodedId;
import com.deeplearnx.core.response.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class LessonController {

  private final LessonService lessonService;
  private final LessonImportService lessonImportService;

  @GetMapping("/api/courses/{courseSlug}/lessons")
  public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessons(
      @PathVariable String courseSlug) {
    return ResponseEntity.ok(ApiResponse.ok(lessonService.findByCourseSlug(courseSlug)));
  }

  @PostMapping("/api/lessons")
  public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
      @RequestBody CreateLessonRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(lessonService.create(request)));
  }

  @GetMapping("/api/lessons/{id}")
  public ResponseEntity<ApiResponse<LessonResponse>> getLesson(@EncodedId Long id) {
    return ResponseEntity.ok(ApiResponse.ok(lessonService.findById(id)));
  }

  @PutMapping("/api/lessons/{id}")
  public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
      @EncodedId Long id,
      @RequestBody UpdateLessonRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(lessonService.update(id, request)));
  }

  @DeleteMapping("/api/lessons/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteLesson(@EncodedId Long id) {
    lessonService.delete(id);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @PostMapping("/api/lessons/import")
  public ResponseEntity<ApiResponse<LessonImportResult>> importLessons(
      @RequestParam("file") MultipartFile file) {
    return ResponseEntity.ok(ApiResponse.ok(lessonImportService.importLessons(file)));
  }

  @GetMapping("/api/lessons/import/template")
  public void downloadImportTemplate(HttpServletResponse response) throws Exception {
    lessonImportService.downloadTemplate(response);
  }
}
