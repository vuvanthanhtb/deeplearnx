package com.deeplearnx.application.dto.response;

import com.deeplearnx.core.annotation.EncodedId;
import com.deeplearnx.domain.entity.ScheduleStatus;
import java.time.LocalDateTime;

public record ScheduleResponse(
    @EncodedId Long id,
    String title,
    String content,
    LocalDateTime scheduledAt,
    ScheduleStatus status,
    LocalDateTime createdAt
) {

}
