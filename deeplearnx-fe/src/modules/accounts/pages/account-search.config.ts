import { BUTTON, DATE, SELECT, TEXT } from "@/libs/constants/form.constant";
import { defaultSelectOption } from "@/libs/constants/options.constant";
import { PAGE_CURRENT, PAGE_SIZE } from "@/libs/constants/table.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";
import { getDateFromNow, toDateKey } from "@/libs/utils/date.utils";
import type { AccountQuery } from "../shell/account.type";
import {
  BTN_EXPORT,
  BTN_REFRESH,
  BTN_SEARCH,
} from "@/libs/constants/button.constant";

const accountSearchConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "fullName",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên...",
      size: 3,
    },
    {
      type: TEXT,
      name: "username",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản...",
      size: 3,
    },
    {
      type: TEXT,
      name: "email",
      label: "Email",
      placeholder: "Nhập email...",
      size: 3,
    },
    {
      type: SELECT,
      name: "status",
      option: "statusOptions",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái...",
      required: false,
      size: 3,
    },
    {
      type: SELECT,
      name: "role",
      option: "roleOptions",
      label: "Vai trò",
      placeholder: "Chọn vai trò...",
      required: false,
      size: 3,
    },
    {
      type: DATE,
      name: "fromDate",
      label: "Ngày bắt đầu",
      placeholder: "Chọn ngày bắt đầu...",
      required: false,
      size: 3,
    },
    {
      type: DATE,
      name: "toDate",
      label: "Ngày kết thúc",
      placeholder: "Chọn ngày kết thúc...",
      required: false,
      size: 3,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          title: "Refresh",
          type: "button",
          action: BTN_REFRESH,
          style: {
            background: "inherit",
            color: "#1a73e8",
            border: "1px solid #1a73e8",
          },
        },
        {
          title: "Tìm kiếm",
          type: "submit",
          action: BTN_SEARCH,
        },
        {
          title: "Xuất báo cáo",
          type: "submit",
          action: BTN_EXPORT,
          style: {
            background: "#1a73e8",
            color: "#fff",
            border: "1px solid #1a73e8",
          },
        },
      ],
    },
  ],
};

export const buildAccountSearchConfig = (isAdmin: boolean): IBaseFormConfig => ({
  ...accountSearchConfig,
  fields: accountSearchConfig.fields.map((f) => {
    if (f.type !== BUTTON) return f;
    return {
      ...f,
      childs: f.childs?.filter((c) => isAdmin || c.action !== BTN_EXPORT),
    };
  }),
});

export const accountSearchInitialValues = {
  fullName: "",
  username: "",
  email: "",
  status: defaultSelectOption,
  role: defaultSelectOption,
  fromDate: getDateFromNow(),
  toDate: new Date(),
  page: PAGE_CURRENT,
  size: PAGE_SIZE,
};

export const buildQuery = (
  data: Record<string, unknown>,
  isExport: boolean = false,
): AccountQuery => {
  const params: AccountQuery = {
    fullName: String(data.fullName ?? "") || undefined,
    username: String(data.username ?? "") || undefined,
    email: String(data.email ?? "") || undefined,
    status: (data.status as { value?: string })?.value || undefined,
    role: (data.role as { value?: string })?.value || undefined,
    fromDate: data.fromDate
      ? toDateKey(new Date(String(data.fromDate)))
      : undefined,
    toDate: data.toDate ? toDateKey(new Date(String(data.toDate))) : undefined,
  };

  if (!isExport) {
    params.page = typeof data.page === "number" ? data.page : PAGE_CURRENT;
    params.size = typeof data.size === "number" ? data.size : PAGE_SIZE;
  }

  return params;
};
