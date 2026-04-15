export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  refreshToken: string;
  accessToken: string;
}

export type RefreshTokenResponse = AuthTokens;

export interface ProfileUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface ProfileResponse extends ProfileUser {
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface RegisterResponse {
  message: string;
}
