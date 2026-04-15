package com.deeplearnx.core.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(int status, String message, T data) {

  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(HttpStatus.OK.value(), "Success", data);
  }

  public static <T> ApiResponse<T> created(T data) {
    return new ApiResponse<>(HttpStatus.CREATED.value(), "Created", data);
  }

  public static <T> ApiResponse<T> ok(String message, T data) {
    return new ApiResponse<>(HttpStatus.OK.value(), message, data);
  }

  public static ApiResponse<Void> ok(String message) {
    return new ApiResponse<>(HttpStatus.OK.value(), message, null);
  }

  public static ApiResponse<Void> error(int status, String message) {
    return new ApiResponse<>(status, message, null);
  }
}
