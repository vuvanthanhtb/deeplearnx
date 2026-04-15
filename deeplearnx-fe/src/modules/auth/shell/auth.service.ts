import type { AxiosResponse } from "axios";

import http from "@/libs/interceptor";
import type { ResponseBase } from "@/libs/interceptor/types";
import AUTH_ENDPOINT from "./auth.endpoint";

import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.type";

interface IAuthRepository {
  login(
    data: LoginRequest,
  ): Promise<AxiosResponse<ResponseBase<LoginResponse>>>;
  refresh(
    refreshToken: string,
  ): Promise<AxiosResponse<ResponseBase<RefreshTokenResponse>>>;
  logout(): Promise<AxiosResponse<ResponseBase<unknown>>>;
  profile(): Promise<AxiosResponse<ResponseBase<ProfileResponse>>>;
  register(
    data: RegisterRequest,
  ): Promise<AxiosResponse<ResponseBase<RegisterResponse>>>;
}

class AuthRepository implements IAuthRepository {
  private static instance: AuthRepository;

  private constructor() {}

  static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  login(data: LoginRequest) {
    return http.call<LoginResponse>({
      url: AUTH_ENDPOINT.LOGIN,
      method: "POST",
      data,
    });
  }

  refresh(refreshToken: string) {
    return http.call<RefreshTokenResponse>({
      url: AUTH_ENDPOINT.REFRESH,
      method: "POST",
      data: { refresh_token: refreshToken },
    });
  }

  logout() {
    return http.call({ url: AUTH_ENDPOINT.LOGOUT, method: "POST" });
  }

  profile() {
    return http.call<ProfileResponse>({
      url: AUTH_ENDPOINT.PROFILE,
      method: "GET",
    });
  }

  register(data: RegisterRequest) {
    return http.call<RegisterResponse>({
      url: AUTH_ENDPOINT.REGISTER,
      method: "POST",
      data,
    });
  }
}

export const authService: IAuthRepository = AuthRepository.getInstance();
