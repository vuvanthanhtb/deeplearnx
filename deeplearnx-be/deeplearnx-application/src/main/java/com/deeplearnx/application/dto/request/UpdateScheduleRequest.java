package com.deeplearnx.application.dto.request;

import java.time.LocalDateTime;

public record UpdateScheduleRequest(
    String title,
    String content,
    LocalDateTime scheduledAt
) {

}
