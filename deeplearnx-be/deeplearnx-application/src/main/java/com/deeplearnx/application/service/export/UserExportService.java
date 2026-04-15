package com.deeplearnx.application.service.export;

import jakarta.servlet.http.HttpServletResponse;

public interface UserExportService {

  void export(String username, String email, String fullName,
      String fromDate, String toDate, HttpServletResponse response) throws Exception;
}
