import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { SUCCESS_CODE } from "@/libs/constants/error-code.constant";
import { toastError, toastSuccess } from "@/libs/custom-toast";
import { formatDate } from "@/libs/utils/date.utils";

import type { CourseQuery, CourseRequest, CourseResponse } from "./courses.type";
import { coursesService } from "./courses.service";
import { PAGE_CURRENT, PAGE_SIZE } from "@/libs/constants/table.constant";

export type CourseRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  lessonCount: number;
};

const buildCourseTable = (
  content: CourseResponse[],
  totalElements: number,
  totalPages: number,
  page: number,
  size: number,
) => ({
  content: content.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    createdAt: c.createdAt ? formatDate(c.createdAt) : "—",
    lessonCount: c.lessonCount ?? 0,
  })),
  totalElements,
  totalPages,
  page,
  size,
});

interface CoursesState {
  courseTable: {
    content: CourseRow[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  };
  query: CourseQuery;
  loading: boolean;
}

const initialState: CoursesState = {
  courseTable: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: PAGE_SIZE,
  },
  query: { name: "", page: PAGE_CURRENT, size: PAGE_SIZE },
  loading: false,
};

export const getCourses = createAsyncThunk(
  "courses/getCourses",
  async (query: CourseQuery | undefined, thunkAPI) => {
    try {
      const state = (thunkAPI.getState() as { courses: CoursesState }).courses;
      const params = query ?? state.query;
      const { data: response } = await coursesService.getCourses(params);
      return { data: response.data, params };
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("GET_FAILED");
    }
  },
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (payload: CourseRequest, thunkAPI) => {
    try {
      await coursesService.createCourse(payload);
      await thunkAPI.dispatch(getCourses(undefined));
      toastSuccess(SUCCESS_CODE.COURSE_CREATE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("CREATE_FAILED");
    }
  },
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (payload: { id: string; data: CourseRequest }, thunkAPI) => {
    try {
      await coursesService.updateCourse(payload.id, payload.data);
      await thunkAPI.dispatch(getCourses(undefined));
      toastSuccess(SUCCESS_CODE.COURSE_UPDATE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("UPDATE_FAILED");
    }
  },
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string, thunkAPI) => {
    try {
      await coursesService.deleteCourse(id);
      await thunkAPI.dispatch(getCourses(undefined));
      toastSuccess(SUCCESS_CODE.COURSE_DELETE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("DELETE_FAILED");
    }
  },
);

export const exportCourses = createAsyncThunk(
  "courses/exportCourses",
  async (params: CourseQuery | undefined, thunkAPI) => {
    try {
      await coursesService.exportCourses(params);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "Xuất file thất bại");
      return thunkAPI.rejectWithValue("EXPORT_FAILED");
    }
  },
);

export const importCourses = createAsyncThunk(
  "courses/importCourses",
  async (file: File, thunkAPI) => {
    try {
      const { data: response } = await coursesService.importCourses(file);
      const result = response.data;
      await thunkAPI.dispatch(getCourses(undefined));
      if (result.failed === 0) {
        toastSuccess(`Nhập thành công ${result.success}/${result.total} khóa học`);
      } else {
        toastError(`${result.success}/${result.total} thành công, ${result.failed} dòng lỗi`);
      }
      return result;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "Nhập file thất bại");
      return thunkAPI.rejectWithValue("IMPORT_FAILED");
    }
  },
);

export const downloadCourseImportTemplate = createAsyncThunk(
  "courses/downloadTemplate",
  async (_, thunkAPI) => {
    try {
      await coursesService.downloadImportTemplate();
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "Tải template thất bại");
      return thunkAPI.rejectWithValue("TEMPLATE_FAILED");
    }
  },
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<Partial<CourseQuery>>) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => { state.loading = true; })
      .addCase(getCourses.fulfilled, (state, action) => {
        const { data, params } = action.payload;
        state.query = { ...state.query, ...params };
        state.courseTable = buildCourseTable(
          data?.content ?? [],
          data?.totalElements ?? 0,
          data?.totalPages ?? 0,
          data?.page ?? 0,
          data?.size ?? 0,
        );
        state.loading = false;
      })
      .addCase(getCourses.rejected, (state) => { state.loading = false; });
  },
});

export const { setQuery } = coursesSlice.actions;
export default coursesSlice.reducer;
