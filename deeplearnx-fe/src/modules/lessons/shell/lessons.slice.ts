import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { SUCCESS_CODE } from "@/libs/constants/error-code.constant";
import { toastError, toastSuccess } from "@/libs/custom-toast";

import type { LessonRequest, LessonResponse } from "./lessons.type";
import { lessonsService } from "./lessons.service";

interface LessonsState {
  lessons: LessonResponse[];
  loading: boolean;
}

const initialState: LessonsState = {
  lessons: [],
  loading: false,
};

export const getLessonsByCourseSlug = createAsyncThunk(
  "lessons/getLessonsByCourseSlug",
  async (courseSlug: string) => {
    try {
      const { data: response } =
        await lessonsService.getLessonsByCourseSlug(courseSlug);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return [];
    }
  },
);

export const createLesson = createAsyncThunk(
  "lessons/createLesson",
  async (payload: LessonRequest, thunkAPI) => {
    try {
      await lessonsService.createLesson(payload);
      await thunkAPI.dispatch(getLessonsByCourseSlug(payload.courseSlug));
      toastSuccess(SUCCESS_CODE.LESSON_CREATE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("CREATE_FAILED");
    }
  },
);

export const updateLesson = createAsyncThunk(
  "lessons/updateLesson",
  async (payload: { id: number; data: LessonRequest }, thunkAPI) => {
    try {
      await lessonsService.updateLesson(payload.id, payload.data);
      await thunkAPI.dispatch(getLessonsByCourseSlug(payload.data.courseSlug));
      toastSuccess(SUCCESS_CODE.LESSON_UPDATE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("UPDATE_FAILED");
    }
  },
);

export const deleteLesson = createAsyncThunk(
  "lessons/deleteLesson",
  async (payload: { id: number; courseSlug: string }, thunkAPI) => {
    try {
      await lessonsService.deleteLesson(payload.id);
      await thunkAPI.dispatch(getLessonsByCourseSlug(payload.courseSlug));
      toastSuccess(SUCCESS_CODE.LESSON_DELETE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("DELETE_FAILED");
    }
  },
);

const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLessonsByCourseSlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLessonsByCourseSlug.fulfilled, (state, action) => {
        state.lessons = action.payload;
        state.loading = false;
      })
      .addCase(getLessonsByCourseSlug.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default lessonsSlice.reducer;
