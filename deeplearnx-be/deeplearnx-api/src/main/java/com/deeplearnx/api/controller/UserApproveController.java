package com.deeplearnx.api.controller;

import com.deeplearnx.application.dto.request.CreateUserRequest;
import com.deeplearnx.application.dto.request.UpdateUserRequest;
import com.deeplearnx.application.dto.response.BulkActionResult;
import com.deeplearnx.application.dto.response.UserApproveResponse;
import com.deeplearnx.application.dto.response.UserImportResult;
import com.deeplearnx.application.service.UserApproveService;
import com.deeplearnx.application.service.UserImportService;
import com.deeplearnx.core.response.ApiResponse;
import com.deeplearnx.core.response.PageResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/user-approves")
@RequiredArgsConstructor
public class UserApproveController {

  private final UserApproveService userApproveService;
  private final UserImportService userImportService;

  @PostMapping
  public ResponseEntity<ApiResponse<UserApproveResponse>> createUser(
      @RequestBody CreateUserRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(userApproveService.create(request)));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<UserApproveResponse>> updateUser(
      @PathVariable Long id,
      @RequestBody UpdateUserRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.update(id, request)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<UserApproveResponse>> deleteUser(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.delete(id)));
  }

  @PostMapping("/{id}/lock")
  public ResponseEntity<ApiResponse<UserApproveResponse>> lockUser(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.lock(id)));
  }

  @PostMapping("/{id}/unlock")
  public ResponseEntity<ApiResponse<UserApproveResponse>> unlockUser(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.unlock(id)));
  }

  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<UserApproveResponse>>> getApprovals(
      @RequestParam(required = false) String action,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String createdBy,
      @RequestParam(required = false) String fromDate,
      @RequestParam(required = false) String toDate,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(ApiResponse.ok(
        userApproveService.findAll(action, status, createdBy, fromDate, toDate,
            Math.max(page - 1, 0), Math.max(size, 1))));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<UserApproveResponse>> getApproval(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.findById(id)));
  }

  @PostMapping("/{id}/approve")
  public ResponseEntity<ApiResponse<UserApproveResponse>> approve(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.approve(id)));
  }

  @PostMapping("/{id}/reject")
  public ResponseEntity<ApiResponse<UserApproveResponse>> reject(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.reject(id)));
  }

  @PostMapping("/bulk-approve")
  public ResponseEntity<ApiResponse<BulkActionResult>> bulkApprove(@RequestBody List<Long> ids) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.bulkApprove(ids)));
  }

  @PostMapping("/bulk-reject")
  public ResponseEntity<ApiResponse<BulkActionResult>> bulkReject(@RequestBody List<Long> ids) {
    return ResponseEntity.ok(ApiResponse.ok(userApproveService.bulkReject(ids)));
  }

  @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiResponse<UserImportResult>> importUsers(
      @RequestParam("file") MultipartFile file) {
    return ResponseEntity.ok(ApiResponse.ok(userImportService.importUsers(file)));
  }

  @GetMapping("/import/template")
  public void downloadImportTemplate(HttpServletResponse response) throws IOException {
    userImportService.downloadTemplate(response);
  }
}
