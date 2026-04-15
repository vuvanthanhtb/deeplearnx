package com.deeplearnx.core.export;

import com.deeplearnx.core.utils.DataUtils;
import com.deeplearnx.core.utils.DateUtils;
import java.io.FileInputStream;
import java.io.OutputStream;
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
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ExcelExportEngine {

  private SXSSFWorkbook workbook;
  private Sheet sheet;

  private CellStyle styleData;
  private CellStyle styleStt;

  private int rowIndex;

  public void init(String templatePath, int startRow, String fromDate, String toDate)
      throws Exception {
    XSSFWorkbook template = loadAndPreprocessTemplate(templatePath, fromDate, toDate);

    workbook = new SXSSFWorkbook(template, 2000);
    workbook.setCompressTempFiles(true);

    sheet = workbook.getSheetAt(0);
    rowIndex = startRow;

    styleData = createDataStyle(workbook);
    styleStt = createSttStyle(workbook);
  }

  private XSSFWorkbook loadAndPreprocessTemplate(
      String templatePath,
      String fromDate,
      String toDate
  ) throws Exception {

    try (FileInputStream fis = new FileInputStream(templatePath)) {
      XSSFWorkbook template = (XSSFWorkbook) WorkbookFactory.create(fis);

      if (!DataUtils.isNullOrEmpty(fromDate) && !DataUtils.isNullOrEmpty(toDate)) {
        String formattedFromDate = DateUtils.dateToString(
            DateUtils.getDateFromString(fromDate, "yyyy-MM-dd"),
            "dd/MM/yyyy"
        );

        String formattedToDate = DateUtils.dateToString(
            DateUtils.getDateFromString(toDate, "yyyy-MM-dd"),
            "dd/MM/yyyy"
        );

        setDateInTemplate(template, formattedFromDate, formattedToDate);
      }

      return template;

    } catch (Exception e) {
      log.error("Error loading template: {}", templatePath, e);
      throw new RuntimeException("Failed to load Excel template", e);
    }
  }

  private void setDateInTemplate(XSSFWorkbook template, String dateFrom, String dateTo) {
    try {
      XSSFSheet templateSheet = template.getSheetAt(0);

      CellStyle dateStyle = createTitleStyle(template);

      XSSFRow row = templateSheet.getRow(1);
      if (row == null) {
        row = templateSheet.createRow(1);
      }

      XSSFCell cell = row.getCell(0);
      if (cell == null) {
        cell = row.createCell(0);
      }

      cell.setCellStyle(dateStyle);
      cell.setCellValue("Thời gian: Từ " + dateFrom + " Đến " + dateTo);

    } catch (Exception e) {
      log.error("Could not set date range in template", e);
    }
  }

  public void writeRow(int stt, Object... values) {
    Row row = sheet.createRow(rowIndex++);

    int colIndex = 0;

    // STT
    Cell sttCell = row.createCell(colIndex++);
    sttCell.setCellStyle(styleStt);
    sttCell.setCellValue(stt);

    // Data
    for (Object value : values) {
      Cell cell = row.createCell(colIndex++);
      cell.setCellStyle(styleData);

      if (value == null) {
        continue;
      }

      if (value instanceof Number n) {
        cell.setCellValue(n.doubleValue());
      } else if (value instanceof Boolean b) {
        cell.setCellValue(b);
      } else {
        cell.setCellValue(value.toString());
      }
    }
  }

  public void flush(OutputStream os) throws Exception {
    try {
      workbook.write(os);
    } finally {
      workbook.close();
      workbook.dispose(); // tránh memory leak
    }
  }

  private CellStyle createDataStyle(Workbook workbook) {
    CellStyle style = workbook.createCellStyle();
    style.setFont(createFont(workbook));
    applyBorder(style);
    return style;
  }

  private CellStyle createSttStyle(Workbook workbook) {
    CellStyle style = workbook.createCellStyle();
    style.setFont(createFont(workbook));
    applyBorder(style);

    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);

    return style;
  }

  private CellStyle createTitleStyle(Workbook workbook) {
    CellStyle style = workbook.createCellStyle();

    Font font = workbook.createFont();
    font.setFontName("Times New Roman");
    font.setFontHeightInPoints((short) 12);
    font.setBold(true);

    style.setFont(font);
    style.setWrapText(true);
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);

    return style;
  }

  private void applyBorder(CellStyle style) {
    style.setBorderTop(BorderStyle.THIN);
    style.setBorderRight(BorderStyle.THIN);
    style.setBorderBottom(BorderStyle.THIN);
    style.setBorderLeft(BorderStyle.THIN);

    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    style.setFillForegroundColor(IndexedColors.WHITE.getIndex());

    style.setWrapText(true);
  }

  private Font createFont(Workbook workbook) {
    Font font = workbook.createFont();
    font.setFontName("Times New Roman");
    font.setFontHeightInPoints((short) 12);
    return font;
  }
}