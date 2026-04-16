package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateLessonRequest;
import com.deeplearnx.application.dto.response.LessonImportResult;
import com.deeplearnx.application.dto.response.LessonImportRowResult;
import com.deeplearnx.application.service.LessonImportService;
import com.deeplearnx.application.service.LessonService;
import com.deeplearnx.core.exception.BadRequestException;
import com.deeplearnx.core.exception.NotFoundException;
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
public class LessonImportServiceImpl implements LessonImportService {

  // Cột trong file Excel (0-indexed):
  // 0: STT | 1: Slug khóa học* | 2: Tiêu đề bài học* | 3: URL Video | 4: Thứ tự
  private static final int COL_COURSE_SLUG = 1;
  private static final int COL_TITLE       = 2;
  private static final int COL_VIDEO_URL   = 3;
  private static final int COL_POSITION    = 4;
  private static final int DATA_START_ROW  = 4;

  private final LessonService lessonService;

  @Value("${export.template.lesson-import}")
  private String lessonImportTemplatePath;

  @Override
  public LessonImportResult importLessons(MultipartFile file) {
    validateFile(file);
    log.info("Start importing lessons from file: {}", file.getOriginalFilename());

    List<LessonImportRowResult> failures = new ArrayList<>();
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
        String courseSlug = getCellValue(row, COL_COURSE_SLUG);
        String title      = getCellValue(row, COL_TITLE);
        String videoUrl   = getCellValue(row, COL_VIDEO_URL);
        String positionStr = getCellValue(row, COL_POSITION);

        String validationError = validate(courseSlug, title);
        if (validationError != null) {
          failures.add(new LessonImportRowResult(rowIdx + 1, courseSlug, title, validationError));
          continue;
        }

        Integer position = null;
        if (StringUtils.hasText(positionStr)) {
          try {
            position = Integer.parseInt(positionStr);
          } catch (NumberFormatException e) {
            failures.add(new LessonImportRowResult(rowIdx + 1, courseSlug, title, "Thứ tự phải là số nguyên"));
            continue;
          }
        }

        try {
          lessonService.create(new CreateLessonRequest(title, videoUrl, position, courseSlug));
          success++;
          log.info("Row {}: created lesson title={} in course={}", rowIdx + 1, title, courseSlug);
        } catch (Exception e) {
          log.warn("Row {}: failed title={} course={} reason={}", rowIdx + 1, title, courseSlug, e.getMessage());
          failures.add(new LessonImportRowResult(rowIdx + 1, courseSlug, title, e.getMessage()));
        }
      }
    } catch (BadRequestException e) {
      throw e;
    } catch (Exception e) {
      log.error("Cannot parse Excel file", e);
      throw new BadRequestException("Không thể đọc file Excel: " + e.getMessage());
    }

    log.info("Lesson import done: total={}, success={}, failed={}", total, success, failures.size());
    return new LessonImportResult(total, success, failures.size(), failures);
  }

  @Override
  public void downloadTemplate(HttpServletResponse response) throws IOException {
    File templateFile = new File(lessonImportTemplatePath);
    if (!templateFile.exists()) {
      throw new NotFoundException("Import template not found");
    }
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=\"lesson_import_template.xlsx\"");
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

  private String validate(String courseSlug, String title) {
    if (!StringUtils.hasText(courseSlug)) {
      return "Slug khóa học không được để trống";
    }
    if (!StringUtils.hasText(title)) {
      return "Tiêu đề bài học không được để trống";
    }
    return null;
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
    for (int c = COL_COURSE_SLUG; c <= COL_POSITION; c++) {
      Cell cell = row.getCell(c);
      if (cell != null && cell.getCellType() != CellType.BLANK
          && StringUtils.hasText(getCellValue(row, c))) {
        return false;
      }
    }
    return true;
  }
}
