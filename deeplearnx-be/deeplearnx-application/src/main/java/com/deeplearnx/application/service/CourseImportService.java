package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.response.CourseImportRowResult;
import com.deeplearnx.application.dto.response.ImportResult;
import com.deeplearnx.domain.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface CourseImportService {

  ImportResult<CourseImportRowResult> importCourses(MultipartFile file, User currentUser);

  void downloadTemplate(HttpServletResponse response) throws IOException;
}
