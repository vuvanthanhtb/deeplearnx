package com.deeplearnx.config;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LogDirectoryInitializer {

  private static final Path LOG_DIR = Paths.get("logs");

  @PostConstruct
  public void init() {
    if (!Files.exists(LOG_DIR)) {
      try {
        Files.createDirectories(LOG_DIR);
        log.info("Created log directory: {}", LOG_DIR.toAbsolutePath());
      } catch (IOException e) {
        log.warn("Could not create log directory {}: {}", LOG_DIR.toAbsolutePath(), e.getMessage());
      }
    }
  }
}
