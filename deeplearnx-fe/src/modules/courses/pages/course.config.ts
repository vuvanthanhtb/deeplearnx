import { BTN_SAVE, BTN_CLOSE } from "@/libs/constants/button.constant";
import { BUTTON, EDITOR, TEXT } from "@/libs/constants/form.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";

export const courseConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "name",
      label: "Tên khóa học",
      placeholder: "Nhập tên khóa học...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "slug",
      label: "Slug",
      placeholder: "",
      size: 12,
      disabled: true,
    },
    {
      type: EDITOR,
      name: "description",
      label: "Mô tả",
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          title: "Lưu",
          type: "submit",
          action: BTN_SAVE,
        },
        {
          title: "Đóng",
          type: "button",
          action: BTN_CLOSE,
          style: {
            background: "inherit",
            color: "#1a73e8",
            border: "1px solid #1a73e8",
          },
        },
      ],
    },
  ],
};

export const courseInitialValues = {
  name: "",
  slug: "",
  description: "",
};
