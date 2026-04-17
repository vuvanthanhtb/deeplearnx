package com.deeplearnx.core.utils;

import jakarta.annotation.PostConstruct;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HexFormat;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class IdEncoder {

  private static SecretKeySpec secretKey;

  @Value("${app.id-secret}")
  private String secret;

  @PostConstruct
  public void init() {
    byte[] keyBytes = Arrays.copyOf(secret.getBytes(StandardCharsets.UTF_8), 16);
    secretKey = new SecretKeySpec(keyBytes, "AES");
  }

  public static String encode(Long id) {
    try {
      byte[] input = new byte[16];
      ByteBuffer.wrap(input).putLong(id);
      Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
      cipher.init(Cipher.ENCRYPT_MODE, secretKey);
      byte[] encrypted = cipher.doFinal(input);
      return HexFormat.of().formatHex(encrypted);
    } catch (Exception e) {
      throw new IllegalStateException("Failed to encode id", e);
    }
  }

  public static Long decode(String encoded) {
    try {
      byte[] encrypted = HexFormat.of().parseHex(encoded);
      Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
      cipher.init(Cipher.DECRYPT_MODE, secretKey);
      byte[] decrypted = cipher.doFinal(encrypted);
      return ByteBuffer.wrap(decrypted).getLong();
    } catch (Exception e) {
      throw new IllegalArgumentException("Invalid id: " + encoded, e);
    }
  }
}
