package com.deeplearnx.core.web;

import com.deeplearnx.core.annotation.EncodedId;
import com.fasterxml.jackson.databind.introspect.Annotated;
import com.fasterxml.jackson.databind.introspect.NopAnnotationIntrospector;

public class EncodedIdAnnotationIntrospector extends NopAnnotationIntrospector {

  @Override
  public Object findSerializer(Annotated am) {
    return am.hasAnnotation(EncodedId.class) ? EncodedIdSerializer.class : null;
  }
}
