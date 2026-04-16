package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.response.LessonImportResult;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface LessonImportService {

  LessonImportResult importLessons(MultipartFile file);

  void downloadTemplate(HttpServletResponse response) throws IOException;
}
