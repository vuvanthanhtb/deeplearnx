package com.deeplearnx.api.controller;

import com.deeplearnx.application.dto.request.CreateScheduleRequest;
import com.deeplearnx.application.dto.request.UpdateScheduleRequest;
import com.deeplearnx.application.dto.response.ScheduleResponse;
import com.deeplearnx.application.service.ScheduleService;
import com.deeplearnx.core.response.ApiResponse;
import com.deeplearnx.domain.entity.ScheduleStatus;
import com.deeplearnx.domain.entity.User;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

  private final ScheduleService scheduleService;

  @PostMapping
  public ResponseEntity<ApiResponse<ScheduleResponse>> create(
      @RequestBody CreateScheduleRequest request,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(scheduleService.create(request, currentUser)));
  }

  @GetMapping
  public ResponseEntity<ApiResponse<List<ScheduleResponse>>> findAll(
      @RequestParam(required = false) ScheduleStatus status,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.ok(ApiResponse.ok(scheduleService.findAll(currentUser, status, date)));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<ScheduleResponse>> findById(
      @PathVariable Long id,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.ok(ApiResponse.ok(scheduleService.findById(id, currentUser)));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<ScheduleResponse>> update(
      @PathVariable Long id,
      @RequestBody UpdateScheduleRequest request,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.ok(ApiResponse.ok(scheduleService.update(id, request, currentUser)));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<ApiResponse<ScheduleResponse>> updateStatus(
      @PathVariable Long id,
      @RequestParam ScheduleStatus status,
      @AuthenticationPrincipal User currentUser) {
    return ResponseEntity.ok(ApiResponse.ok(scheduleService.updateStatus(id, status, currentUser)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> delete(
      @PathVariable Long id,
      @AuthenticationPrincipal User currentUser) {
    scheduleService.delete(id, currentUser);
    return ResponseEntity.ok(ApiResponse.ok("Schedule deleted"));
  }
}
