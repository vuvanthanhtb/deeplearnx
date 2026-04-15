package com.deeplearnx.core.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtils {

  private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
  private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
  private static final Pattern MULTI_DASH = Pattern.compile("-{2,}");

  private SlugUtils() {
  }

  public static String toSlug(String input) {
    String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
    return NON_LATIN.matcher(
        MULTI_DASH.matcher(
            WHITESPACE.matcher(normalized.toLowerCase()).replaceAll("-")
        ).replaceAll("-")
    ).replaceAll("").strip().replaceAll("^-|-$", "");
  }
}
