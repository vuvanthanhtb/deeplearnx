import {
  BTN_REFRESH,
  BTN_SEARCH,
  BTN_EXPORT,
} from "@/libs/constants/button.constant";
import { BUTTON, DATE, TEXT } from "@/libs/constants/form.constant";
import { PAGE_CURRENT, PAGE_SIZE } from "@/libs/constants/table.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";
import { getDateFromNow } from "@/libs/utils/date.utils";

const courseSearchConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "name",
      label: "Tên khóa học",
      placeholder: "Tìm kiếm theo tên khóa học...",
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
      size: 3,
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

export const buildCourseSearchConfig = (isAdmin: boolean): IBaseFormConfig => ({
  ...courseSearchConfig,
  fields: courseSearchConfig.fields.map((f) => {
    if (f.type !== BUTTON) return f;
    return {
      ...f,
      childs: f.childs?.filter((c) => isAdmin || c.action !== BTN_EXPORT),
    };
  }),
});

export const courseSearchInitialValues = {
  name: "",
  fromDate: getDateFromNow(),
  toDate: new Date(),
  page: PAGE_CURRENT,
  size: PAGE_SIZE,
};

export const parsePayloadSearch = (
  data: Record<string, unknown>,
  isExport = false,
) => {
  const params: Record<string, unknown> = {
    name: String(data.name ?? ""),
    fromDate: String(data.fromDate ?? ""),
    toDate: String(data.toDate ?? ""),
  };
  if (!isExport) {
    params["page"] = PAGE_CURRENT;
    params["size"] = PAGE_SIZE;
  }
  return params;
};
