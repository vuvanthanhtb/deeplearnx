package com.deeplearnx.application.dto.request;

import java.time.LocalDateTime;

public record CreateScheduleRequest(
    String title,
    String content,
    LocalDateTime scheduledAt
) {

}
