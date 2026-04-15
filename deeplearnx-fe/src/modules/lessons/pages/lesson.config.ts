import { BUTTON, TEXT } from "@/libs/constants/form.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";

export const lessonConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "title",
      label: "Tên bài học",
      placeholder: "Nhập tên bài học...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "position",
      label: "Vị trí",
      placeholder: "1",
      inputType: "number",
      size: 12,
    },
    {
      type: TEXT,
      name: "slug",
      label: "Slug",
      placeholder: "",
      disabled: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "videoUrl",
      label: "Video URL",
      placeholder: "Nhập URL video...",
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          title: "Lưu",
          type: "submit",
          action: "save",
        },
        {
          title: "Đóng",
          type: "button",
          action: "close",
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

export const lessonInitialValues = {
  title: "",
  position: 1,
  slug: "",
  videoUrl: "",
};
