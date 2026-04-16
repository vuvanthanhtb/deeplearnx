package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateCourseRequest;
import com.deeplearnx.application.dto.response.CourseImportResult;
import com.deeplearnx.application.dto.response.CourseImportRowResult;
import com.deeplearnx.application.service.CourseImportService;
import com.deeplearnx.application.service.CourseService;
import com.deeplearnx.core.exception.BadRequestException;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.domain.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
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
  public CourseImportResult importCourses(MultipartFile file, User currentUser) {
    validateFile(file);
    log.info("Start importing courses from file: {}", file.getOriginalFilename());

    List<CourseImportRowResult> failures = new ArrayList<>();
    int total = 0;
    int success = 0;

    try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
      Sheet sheet = wb.getSheetAt(0);
      int lastRow = sheet.getLastRowNum();

      for (int rowIdx = DATA_START_ROW; rowIdx <= lastRow; rowIdx++) {
        Row row = sheet.getRow(rowIdx);
        if (row == null || isRowEmpty(row)) {
          continue;
        }

        total++;
        String name        = getCellValue(row, COL_NAME);
        String description = getCellValue(row, COL_DESCRIPTION);

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
    return new CourseImportResult(total, success, failures.size(), failures);
  }

  @Override
  public void downloadTemplate(HttpServletResponse response) throws IOException {
    File templateFile = new File(courseImportTemplatePath);
    if (!templateFile.exists()) {
      throw new NotFoundException("Import template not found");
    }
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=\"course_import_template.xlsx\"");
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    try (FileInputStream fis = new FileInputStream(templateFile)) {
      fis.transferTo(response.getOutputStream());
    }
  }

  private void validateFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("File không được để trống");
    }
    String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
    if (!filename.toLowerCase().endsWith(".xlsx")) {
      throw new BadRequestException("Chỉ hỗ trợ file .xlsx");
    }
  }

  private String getCellValue(Row row, int col) {
    Cell cell = row.getCell(col);
    if (cell == null) {
      return "";
    }
    return switch (cell.getCellType()) {
      case STRING  -> cell.getStringCellValue().trim();
      case NUMERIC -> {
        double v = cell.getNumericCellValue();
        yield v == Math.floor(v) ? String.valueOf((long) v) : String.valueOf(v);
      }
      case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
      case FORMULA -> {
        try { yield cell.getStringCellValue().trim(); }
        catch (Exception e) { yield String.valueOf(cell.getNumericCellValue()); }
      }
      default -> "";
    };
  }

  private boolean isRowEmpty(Row row) {
    for (int c = COL_NAME; c <= COL_DESCRIPTION; c++) {
      Cell cell = row.getCell(c);
      if (cell != null && cell.getCellType() != CellType.BLANK
          && StringUtils.hasText(getCellValue(row, c))) {
        return false;
      }
    }
    return true;
  }
}
