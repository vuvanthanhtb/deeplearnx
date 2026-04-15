package com.deeplearnx.application.service.export;

import jakarta.servlet.http.HttpServletResponse;
import java.io.OutputStream;

public interface CourseExportService {

  void export(String name, String fromDate, String toDate, HttpServletResponse response) throws Exception;
}
