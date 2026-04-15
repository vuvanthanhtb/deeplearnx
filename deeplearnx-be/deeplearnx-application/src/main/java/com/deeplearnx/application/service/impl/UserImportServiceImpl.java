package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateUserRequest;
import com.deeplearnx.application.dto.response.UserImportResult;
import com.deeplearnx.application.dto.response.UserImportRowResult;
import com.deeplearnx.application.service.UserApproveService;
import com.deeplearnx.application.service.UserImportService;
import com.deeplearnx.core.entity.Role;
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
public class UserImportServiceImpl implements UserImportService {

  // Cột trong file Excel (0-indexed):
  // 0: STT | 1: username | 2: email | 3: password | 4: fullName | 5: roles
  private static final int COL_USERNAME  = 1;
  private static final int COL_EMAIL     = 2;
  private static final int COL_PASSWORD  = 3;
  private static final int COL_FULLNAME  = 4;
  private static final int COL_ROLES     = 5;
  private static final int DATA_START_ROW = 4;

  private final UserApproveService userApproveService;

  @Value("${export.template.user-import}")
  private String userImportTemplatePath;

  // -------------------------------------------------------------------------
  // Import
  // -------------------------------------------------------------------------

  @Override
  public UserImportResult importUsers(MultipartFile file) {
    validateFile(file);
    log.info("Start importing users from file: {}", file.getOriginalFilename());

    List<UserImportRowResult> failures = new ArrayList<>();
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
        String username = getCellValue(row, COL_USERNAME);
        String email    = getCellValue(row, COL_EMAIL);
        String password = getCellValue(row, COL_PASSWORD);
        String fullName = getCellValue(row, COL_FULLNAME);
        String rolesStr = getCellValue(row, COL_ROLES);

        String validationError = validate(rowIdx + 1, username, email, password);
        if (validationError != null) {
          failures.add(new UserImportRowResult(rowIdx + 1, username, email, validationError));
          continue;
        }

        List<Role> roles = parseRoles(rolesStr);
        try {
          userApproveService.create(
              new CreateUserRequest(username, email, password, fullName, roles));
          success++;
          log.info("Row {}: created approve for username={}", rowIdx + 1, username);
        } catch (Exception e) {
          log.warn("Row {}: failed username={} reason={}", rowIdx + 1, username, e.getMessage());
          failures.add(new UserImportRowResult(rowIdx + 1, username, email, e.getMessage()));
        }
      }
    } catch (BadRequestException e) {
      throw e;
    } catch (Exception e) {
      log.error("Cannot parse Excel file", e);
      throw new BadRequestException("Không thể đọc file Excel: " + e.getMessage());
    }

    log.info("Import done: total={}, success={}, failed={}", total, success, failures.size());
    return new UserImportResult(total, success, failures.size(), failures);
  }

  // -------------------------------------------------------------------------
  // Download template
  // -------------------------------------------------------------------------

  @Override
  public void downloadTemplate(HttpServletResponse response) throws IOException {
    File templateFile = new File(userImportTemplatePath);
    if (!templateFile.exists()) {
      throw new NotFoundException("Import template not found");
    }
    response.setContentType(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition",
        "attachment; filename=\"user_import_template.xlsx\"");
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    try (FileInputStream fis = new FileInputStream(templateFile)) {
      fis.transferTo(response.getOutputStream());
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private void validateFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("File không được để trống");
    }
    String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
    if (!filename.toLowerCase().endsWith(".xlsx")) {
      throw new BadRequestException("Chỉ hỗ trợ file .xlsx");
    }
  }

  private String validate(int rowNum, String username, String email, String password) {
    if (!StringUtils.hasText(username)) {
      return "Tên đăng nhập không được để trống";
    }
    if (!StringUtils.hasText(email)) {
      return "Email không được để trống";
    }
    if (!StringUtils.hasText(password)) {
      return "Mật khẩu không được để trống";
    }
    return null;
  }

  private List<Role> parseRoles(String rolesStr) {
    if (!StringUtils.hasText(rolesStr)) {
      return List.of(Role.USER);
    }
    List<Role> roles = new ArrayList<>();
    for (String part : rolesStr.split(",")) {
      String name = part.trim().toUpperCase();
      try {
        roles.add(Role.valueOf(name));
      } catch (IllegalArgumentException ignored) {
        log.warn("Ignoring unknown role: {}", name);
      }
    }
    return roles.isEmpty() ? List.of(Role.USER) : roles;
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
    for (int c = COL_USERNAME; c <= COL_ROLES; c++) {
      Cell cell = row.getCell(c);
      if (cell != null && cell.getCellType() != CellType.BLANK
          && StringUtils.hasText(getCellValue(row, c))) {
        return false;
      }
    }
    return true;
  }
}
