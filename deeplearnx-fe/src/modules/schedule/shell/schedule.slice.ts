import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { SUCCESS_CODE } from "@/libs/constants/error-code.constant";
import { toastError, toastSuccess } from "@/libs/custom-toast";

import type { ScheduleRequest, ScheduleResponse } from "./schedule.type";
import { scheduleService } from "./schedule.service";
import { getApiErrorMessage } from "@/libs/interceptor/helpers";

interface ScheduleState {
  schedules: ScheduleResponse[];
  loading: boolean;
}

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
};

export const getSchedules = createAsyncThunk(
  "schedule/getSchedules",
  async () => {
    try {
      const { data: response } = await scheduleService.getSchedules();
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return [];
    }
  },
);

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (payload: ScheduleRequest, thunkAPI) => {
    try {
      await scheduleService.createSchedule(payload);
      await thunkAPI.dispatch(getSchedules());
      toastSuccess(SUCCESS_CODE.SCHEDULE_CREATE);
      return true;
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return thunkAPI.rejectWithValue("CREATE_FAILED");
    }
  },
);

export const updateSchedule = createAsyncThunk(
  "schedule/updateSchedule",
  async (payload: { id: string; data: ScheduleRequest }, thunkAPI) => {
    try {
      await scheduleService.updateSchedule(payload.id, payload.data);
      await thunkAPI.dispatch(getSchedules());
      toastSuccess(SUCCESS_CODE.SCHEDULE_UPDATE);
      return true;
    } catch (error: unknown) {
      toastError(getApiErrorMessage(error));
      return thunkAPI.rejectWithValue("UPDATE_FAILED");
    }
  },
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSchedules.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSchedules.fulfilled, (state, action) => {
        state.schedules = action.payload;
        state.loading = false;
      })
      .addCase(getSchedules.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default scheduleSlice.reducer;
