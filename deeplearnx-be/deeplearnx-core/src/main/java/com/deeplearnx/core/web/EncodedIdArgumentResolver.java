package com.deeplearnx.core.web;

import com.deeplearnx.core.annotation.EncodedId;
import com.deeplearnx.core.utils.IdEncoder;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.HandlerMapping;

public class EncodedIdArgumentResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.hasParameterAnnotation(EncodedId.class);
  }

  @Override
  @SuppressWarnings("unchecked")
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

    EncodedId annotation = parameter.getParameterAnnotation(EncodedId.class);
    String name = !annotation.value().isEmpty() ? annotation.value() : parameter.getParameterName();

    HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
    Map<String, String> pathVariables =
        (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);

    String encoded = pathVariables != null ? pathVariables.get(name) : null;
    if (encoded == null) {
      throw new IllegalArgumentException("Path variable '" + name + "' not found");
    }

    return IdEncoder.decode(encoded);
  }
}
