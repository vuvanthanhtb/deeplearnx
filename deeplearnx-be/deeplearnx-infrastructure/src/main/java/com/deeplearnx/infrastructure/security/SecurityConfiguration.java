package com.deeplearnx.infrastructure.security;

import com.deeplearnx.core.entity.Role;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final AuthenticationFilter authenticationFilter;
  private final AuthenticationProvider authenticationProvider;

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    String SUPERADMIN = Role.SUPERADMIN.name();
    String ADMIN     = Role.ADMIN.name();
    String APPROVER  = Role.APPROVER.name();

    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(auth -> auth

            // ── Public ────────────────────────────────────────────────────
            .requestMatchers(HttpMethod.POST,
                "/api/auth/login", "/api/auth/register", "/api/auth/refresh").permitAll()
            .requestMatchers("/uploads/**", "/ws/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

            // ── Users ─────────────────────────────────────────────────────
            // GET: SUPERADMIN, ADMIN, APPROVER
            .requestMatchers(HttpMethod.GET, "/api/users/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN, APPROVER)
            // CREATE / DELETE / LOCK / UNLOCK: SUPERADMIN, ADMIN
            .requestMatchers(HttpMethod.POST, "/api/users/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            // UPDATE: SUPERADMIN (self-only enforced in service), ADMIN
            .requestMatchers(HttpMethod.PUT, "/api/users/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            .requestMatchers(HttpMethod.DELETE, "/api/users/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)

            // ── User Approves ──────────────────────────────────────────────
            // SUPERADMIN, ADMIN, APPROVER
            .requestMatchers("/api/user-approves/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN, APPROVER)

            // ── Courses ───────────────────────────────────────────────────
            .requestMatchers(HttpMethod.GET, "/api/courses/export")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            .requestMatchers(HttpMethod.GET, "/api/courses/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/courses/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            .requestMatchers(HttpMethod.PUT, "/api/courses/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            .requestMatchers(HttpMethod.DELETE, "/api/courses/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)

            // ── Lessons ───────────────────────────────────────────────────
            .requestMatchers(HttpMethod.GET, "/api/lessons/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/lessons/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            .requestMatchers(HttpMethod.PUT, "/api/lessons/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)
            .requestMatchers(HttpMethod.DELETE, "/api/lessons/**")
                .hasAnyAuthority(SUPERADMIN, ADMIN)

            .anyRequest().authenticated()
        )
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedEntryPoint()));
    return http.build();
  }

  @Bean
  AuthenticationEntryPoint unauthorizedEntryPoint() {
    return (request, response, authException) -> {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write(
          "{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}"
      );
    };
  }
}
