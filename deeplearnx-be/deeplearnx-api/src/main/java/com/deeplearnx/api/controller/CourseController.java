package com.deeplearnx.api.controller;

import com.deeplearnx.application.dto.request.CreateCourseRequest;
import com.deeplearnx.application.dto.request.UpdateCourseRequest;
import com.deeplearnx.application.dto.response.CourseImportResult;
import com.deeplearnx.application.dto.response.CourseResponse;
import com.deeplearnx.application.service.CourseImportService;
import com.deeplearnx.application.service.export.CourseExportService;
import com.deeplearnx.application.service.CourseService;
import com.deeplearnx.core.annotation.EncodedId;
import com.deeplearnx.core.response.ApiResponse;
import com.deeplearnx.core.response.PageResponse;
import com.deeplearnx.domain.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

  private final CourseService courseService;
  private final CourseExportService courseExportService;
  private final CourseImportService courseImportService;

  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<CourseResponse>>> getCourses(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String fromDate,
      @RequestParam(required = false) String toDate,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(
        ApiResponse.ok(courseService.findAll(name, fromDate, toDate, Math.max(page - 1, 0), Math.max(size, 1))));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<CourseResponse>> getCourse(@EncodedId Long id) {
    return ResponseEntity.ok(ApiResponse.ok(courseService.findById(id)));
  }

  @GetMapping("/slug/{slug}")
  public ResponseEntity<ApiResponse<CourseResponse>> getCourseBySlug(@PathVariable String slug) {
    return ResponseEntity.ok(ApiResponse.ok(courseService.findBySlug(slug)));
  }

  @PostMapping
  public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
      @RequestBody CreateCourseRequest request,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(courseService.create(request, currentUser)));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
      @EncodedId Long id,
      @RequestBody UpdateCourseRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(courseService.update(id, request)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteCourse(@EncodedId Long id) {
    courseService.delete(id);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @GetMapping("/export")
  public void exportCourses(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String fromDate,
      @RequestParam(required = false) String toDate,
      HttpServletResponse response) throws Exception {
    courseExportService.export(name, fromDate, toDate, response);
  }

  @PostMapping("/import")
  public ResponseEntity<ApiResponse<CourseImportResult>> importCourses(
      @RequestParam("file") MultipartFile file,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.ok(ApiResponse.ok(courseImportService.importCourses(file, currentUser)));
  }

  @GetMapping("/import/template")
  public void downloadImportTemplate(HttpServletResponse response) throws Exception {
    courseImportService.downloadTemplate(response);
  }
}
