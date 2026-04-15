package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateScheduleRequest;
import com.deeplearnx.application.dto.request.UpdateScheduleRequest;
import com.deeplearnx.application.dto.response.ScheduleResponse;
import com.deeplearnx.application.mapper.ScheduleMapper;
import com.deeplearnx.application.service.ScheduleService;
import com.deeplearnx.core.exception.ForbiddenException;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.domain.entity.Schedule;
import com.deeplearnx.domain.entity.ScheduleStatus;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.infrastructure.persistence.ScheduleRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

  private final ScheduleRepository scheduleRepository;
  private final ScheduleMapper scheduleMapper;

  @Override
  public ScheduleResponse create(CreateScheduleRequest request, User currentUser) {
    log.info("Create schedule by user={}", currentUser.getUsername());
    Schedule schedule = scheduleMapper.toEntity(request);
    schedule.setUser(currentUser);
    schedule.setStatus(ScheduleStatus.PENDING);
    return scheduleMapper.toResponse(scheduleRepository.save(schedule));
  }

  @Override
  public List<ScheduleResponse> findAll(User currentUser, ScheduleStatus status, LocalDate date) {
    List<Schedule> schedules;
    if (status != null) {
      schedules = scheduleRepository.findByUserAndStatusOrderByScheduledAtAsc(currentUser, status);
    } else if (date != null) {
      schedules = scheduleRepository.findByUserAndScheduledAtBetweenOrderByScheduledAtAsc(
          currentUser, date.atStartOfDay(), date.atTime(LocalTime.MAX));
    } else {
      schedules = scheduleRepository.findByUserOrderByScheduledAtAsc(currentUser);
    }
    return schedules.stream().map(scheduleMapper::toResponse).toList();
  }

  @Override
  public ScheduleResponse findById(Long id, User currentUser) {
    return scheduleMapper.toResponse(getOwnedSchedule(id, currentUser));
  }

  @Override
  public ScheduleResponse update(Long id, UpdateScheduleRequest request, User currentUser) {
    log.info("Update schedule id={} by user={}", id, currentUser.getUsername());
    Schedule schedule = getOwnedSchedule(id, currentUser);
    scheduleMapper.update(request, schedule);
    return scheduleMapper.toResponse(scheduleRepository.save(schedule));
  }

  @Override
  public ScheduleResponse updateStatus(Long id, ScheduleStatus status, User currentUser) {
    log.info("Update schedule status id={} status={} by user={}", id, status, currentUser.getUsername());
    Schedule schedule = getOwnedSchedule(id, currentUser);
    schedule.setStatus(status);
    return scheduleMapper.toResponse(scheduleRepository.save(schedule));
  }

  @Override
  public void delete(Long id, User currentUser) {
    log.info("Delete schedule id={} by user={}", id, currentUser.getUsername());
    getOwnedSchedule(id, currentUser);
    scheduleRepository.deleteById(id);
  }

  private Schedule getOwnedSchedule(Long id, User currentUser) {
    Schedule schedule = scheduleRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Schedule not found"));
    if (!schedule.getUser().getId().equals(currentUser.getId())) {
      throw new ForbiddenException("Access denied");
    }
    return schedule;
  }
}
