package com.deeplearnx.infrastructure.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

  public static final String MDC_REQUEST_ID = "requestId";
  public static final String MDC_USER_LOGIN = "userLogin";

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    String requestId = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    MDC.put(MDC_REQUEST_ID, requestId);

    String method  = request.getMethod();
    String uri     = request.getRequestURI();
    String query   = request.getQueryString();
    String fullUri = query != null ? uri + "?" + query : uri;
    String clientIp = resolveClientIp(request);

    log.info("→ {} {} [ip={}]", method, fullUri, clientIp);

    long start = System.currentTimeMillis();
    try {
      filterChain.doFilter(request, response);
    } finally {
      long ms     = System.currentTimeMillis() - start;
      int  status = response.getStatus();

      if (status >= 500) {
        log.error("← {} {} {} | {}ms [ip={}]", status, method, fullUri, ms, clientIp);
      } else if (status >= 400) {
        log.warn("← {} {} {} | {}ms [ip={}]", status, method, fullUri, ms, clientIp);
      } else {
        log.info("← {} {} {} | {}ms [ip={}]", status, method, fullUri, ms, clientIp);
      }

      MDC.remove(MDC_REQUEST_ID);
      MDC.remove(MDC_USER_LOGIN);
    }
  }

  private String resolveClientIp(HttpServletRequest request) {
    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.isBlank()) {
      ip = request.getHeader("X-Real-IP");
    }
    if (ip == null || ip.isBlank()) {
      return request.getRemoteAddr();
    }
    int comma = ip.indexOf(',');
    return comma > 0 ? ip.substring(0, comma).trim() : ip.trim();
  }
}
