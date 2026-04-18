package com.deeplearnx.config;

import com.deeplearnx.core.web.EncodedIdAnnotationIntrospector;
import com.fasterxml.jackson.databind.AnnotationIntrospector;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.AnnotationIntrospectorPair;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

  @Bean
  public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.findAndRegisterModules();

    AnnotationIntrospector existing = mapper.getSerializationConfig().getAnnotationIntrospector();
    mapper.setAnnotationIntrospector(
        AnnotationIntrospectorPair.pair(new EncodedIdAnnotationIntrospector(), existing)
    );

    return mapper;
  }
}
