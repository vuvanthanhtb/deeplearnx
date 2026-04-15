package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.response.UserImportResult;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface UserImportService {

  UserImportResult importUsers(MultipartFile file);

  void downloadTemplate(HttpServletResponse response) throws IOException;
}
