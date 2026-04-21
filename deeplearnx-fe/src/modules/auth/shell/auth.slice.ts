import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { SUCCESS_CODE } from "@/libs/constants/error-code.constant";
import { toastError, toastSuccess } from "@/libs/custom-toast";

import { TokenService } from "@/libs/interceptor/token.service";
import { getApiErrorMessage } from "@/libs/interceptor/helpers";

import { authService } from "./auth.service";
import type { LoginRequest, ProfileUser, RegisterRequest } from "./auth.type";

interface AuthState {
  isAuthenticated: boolean;
  user: ProfileUser | null;
  roles: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  roles: [],
};

export const profileUser = createAsyncThunk(
  "auth/profileUser",
  async (_, thunkAPI) => {
    try {
      const { data: response } = await authService.profile();
      return {
        isAuthenticated: true,
        roles: response.data.roles,
        user: {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
        },
      };
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return thunkAPI.rejectWithValue("PROFILE_FAILED");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: LoginRequest, thunkAPI) => {
    try {
      const { data: response } = await authService.login(payload);
      if (response.data) {
        TokenService.setTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );
      }
      const r = await thunkAPI.dispatch(profileUser());
      if (profileUser.rejected.match(r)) {
        return thunkAPI.rejectWithValue("PROFILE_AFTER_LOGIN_FAILED");
      }
      toastSuccess(SUCCESS_CODE.AUTH_LOGIN);
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return thunkAPI.rejectWithValue("LOGIN_FAILED");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      thunkAPI.dispatch(logout());
      toastSuccess(SUCCESS_CODE.AUTH_LOGOUT);
      TokenService.clear();
      return true;
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return thunkAPI.rejectWithValue("LOGOUT_FAILED");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: RegisterRequest, thunkAPI) => {
    try {
      const { data: response } = await authService.register(payload);
      toastSuccess(response.message);
      return true;
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return thunkAPI.rejectWithValue("REGISTER_FAILED");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(profileUser.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.roles = action.payload.roles;
    });
    builder.addCase(profileUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
