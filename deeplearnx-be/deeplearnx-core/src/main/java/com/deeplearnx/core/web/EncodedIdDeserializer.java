package com.deeplearnx.core.web;

import com.deeplearnx.core.utils.IdEncoder;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;

public class EncodedIdDeserializer extends JsonDeserializer<Long> {

  @Override
  public Long deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
    String encoded = p.getText();
    return encoded == null || encoded.isBlank() ? null : IdEncoder.decode(encoded);
  }
}
