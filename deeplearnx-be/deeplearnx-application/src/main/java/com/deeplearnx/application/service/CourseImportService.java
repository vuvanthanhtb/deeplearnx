package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.response.CourseImportResult;
import com.deeplearnx.domain.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface CourseImportService {

  CourseImportResult importCourses(MultipartFile file, User currentUser);

  void downloadTemplate(HttpServletResponse response) throws IOException;
}
