package com.deeplearnx.application.tools;

import java.io.File;
import java.io.FileOutputStream;
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

/**
 * Standalone tool để sinh file template Excel (không có dữ liệu mẫu).
 * Chạy: java GenerateTemplates [outputDir]
 */
public class GenerateTemplates {

  public static void main(String[] args) throws Exception {
    String outputDir = args.length > 0 ? args[0] : "templates";
    new File(outputDir).mkdirs();

    generate(outputDir + "/course_export_template.xlsx",
        "DANH SÁCH KHÓA HỌC",
        new String[]{"Tên khóa học", "Slug", "Mô tả", "Ngày tạo", "Người tạo"},
        new int[]{30, 25, 45, 22, 20});

    generate(outputDir + "/user_export_template.xlsx",
        "DANH SÁCH NGƯỜI DÙNG",
        new String[]{"Tên đăng nhập", "Email", "Họ tên", "Vai trò", "Trạng thái", "Ngày tạo"},
        new int[]{22, 32, 28, 18, 18, 22});

    System.out.println("Templates generated in: " + new File(outputDir).getAbsolutePath());
  }

  // ── Row 0: Tiêu đề (merged)
  // ── Row 1: Thời gian — ExcelExportEngine ghi đè khi export
  // ── Row 2: Trống
  // ── Row 3: Header columns
  // ── Row 4+: Data (start-row = 4)
  private static void generate(String path, String title, String[] headers, int[] widths)
      throws Exception {

    try (XSSFWorkbook wb = new XSSFWorkbook();
        FileOutputStream fos = new FileOutputStream(path)) {

      Sheet sheet = wb.createSheet("Sheet1");
      sheet.setColumnWidth(0, 8 * 256);
      for (int i = 0; i < widths.length; i++) {
        sheet.setColumnWidth(i + 1, widths[i] * 256);
      }
      sheet.createFreezePane(0, 4);

      int totalCols = headers.length;

      // Row 0: tiêu đề
      Row r0 = sheet.createRow(0);
      r0.setHeightInPoints(32);
      Cell t = r0.createCell(0);
      t.setCellValue(title);
      t.setCellStyle(titleStyle(wb));
      sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, totalCols));

      // Row 1: khoảng thời gian (placeholder)
      Row r1 = sheet.createRow(1);
      r1.setHeightInPoints(18);
      Cell d = r1.createCell(0);
      d.setCellValue("Thời gian: Tất cả");
      d.setCellStyle(italicStyle(wb));
      sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, totalCols));

      // Row 2: trống
      sheet.createRow(2).setHeightInPoints(6);

      // Row 3: header
      Row r3 = sheet.createRow(3);
      r3.setHeightInPoints(22);
      CellStyle hs = headerStyle(wb);
      cell(r3, 0, "STT", hs);
      for (int i = 0; i < headers.length; i++) {
        cell(r3, i + 1, headers[i], hs);
      }

      wb.write(fos);
      System.out.println("  Created: " + path);
    }
  }

  private static void cell(Row row, int col, String value, CellStyle style) {
    Cell c = row.createCell(col);
    c.setCellValue(value);
    c.setCellStyle(style);
  }

  private static CellStyle titleStyle(Workbook wb) {
    Font f = wb.createFont();
    f.setFontName("Times New Roman");
    f.setBold(true);
    f.setFontHeightInPoints((short) 16);
    CellStyle s = wb.createCellStyle();
    s.setFont(f);
    s.setAlignment(HorizontalAlignment.CENTER);
    s.setVerticalAlignment(VerticalAlignment.CENTER);
    return s;
  }

  private static CellStyle italicStyle(Workbook wb) {
    Font f = wb.createFont();
    f.setFontName("Times New Roman");
    f.setItalic(true);
    f.setFontHeightInPoints((short) 11);
    CellStyle s = wb.createCellStyle();
    s.setFont(f);
    s.setAlignment(HorizontalAlignment.CENTER);
    s.setVerticalAlignment(VerticalAlignment.CENTER);
    return s;
  }

  private static CellStyle headerStyle(Workbook wb) {
    Font f = wb.createFont();
    f.setFontName("Times New Roman");
    f.setBold(true);
    f.setFontHeightInPoints((short) 12);
    f.setColor(IndexedColors.WHITE.getIndex());
    CellStyle s = wb.createCellStyle();
    s.setFont(f);
    s.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
    s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    s.setAlignment(HorizontalAlignment.CENTER);
    s.setVerticalAlignment(VerticalAlignment.CENTER);
    s.setBorderTop(BorderStyle.THIN);
    s.setBorderBottom(BorderStyle.THIN);
    s.setBorderLeft(BorderStyle.THIN);
    s.setBorderRight(BorderStyle.THIN);
    return s;
  }
}
