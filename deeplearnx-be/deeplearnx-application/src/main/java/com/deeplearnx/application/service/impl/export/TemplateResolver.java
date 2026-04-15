package com.deeplearnx.application.service.impl.export;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

@Component
public class TemplateResolver {

  private final ResourceLoader resourceLoader;

  public TemplateResolver(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  /**
   * Resolve template path thành absolute file path. - Nếu resource trên filesystem (IDE / exploded
   * jar) → dùng trực tiếp. - Nếu resource trong JAR → copy sang temp file trước.
   */
  public String resolve(String templatePath) throws Exception {
    // Filesystem path (không có scheme prefix) → dùng File trực tiếp
    if (!templatePath.contains(":")) {
      File file = new File(templatePath);
      if (!file.exists()) {
        throw new RuntimeException("Template not found: " + templatePath);
      }
      return file.getAbsolutePath();
    }

    // classpath: / file: / http: → dùng ResourceLoader
    Resource resource = resourceLoader.getResource(templatePath);
    if (!resource.exists()) {
      throw new RuntimeException("Template not found: " + templatePath);
    }
    try {
      return resource.getFile().getAbsolutePath();
    } catch (Exception e) {
      return copyToTempFile(resource);
    }
  }

  private String copyToTempFile(Resource resource) throws Exception {
    File tmp = File.createTempFile("export_template_", ".xlsx");
    tmp.deleteOnExit();
    try (InputStream in = resource.getInputStream();
        FileOutputStream out = new FileOutputStream(tmp)) {
      in.transferTo(out);
    }
    return tmp.getAbsolutePath();
  }
}
