package com.deeplearnx.application.service.impl.export;

import java.io.File;
import java.io.FileOutputStream;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TemplateInitializer {

  @Value("${export.template.dir:./templates}")
  private String templateDir;

  @Value("${export.template.course}")
  private String courseTemplatePath;

  @Value("${export.template.user}")
  private String userTemplatePath;

  @Value("${export.template.user-import}")
  private String userImportTemplatePath;

  @EventListener(ApplicationReadyEvent.class)
  public void initTemplates() {
    File dir = new File(templateDir);
    if (!dir.exists()) {
      boolean created = dir.mkdirs();
      log.info("Template dir {} : {}", dir.getAbsolutePath(), created ? "created" : "already exists");
    } else {
      log.info("Template dir exists: {}", dir.getAbsolutePath());
    }
    createIfAbsent(courseTemplatePath, "DANH SÁCH KHÓA HỌC",
        new String[]{"Tên khóa học", "Slug", "Mô tả", "Ngày tạo", "Người tạo"},
        new int[]{30, 25, 45, 22, 20});

    createIfAbsent(userTemplatePath, "DANH SÁCH NGƯỜI DÙNG",
        new String[]{"Tên đăng nhập", "Email", "Họ tên", "Vai trò", "Trạng thái", "Ngày tạo"},
        new int[]{22, 32, 28, 20, 18, 22});

    createImportTemplateIfAbsent(userImportTemplatePath);
  }

  private void createIfAbsent(String path, String title, String[] headers, int[] colWidths) {
    File file = new File(path);
    if (file.exists()) {
      return;
    }
    try (Workbook wb = buildTemplate(title, headers, colWidths);
        FileOutputStream fos = new FileOutputStream(file)) {
      wb.write(fos);
      log.info("Created export template: {}", file.getAbsolutePath());
    } catch (Exception e) {
      log.error("Failed to create template: {}", path, e);
    }
  }

  // ── Template structure ────────────────────────────────────────────────────
  // Row 0: Tiêu đề (merged)
  // Row 1: Thời gian (engine ghi đè khi export)
  // Row 2: Trống
  // Row 3: Header columns
  // Row 4+: Data (startRow = 4)

  private Workbook buildTemplate(String title, String[] headers, int[] colWidths) {
    XSSFWorkbook wb = new XSSFWorkbook();
    Sheet sheet = wb.createSheet("Sheet1");

    for (int i = 0; i < colWidths.length; i++) {
      sheet.setColumnWidth(i + 1, colWidths[i] * 256); // +1 vì col 0 là STT
    }
    sheet.setColumnWidth(0, 8 * 256); // STT

    // Row 0: Tiêu đề
    Row titleRow = sheet.createRow(0);
    titleRow.setHeightInPoints(30);
    Cell titleCell = titleRow.createCell(0);
    titleCell.setCellValue(title);
    titleCell.setCellStyle(titleStyle(wb));
    sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length));

    // Row 1: Thời gian (placeholder — engine ghi đè)
    Row dateRow = sheet.createRow(1);
    dateRow.setHeightInPoints(18);
    Cell dateCell = dateRow.createCell(0);
    dateCell.setCellValue("Thời gian: Tất cả");
    dateCell.setCellStyle(italicStyle(wb));
    sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, headers.length));

    // Row 2: Trống
    sheet.createRow(2).setHeightInPoints(6);

    // Row 3: Header
    Row headerRow = sheet.createRow(3);
    headerRow.setHeightInPoints(22);
    CellStyle hs = headerStyle(wb);

    Cell sttHeader = headerRow.createCell(0);
    sttHeader.setCellValue("STT");
    sttHeader.setCellStyle(hs);

    for (int i = 0; i < headers.length; i++) {
      Cell c = headerRow.createCell(i + 1);
      c.setCellValue(headers[i]);
      c.setCellStyle(hs);
    }

    return wb;
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  private CellStyle titleStyle(Workbook wb) {
    Font font = wb.createFont();
    font.setFontName("Times New Roman");
    font.setBold(true);
    font.setFontHeightInPoints((short) 16);

    CellStyle style = wb.createCellStyle();
    style.setFont(font);
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);
    return style;
  }

  private CellStyle italicStyle(Workbook wb) {
    Font font = wb.createFont();
    font.setFontName("Times New Roman");
    font.setItalic(true);
    font.setFontHeightInPoints((short) 11);

    CellStyle style = wb.createCellStyle();
    style.setFont(font);
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);
    return style;
  }

  // ── Import template ───────────────────────────────────────────────────────
  // Cấu trúc khác export: không có dòng thời gian, có dòng hướng dẫn + dữ liệu mẫu
  // Row 0: Tiêu đề
  // Row 1: Hướng dẫn vai trò
  // Row 2: Trống
  // Row 3: Header columns (STT | username* | email* | password* | fullName | roles)
  // Row 4: Dữ liệu mẫu
  private void createImportTemplateIfAbsent(String path) {
    File file = new File(path);
    if (file.exists()) {
      return;
    }
    try (XSSFWorkbook wb = new XSSFWorkbook();
        FileOutputStream fos = new FileOutputStream(file)) {

      Sheet sheet = wb.createSheet("Sheet1");
      int[] colWidths = {8, 22, 32, 22, 28, 30};
      for (int i = 0; i < colWidths.length; i++) {
        sheet.setColumnWidth(i, colWidths[i] * 256);
      }
      sheet.createFreezePane(0, 4);

      int totalCols = colWidths.length - 1;

      // Row 0: Tiêu đề
      Row r0 = sheet.createRow(0);
      r0.setHeightInPoints(30);
      Cell title = r0.createCell(0);
      title.setCellValue("NHẬP DANH SÁCH NGƯỜI DÙNG");
      title.setCellStyle(titleStyle(wb));
      sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, totalCols));

      // Row 1: Hướng dẫn vai trò
      Row r1 = sheet.createRow(1);
      r1.setHeightInPoints(18);
      Cell note = r1.createCell(0);
      note.setCellValue("Vai trò hợp lệ: USER, ADMIN, APPROVER, SUPERADMIN (phân cách bằng dấu phẩy). Các cột có dấu (*) là bắt buộc.");
      note.setCellStyle(italicStyle(wb));
      sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(1, 1, 0, totalCols));

      // Row 2: Trống
      sheet.createRow(2).setHeightInPoints(6);

      // Row 3: Header
      Row r3 = sheet.createRow(3);
      r3.setHeightInPoints(22);
      CellStyle hs = headerStyle(wb);
      String[] headers = {"STT", "Tên đăng nhập*", "Email*", "Mật khẩu*", "Họ tên", "Vai trò"};
      for (int i = 0; i < headers.length; i++) {
        Cell c = r3.createCell(i);
        c.setCellValue(headers[i]);
        c.setCellStyle(hs);
      }

      // Row 4: Dữ liệu mẫu
      Row r4 = sheet.createRow(4);
      r4.setHeightInPoints(20);
      CellStyle ds = dataStyle(wb);
      String[] sample = {"1", "johndoe", "johndoe@example.com", "Password@123", "John Doe", "USER"};
      for (int i = 0; i < sample.length; i++) {
        Cell c = r4.createCell(i);
        c.setCellValue(sample[i]);
        c.setCellStyle(ds);
      }

      wb.write(fos);
      log.info("Created import template: {}", file.getAbsolutePath());
    } catch (Exception e) {
      log.error("Failed to create import template: {}", path, e);
    }
  }

  private CellStyle dataStyle(Workbook wb) {
    Font font = wb.createFont();
    font.setFontName("Times New Roman");
    font.setFontHeightInPoints((short) 12);
    font.setItalic(true);
    font.setColor(IndexedColors.GREY_50_PERCENT.getIndex());

    CellStyle style = wb.createCellStyle();
    style.setFont(font);
    style.setBorderTop(BorderStyle.THIN);
    style.setBorderBottom(BorderStyle.THIN);
    style.setBorderLeft(BorderStyle.THIN);
    style.setBorderRight(BorderStyle.THIN);
    style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    return style;
  }

  private CellStyle headerStyle(Workbook wb) {
    Font font = wb.createFont();
    font.setFontName("Times New Roman");
    font.setBold(true);
    font.setFontHeightInPoints((short) 12);
    font.setColor(IndexedColors.WHITE.getIndex());

    CellStyle style = wb.createCellStyle();
    style.setFont(font);
    style.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);
    style.setBorderTop(BorderStyle.THIN);
    style.setBorderBottom(BorderStyle.THIN);
    style.setBorderLeft(BorderStyle.THIN);
    style.setBorderRight(BorderStyle.THIN);
    return style;
  }
}
