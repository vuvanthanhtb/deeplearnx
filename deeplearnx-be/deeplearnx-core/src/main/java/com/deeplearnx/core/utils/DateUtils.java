package com.deeplearnx.core.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import org.springframework.util.StringUtils;

public class DateUtils {

  public static String dateToString(Date date, String pattern) {
    if (date == null) {
      return null;
    }

    SimpleDateFormat sdfDate = new SimpleDateFormat(pattern);
    return sdfDate.format(date);
  }

  public static Date getDateFromString(String date, String pattern) throws ParseException {
    if (date != null && !date.isEmpty()) {
      SimpleDateFormat sp = new SimpleDateFormat(pattern);
      sp.setTimeZone(TimeZone.getTimeZone("Asia/Bangkok"));
      return sp.parse(date);
    }

    return null;
  }

  public static String changeFormatDate(String dateString, String fromPattern, String toPattern) {
    try {
      return dateToString(getDateFromString(dateString, fromPattern), toPattern);
    } catch (Exception ignored) {
    }

    return "";
  }

  public static String addTimeFromDate(String dateString) {
    if (dateString != null && !dateString.isEmpty()) {
      return dateString + " 00:00:00";
    }

    return dateString;
  }

  public static String addTimeToDate(String dateString) throws ParseException {
    if (dateString != null && !dateString.isEmpty()) {
      Date toFromTime = DateUtils.getDateFromString(dateString, "yyyy-MM-dd");

      Calendar cal = Calendar.getInstance();
      cal.setTime(toFromTime);
      cal.add(Calendar.DATE, 1);

      dateString = DateUtils.dateToString(cal.getTime(), "yyyy-MM-dd");
      return dateString + " 00:00:00";
    }

    return dateString;
  }

  public static boolean validateDateMonthRange(String fromDate, String toDate, int monthRange) {
    LocalDate fromDateValidate = LocalDate.parse(fromDate);
    LocalDate toDateValidate = LocalDate.parse(toDate);

    long wholeMonths = ChronoUnit.MONTHS.between(fromDateValidate, toDateValidate);
    LocalDate partialDate = fromDateValidate.plusMonths(wholeMonths);

    long remainingDays = ChronoUnit.DAYS.between(partialDate, toDateValidate);

    return (wholeMonths > monthRange)
        || ((wholeMonths == monthRange) && (remainingDays != 0));
  }


  public static LocalDate parseDate(String date) {
    if (!StringUtils.hasText(date)) {
      return null;
    }
    try {
      return LocalDate.parse(date);
    } catch (DateTimeParseException e) {
      return null;
    }
  }

  public static String nextDay(String date) {
    if (!StringUtils.hasText(date)) {
      return null;
    }
    try {
      return LocalDate.parse(date).plusDays(1).toString();
    } catch (DateTimeParseException e) {
      return null;
    }
  }
}