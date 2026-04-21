package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateCourseRequest;
import com.deeplearnx.application.dto.response.CourseImportRowResult;
import com.deeplearnx.application.dto.response.ImportResult;
import com.deeplearnx.application.service.CourseImportService;
import com.deeplearnx.application.service.CourseService;
import com.deeplearnx.application.tools.ExcelImportHelper;
import com.deeplearnx.core.exception.BadRequestException;
import com.deeplearnx.domain.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseImportServiceImpl implements CourseImportService {

  // Cột trong file Excel (0-indexed):
  // 0: STT | 1: Tên khóa học* | 2: Mô tả
  private static final int COL_NAME        = 1;
  private static final int COL_DESCRIPTION = 2;
  private static final int DATA_START_ROW  = 4;

  private final CourseService courseService;

  @Value("${export.template.course-import}")
  private String courseImportTemplatePath;

  @Override
  public ImportResult<CourseImportRowResult> importCourses(MultipartFile file, User currentUser) {
    ExcelImportHelper.validateFile(file);
    log.info("Start importing courses from file: {}", file.getOriginalFilename());

    List<CourseImportRowResult> failures = new ArrayList<>();
    int total = 0;
    int success = 0;

    try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
      Sheet sheet = wb.getSheetAt(0);
      int lastRow = sheet.getLastRowNum();

      for (int rowIdx = DATA_START_ROW; rowIdx <= lastRow; rowIdx++) {
        Row row = sheet.getRow(rowIdx);
        if (row == null || ExcelImportHelper.isRowEmpty(row, COL_NAME, COL_DESCRIPTION)) {
          continue;
        }

        total++;
        String name        = ExcelImportHelper.getCellValue(row, COL_NAME);
        String description = ExcelImportHelper.getCellValue(row, COL_DESCRIPTION);

        if (!StringUtils.hasText(name)) {
          failures.add(new CourseImportRowResult(rowIdx + 1, name, "Tên khóa học không được để trống"));
          continue;
        }

        try {
          courseService.create(new CreateCourseRequest(name, description), currentUser);
          success++;
          log.info("Row {}: created course name={}", rowIdx + 1, name);
        } catch (Exception e) {
          log.warn("Row {}: failed name={} reason={}", rowIdx + 1, name, e.getMessage());
          failures.add(new CourseImportRowResult(rowIdx + 1, name, e.getMessage()));
        }
      }
    } catch (BadRequestException e) {
      throw e;
    } catch (Exception e) {
      log.error("Cannot parse Excel file", e);
      throw new BadRequestException("Không thể đọc file Excel: " + e.getMessage());
    }

    log.info("Course import done: total={}, success={}, failed={}", total, success, failures.size());
    return new ImportResult<>(total, success, failures.size(), failures);
  }

  @Override
  public void downloadTemplate(HttpServletResponse response) throws IOException {
    ExcelImportHelper.streamTemplate(response, courseImportTemplatePath, "course_import_template.xlsx");
  }
}
