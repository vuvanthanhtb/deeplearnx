package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateLessonRequest;
import com.deeplearnx.application.dto.response.ImportResult;
import com.deeplearnx.application.dto.response.LessonImportRowResult;
import com.deeplearnx.application.service.LessonImportService;
import com.deeplearnx.application.service.LessonService;
import com.deeplearnx.application.tools.ExcelImportHelper;
import com.deeplearnx.core.exception.BadRequestException;
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
  public ImportResult<LessonImportRowResult> importLessons(MultipartFile file) {
    ExcelImportHelper.validateFile(file);
    log.info("Start importing lessons from file: {}", file.getOriginalFilename());

    List<LessonImportRowResult> failures = new ArrayList<>();
    int total = 0;
    int success = 0;

    try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
      Sheet sheet = wb.getSheetAt(0);
      int lastRow = sheet.getLastRowNum();

      for (int rowIdx = DATA_START_ROW; rowIdx <= lastRow; rowIdx++) {
        Row row = sheet.getRow(rowIdx);
        if (row == null || ExcelImportHelper.isRowEmpty(row, COL_COURSE_SLUG, COL_POSITION)) {
          continue;
        }

        total++;
        String courseSlug = ExcelImportHelper.getCellValue(row, COL_COURSE_SLUG);
        String title      = ExcelImportHelper.getCellValue(row, COL_TITLE);
        String videoUrl   = ExcelImportHelper.getCellValue(row, COL_VIDEO_URL);
        String positionStr = ExcelImportHelper.getCellValue(row, COL_POSITION);

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
    return new ImportResult<>(total, success, failures.size(), failures);
  }

  @Override
  public void downloadTemplate(HttpServletResponse response) throws IOException {
    ExcelImportHelper.streamTemplate(response, lessonImportTemplatePath, "lesson_import_template.xlsx");
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
}
