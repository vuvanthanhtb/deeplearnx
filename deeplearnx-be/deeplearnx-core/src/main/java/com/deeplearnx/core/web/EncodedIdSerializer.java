package com.deeplearnx.core.web;

import com.deeplearnx.core.utils.IdEncoder;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

public class EncodedIdSerializer extends JsonSerializer<Long> {

  @Override
  public void serialize(Long value, JsonGenerator gen, SerializerProvider provider)
      throws IOException {
    gen.writeString(IdEncoder.encode(value));
  }
}
