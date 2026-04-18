package com.deeplearnx.core.web;

import com.deeplearnx.core.annotation.EncodedId;
import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.ser.BeanPropertyWriter;
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier;
import java.util.List;

public class EncodedIdSerializerModifier extends BeanSerializerModifier {

  @Override
  @SuppressWarnings("unchecked")
  public List<BeanPropertyWriter> changeProperties(
      SerializationConfig config,
      BeanDescription beanDesc,
      List<BeanPropertyWriter> beanProperties) {

    for (BeanPropertyWriter writer : beanProperties) {
      if (writer.getAnnotation(EncodedId.class) != null) {
        writer.assignSerializer((JsonSerializer<Object>) (JsonSerializer<?>) new EncodedIdSerializer());
      }
    }
    return beanProperties;
  }
}
