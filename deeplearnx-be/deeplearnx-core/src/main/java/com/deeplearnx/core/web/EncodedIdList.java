package com.deeplearnx.core.web;

import com.deeplearnx.core.utils.IdEncoder;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@JsonDeserialize(using = EncodedIdList.Deserializer.class)
public class EncodedIdList extends ArrayList<Long> {

  public static class Deserializer extends JsonDeserializer<EncodedIdList> {

    @Override
    public EncodedIdList deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
      List<String> encoded = p.readValueAs(new TypeReference<List<String>>() {});
      EncodedIdList list = new EncodedIdList();
      encoded.forEach(s -> list.add(IdEncoder.decode(s)));
      return list;
    }
  }
}
