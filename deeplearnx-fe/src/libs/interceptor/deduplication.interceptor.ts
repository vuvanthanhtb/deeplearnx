import type { AxiosRequestConfig, AxiosResponse } from "axios";

import { axiosClient } from "./axios-client";

/**
 * Interceptor chống gửi request trùng lặp
 *
 * Nếu có nhiều request GET giống nhau đang chạy,
 * các request sau sẽ dùng chung kết quả của request đầu tiên
 */
const pendingRequests = new Map<string, Promise<AxiosResponse>>();
const requestTimestamps = new Map<string, number>();

// Thời gian tối đa giữ request trong cache (5 phút)
const MAX_REQUEST_AGE = 5 * 60 * 1000;

/**
 * Tạo key định danh cho request
 * Chỉ áp dụng cho GET (an toàn, không gây side-effect)
 */
const generateRequestKey = (config: AxiosRequestConfig): string | null => {
  const { method, url, params } = config;

  if (method?.toLowerCase() !== "get") {
    return null;
  }

  const paramsStr = params ? JSON.stringify(params) : "";
  return `GET-${url}-${paramsStr}`;
};

/**
 * Dọn dẹp các request quá hạn
 */
const cleanupStaleRequests = (): void => {
  const now = Date.now();

  requestTimestamps.forEach((timestamp, key) => {
    if (now - timestamp > MAX_REQUEST_AGE) {
      pendingRequests.delete(key);
      requestTimestamps.delete(key);
    }
  });
};

/**
 * Ghi đè axios.request để xử lý deduplicate request
 */
export const setupDeduplicationInterceptor = (): void => {
  const originalRequest = axiosClient.request.bind(axiosClient);

  axiosClient.request = function <T = unknown, R = AxiosResponse<T>, D = unknown>(
    config: AxiosRequestConfig<D>
  ): Promise<R> {
    const requestKey = generateRequestKey(config);

    // Không phải GET thì xử lý như bình thường
    if (!requestKey) {
      return originalRequest<T, R, D>(config);
    }

    cleanupStaleRequests();

    // Nếu request giống nhau đang tồn tại thì dùng lại
    const existingRequest = pendingRequests.get(requestKey);
    if (existingRequest) {
      return existingRequest as Promise<R>;
    }

    const requestPromise = originalRequest<T, R, D>(config).finally(() => {
      pendingRequests.delete(requestKey);
      requestTimestamps.delete(requestKey);
    });

    pendingRequests.set(requestKey, requestPromise as Promise<AxiosResponse>);
    requestTimestamps.set(requestKey, Date.now());

    return requestPromise;
  };
};

/**
 * Xoá toàn bộ request đang chờ
 * Dùng khi logout hoặc chuyển trang
 */
export const clearPendingRequests = (): void => {
  pendingRequests.clear();
  requestTimestamps.clear();
};
