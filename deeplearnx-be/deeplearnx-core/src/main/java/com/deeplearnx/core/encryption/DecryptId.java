package com.deeplearnx.core.encryption;

import com.fasterxml.jackson.databind.util.StdConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class DecryptId extends StdConverter<String, Long> {

  @Override
  public Long convert(String data) {
    try {
      return Long.valueOf(EncryptionUtils.decrypt(data));
    } catch (Exception e) {
      log.error("Encrypt leadId error: {}", e.getMessage(), e);
      return null;
    }
  }
}
