package com.deeplearnx.application.tools;

import com.deeplearnx.core.exception.BadRequestException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.util.StringUtils;

public final class ExcelImportHelper {

  private ExcelImportHelper() {}

  public static void validateFile(org.springframework.web.multipart.MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("File không được để trống");
    }
    String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
    if (!filename.toLowerCase().endsWith(".xlsx")) {
      throw new BadRequestException("Chỉ hỗ trợ file .xlsx");
    }
  }

  public static String getCellValue(Row row, int col) {
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

  public static boolean isRowEmpty(Row row, int firstCol, int lastCol) {
    for (int c = firstCol; c <= lastCol; c++) {
      Cell cell = row.getCell(c);
      if (cell != null && cell.getCellType() != CellType.BLANK
          && StringUtils.hasText(getCellValue(row, c))) {
        return false;
      }
    }
    return true;
  }

  public static void streamTemplate(HttpServletResponse response, String templatePath,
      String downloadFilename) throws IOException {
    File templateFile = new File(templatePath);
    if (!templateFile.exists()) {
      throw new com.deeplearnx.core.exception.NotFoundException("Import template not found");
    }
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=\"" + downloadFilename + "\"");
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    try (FileInputStream fis = new FileInputStream(templateFile)) {
      fis.transferTo(response.getOutputStream());
    }
  }
}
