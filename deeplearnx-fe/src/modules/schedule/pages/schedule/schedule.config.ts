import { BUTTON, EDITOR, TEXT } from "@/libs/constants/form.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";

export const scheduleConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "title",
      label: "Tiêu đề",
      placeholder: "Nhập tiêu đề lịch...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      inputType: "datetime-local",
      name: "scheduledAt",
      label: "Thời gian",
      required: true,
      size: 12,
    },
    {
      type: EDITOR,
      name: "content",
      label: "Nội dung",
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          title: "Lưu",
          type: "submit",
          action: "submit",
        },
        {
          title: "Đóng",
          type: "button",
          action: "close",
          style: {
            background: "inherit",
            color: "#26c55b",
            border: "1px solid #26c55b",
          },
        },
      ],
    },
  ],
};

export const scheduleInitialValues = {
  title: "",
  scheduledAt: "",
  content: "",
};
