package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.request.CreateScheduleRequest;
import com.deeplearnx.application.dto.request.UpdateScheduleRequest;
import com.deeplearnx.application.dto.response.ScheduleResponse;
import com.deeplearnx.domain.entity.ScheduleStatus;
import com.deeplearnx.domain.entity.User;
import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

  ScheduleResponse create(CreateScheduleRequest request, User currentUser);

  List<ScheduleResponse> findAll(User currentUser, ScheduleStatus status, LocalDate date);

  ScheduleResponse findById(Long id, User currentUser);

  ScheduleResponse update(Long id, UpdateScheduleRequest request, User currentUser);

  ScheduleResponse updateStatus(Long id, ScheduleStatus status, User currentUser);

  void delete(Long id, User currentUser);
}
