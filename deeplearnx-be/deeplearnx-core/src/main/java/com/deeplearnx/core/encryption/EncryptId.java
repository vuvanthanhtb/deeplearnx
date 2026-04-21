package com.deeplearnx.core.encryption;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.util.StdConverter;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

@Slf4j
public class EncryptId extends JsonSerializer<String> {


  @Override
  public void serialize(String s, JsonGenerator jsonGenerator,
      SerializerProvider serializerProvider) throws IOException {
    log.info("xxxxxxxxxxxxxx");
    System.out.println(">>> SERIALIZER RUNNING");
    if (s == null) {
      jsonGenerator.writeNull();
      return;
    }

    String encoded = null;
    try {
      encoded = EncryptionUtils.encrypt(s);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
    jsonGenerator.writeString(encoded);
  }
}