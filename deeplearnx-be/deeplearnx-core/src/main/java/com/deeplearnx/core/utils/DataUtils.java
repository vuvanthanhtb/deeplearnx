package com.deeplearnx.core.utils;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DataUtils {

  private static final String suffixEmail = "@gmail.com.vn";

  public static boolean isNullOrEmpty(CharSequence cs) {
    int strLen;

    if (cs == null || (strLen = cs.length()) == 0) {
      return true;
    }

    for (int i = 0; i < strLen; i++) {
      if (!Character.isWhitespace(cs.charAt(i))) {
        return false;
      }
    }

    return true;
  }

  public static boolean isNullOrEmpty(final Collection<?> collection) {
    return collection == null || collection.isEmpty();
  }

  public static boolean isNullOrEmpty(final Object[] collection) {
    return collection == null || collection.length == 0;
  }

  public static boolean isNullOrEmpty(final Map<?, ?> map) {
    return map == null || map.isEmpty();
  }

  public static boolean isNullObject(Object obj1) {
    if (obj1 == null) {
      return true;
    }

    if (obj1 instanceof String) {
      return isNullOrEmpty(obj1.toString());
    }

    return false;
  }

  public static String checkAndGetUsername(String email) {
    if (email.endsWith(suffixEmail)) {
      String username = Arrays.asList(email.split("@")).get(0);

      Pattern p = Pattern.compile("[^A-Za-z0-9]");
      Matcher m = p.matcher(username);

      if (m.find()) {
        return null;
      } else {
        return username;
      }
    }

    return null;
  }

  public static String safeToString(Object obj1, String defaultValue) {
    if (obj1 == null) {
      return defaultValue;
    }

    return obj1.toString();
  }

  public static String safeToString(Object obj1) {
    return safeToString(obj1, "");
  }

  public static Integer safeToInt(Object obj1, Integer defaultValue) {
    Integer result = defaultValue;

    if (obj1 != null) {
      try {
        String value = obj1.toString();

        if (value.contains(".")) {
          result = Integer.valueOf(value.substring(0, value.lastIndexOf(".")));
        } else {
          result = Integer.valueOf(value);
        }

      } catch (Exception ignored) {
      }
    }

    return result;
  }

  public static String showMoney(Double number) {
    if (number == null) {
      return "0";
    }

    return String.format("%,.0f", number);
  }

  public static Double safeToDouble(Object obj1, Double defaultValue) {
    Double result = defaultValue;

    if (obj1 != null) {
      try {
        result = Double.parseDouble(obj1.toString());
      } catch (Exception ignored) {
      }
    }

    return result;
  }
}