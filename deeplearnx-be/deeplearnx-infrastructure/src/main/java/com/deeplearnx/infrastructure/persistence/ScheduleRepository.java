package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.domain.entity.Schedule;
import com.deeplearnx.domain.entity.ScheduleStatus;
import com.deeplearnx.domain.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

  List<Schedule> findByUserOrderByScheduledAtAsc(User user);

  List<Schedule> findByUserAndStatusOrderByScheduledAtAsc(User user, ScheduleStatus status);

  List<Schedule> findByUserAndScheduledAtBetweenOrderByScheduledAtAsc(
      User user, LocalDateTime start, LocalDateTime end);

  Optional<Schedule> findByIdAndUser(Long id, User user);
}
