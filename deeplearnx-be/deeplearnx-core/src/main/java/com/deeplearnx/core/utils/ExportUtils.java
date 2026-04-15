package com.deeplearnx.core.utils;

import java.util.Date;

public class ExportUtils {

  public static String contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  public static String accessControlExposeHeaders = "Access-Control-Expose-Headers";
  public static String contentDisposition = "Content-Disposition";

  public static String getAttachmentAndFileName(String name) {
    return "attachment; filename=" + DateUtils.dateToString(new Date(), "yyyyMMdd") + "_" + name;
  }
}
