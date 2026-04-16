import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { SUCCESS_CODE } from "@/libs/constants/error-code.constant";
import { toastError, toastSuccess } from "@/libs/custom-toast";
import { formatDate } from "@/libs/utils/date.utils";

import { accountService } from "./account.service";

import type {
  AccountQuery,
  AccountRequest,
  AccountUpdateRequest,
  AccountResponse,
} from "./account.type";
import { parseStatusUser } from "@/libs/utils/status.utils";
import { getRoleName } from "@/libs/utils/role.utils";

export type AccountRow = {
  id: number;
  username: string;
  email: string;
  status: string;
  statusName: string;
  roles: string[];
  rolesName: string;
  fullName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

const buildAccountTable = (
  content: AccountResponse[],
  totalElements: number,
  totalPages: number,
  page: number,
  size: number,
): {
  content: AccountRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
} => ({
  content: content.map((c) => ({
    id: c.id,
    username: c.username,
    email: c.email,
    status: c.status,
    statusName: c.statusName,
    roles: c.roles,
    rolesName: c.rolesName,
    fullName: c.fullName,
    createdAt: c.createdAt ? formatDate(c.createdAt) : "—",
    createdBy: c.createdBy,
    updatedAt: c.updatedAt ? formatDate(c.updatedAt) : "—",
    updatedBy: c.updatedBy,
  })),
  totalElements,
  totalPages,
  page,
  size,
});

interface AccountTable {
  content: AccountRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

interface AccountState {
  accountTable: AccountTable;
  pendingTable: AccountTable;
  loading: boolean;
  pendingLoading: boolean;
}

const emptyTable: AccountTable = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 0,
};

const initialState: AccountState = {
  accountTable: { ...emptyTable },
  pendingTable: { ...emptyTable },
  loading: false,
  pendingLoading: false,
};

export const getAccounts = createAsyncThunk(
  "accounts/getAccounts",
  async (query: AccountQuery | undefined, thunkAPI) => {
    try {
      const { data: response } = await accountService.getAccounts(query);
      return {
        data: {
          ...response.data,
          content: response.data.content.map((item) => ({
            ...item,
            statusName: parseStatusUser(item.status),
            rolesName: item.roles.map((role) => getRoleName(role)).join(", "),
          })),
        },
      };
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("GET_FAILED");
    }
  },
);

export const createAccount = createAsyncThunk(
  "accounts/createAccount",
  async (payload: AccountRequest, thunkAPI) => {
    try {
      await accountService.createAccount(payload);
      toastSuccess(SUCCESS_CODE.ACCOUNT_CREATE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("CREATE_FAILED");
    }
  },
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async (payload: { id: number; data: AccountUpdateRequest }, thunkAPI) => {
    try {
      await accountService.updateAccount(payload.id, payload.data);
      toastSuccess(SUCCESS_CODE.ACCOUNT_UPDATE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("UPDATE_FAILED");
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id: number, thunkAPI) => {
    try {
      await accountService.deleteAccount(id);
      toastSuccess(SUCCESS_CODE.ACCOUNT_DELETE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("DELETE_FAILED");
    }
  },
);

export const lockAccount = createAsyncThunk(
  "accounts/lockAccount",
  async (id: number, thunkAPI) => {
    try {
      await accountService.lockAccount(id);
      toastSuccess(SUCCESS_CODE.ACCOUNT_LOCK);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("LOCK_FAILED");
    }
  },
);

export const unlockAccount = createAsyncThunk(
  "accounts/unlockAccount",
  async (id: number, thunkAPI) => {
    try {
      await accountService.unlockAccount(id);
      toastSuccess(SUCCESS_CODE.ACCOUNT_UNLOCK);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("UNLOCK_FAILED");
    }
  },
);

export const getPendingAccounts = createAsyncThunk(
  "accounts/getPendingAccounts",
  async (query: AccountQuery, thunkAPI) => {
    try {
      const { data: response } = await accountService.getAccountsApprove(query);
      return {
        data: {
          ...response.data,
          content: response.data.content.map((item) => ({
            ...item,
            statusName: parseStatusUser(item.status),
            rolesName: item.roles.map((role) => getRoleName(role)).join(", "),
          })),
        },
      };
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("GET_FAILED");
    }
  },
);

export const approveAccount = createAsyncThunk(
  "accounts/approveAccount",
  async (id: number, thunkAPI) => {
    try {
      await accountService.approveAccount(id);
      toastSuccess(SUCCESS_CODE.ACCOUNT_APPROVE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("APPROVE_FAILED");
    }
  },
);

export const rejectAccount = createAsyncThunk(
  "accounts/rejectAccount",
  async (id: number, thunkAPI) => {
    try {
      await accountService.rejectAccount(id);
      toastSuccess(SUCCESS_CODE.ACCOUNT_REJECT);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("REJECT_FAILED");
    }
  },
);

export const exportAccounts = createAsyncThunk(
  "accounts/exportAccounts",
  async (query: AccountQuery | undefined, thunkAPI) => {
    try {
      await accountService.exportAccounts(query);
      return true;
    } catch (error: unknown) {
      toastError(
        error instanceof Error ? error.message : "Xuất báo cáo thất bại.",
      );
      return thunkAPI.rejectWithValue("EXPORT_FAILED");
    }
  },
);

export const bulkApproveAccounts = createAsyncThunk(
  "accounts/bulkApproveAccounts",
  async (ids: number[], thunkAPI) => {
    try {
      await accountService.bulkApproveAccounts(ids);
      toastSuccess(SUCCESS_CODE.ACCOUNT_BULK_APPROVE);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("BULK_APPROVE_FAILED");
    }
  },
);

export const bulkRejectAccounts = createAsyncThunk(
  "accounts/bulkRejectAccounts",
  async (ids: number[], thunkAPI) => {
    try {
      await accountService.bulkRejectAccounts(ids);
      toastSuccess(SUCCESS_CODE.ACCOUNT_BULK_REJECT);
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "");
      return thunkAPI.rejectWithValue("BULK_REJECT_FAILED");
    }
  },
);

export const importAccounts = createAsyncThunk(
  "accounts/importAccounts",
  async (file: File, thunkAPI) => {
    try {
      const { data: response } = await accountService.importAccounts(file);
      const result = response.data;
      await thunkAPI.dispatch(getAccounts(undefined));
      if (result.failed === 0) {
        toastSuccess(`Nhập thành công ${result.success}/${result.total} tài khoản`);
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

export const downloadAccountImportTemplate = createAsyncThunk(
  "accounts/downloadTemplate",
  async (_, thunkAPI) => {
    try {
      await accountService.downloadImportTemplate();
      return true;
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : "Tải template thất bại");
      return thunkAPI.rejectWithValue("TEMPLATE_FAILED");
    }
  },
);

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.accountTable = buildAccountTable(
          data?.content ?? [],
          data?.totalElements ?? 0,
          data?.totalPages ?? 0,
          data?.page ?? 0,
          data?.size ?? 0,
        );
        state.loading = false;
      })
      .addCase(getAccounts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPendingAccounts.pending, (state) => {
        state.pendingLoading = true;
      })
      .addCase(getPendingAccounts.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.pendingTable = buildAccountTable(
          data?.content ?? [],
          data?.totalElements ?? 0,
          data?.totalPages ?? 0,
          data?.page ?? 0,
          data?.size ?? 0,
        );
        state.pendingLoading = false;
      })
      .addCase(getPendingAccounts.rejected, (state) => {
        state.pendingLoading = false;
      });
  },
});

export default accountSlice.reducer;
