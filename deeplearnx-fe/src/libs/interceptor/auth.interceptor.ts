import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import { axiosClient } from "./axios-client";
import { TokenService } from "./token.service";
import { AuthService } from "./auth.service";
import HTTP_CONFIG from "./http.config";

interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

export const setupAuthInterceptor = () => {
  // ── Request: đính kèm access token ──────────────────────
  axiosClient.interceptors.request.use(
    (config) => {
      const token = TokenService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── Response: xử lý 401 → refresh token ─────────────────
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as RetryableRequest;

      // Không phải 401 hoặc đã retry rồi → reject luôn
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        AuthService.logout();
        return Promise.reject(error);
      }

      // Nếu đang refresh → đưa request vào hàng đợi
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${HTTP_CONFIG.baseURL}/api/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const newAccessToken: string = data.data.accessToken;
        const newRefreshToken: string = data.data.refreshToken ?? refreshToken;

        TokenService.setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        AuthService.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};
