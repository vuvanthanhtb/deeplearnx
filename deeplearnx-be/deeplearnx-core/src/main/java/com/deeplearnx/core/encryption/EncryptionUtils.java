package com.deeplearnx.core.encryption;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;

public class EncryptionUtils {

  private static final String TRANSFORMATION = "AES/CBC/PKCS5PADDING";
  private static final char[] HEX_ARRAY = "0123456789abcdef".toCharArray();

  private static final byte[] IV = {
      6, 9, 6, 8, 8, 0, 5, 3,
      8, 7, 0, 9, 4, 1, 6, 4
  };

  private static final String SECRET_STRING = "VCMhrKJa6k6lC15UN23h7A==";

  private static IvParameterSpec ivParameterSpec;
  private static SecretKey secretKey;

  public static String encrypt(String value) throws Exception {
    Cipher cipher = getCipher(Cipher.ENCRYPT_MODE);
    cipher.update(value.getBytes());
    byte[] encrypted = cipher.doFinal();
    return bytesToHex(encrypted);
  }

  public static String decrypt(String encrypted) throws Exception {
    Cipher cipher = getCipher(Cipher.DECRYPT_MODE);
    cipher.update(Hex.decodeHex(encrypted.toCharArray()));
    byte[] originalText = cipher.doFinal();
    return new String(originalText, StandardCharsets.UTF_8);
  }

  private static Cipher getCipher(int mode) throws Exception {
    Cipher cipher = Cipher.getInstance(TRANSFORMATION);

    if (secretKey == null) {
      secretKey = generateKey();
    }

    if (ivParameterSpec == null) {
      ivParameterSpec = generateIv();
    }

    cipher.init(mode, secretKey, ivParameterSpec);
    return cipher;
  }

  private static SecretKey generateKey() {
    byte[] decodedKey = Base64.getDecoder().decode(SECRET_STRING);
    return new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
  }

  private static IvParameterSpec generateIv() {
    return new IvParameterSpec(IV);
  }

  private static String bytesToHex(byte[] bytes) {
    char[] hexChars = new char[bytes.length * 2];

    for (int i = 0; i < bytes.length; i++) {
      int v = bytes[i] & 0xFF;
      hexChars[i * 2] = HEX_ARRAY[v >>> 4];
      hexChars[i * 2 + 1] = HEX_ARRAY[v & 0x0F];
    }

    return new String(hexChars);
  }
}