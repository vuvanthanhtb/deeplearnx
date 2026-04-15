package com.deeplearnx.api.controller;

import com.deeplearnx.application.dto.response.UserResponse;
import com.deeplearnx.application.service.UserService;
import com.deeplearnx.application.service.export.UserExportService;
import com.deeplearnx.core.response.ApiResponse;
import com.deeplearnx.core.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final UserExportService userExportService;

  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getUsers(
      @RequestParam(required = false) String username,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String fullName,
      @RequestParam(required = false) String role,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String fromDate,
      @RequestParam(required = false) String toDate,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(ApiResponse.ok(
        userService.findAll(username, email, fullName, role, status, fromDate, toDate,
            Math.max(page - 1, 0), Math.max(size, 1))));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponse.ok(userService.findById(id)));
  }


  @GetMapping("/export")
  public void exportUsers(
      @RequestParam(required = false) String username,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String fullName,
      @RequestParam(required = false) String fromDate,
      @RequestParam(required = false) String toDate,
      jakarta.servlet.http.HttpServletResponse response) throws Exception {
    userExportService.export(username, email, fullName, fromDate, toDate, response);
  }
}
