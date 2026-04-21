package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.response.ImportResult;
import com.deeplearnx.application.dto.response.LessonImportRowResult;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface LessonImportService {

  ImportResult<LessonImportRowResult> importLessons(MultipartFile file);

  void downloadTemplate(HttpServletResponse response) throws IOException;
}
