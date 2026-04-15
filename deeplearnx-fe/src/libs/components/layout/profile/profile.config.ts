import { BTN_CLOSE } from "@/libs/constants/button.constant";
import { TEXT, BUTTON } from "@/libs/constants/form.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";

export const profileConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "name",
      label: "Họ tên",
      disabled: false,
      size: 12,
    },
    {
      type: TEXT,
      name: "username",
      label: "Username",
      disabled: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "email",
      label: "Email",
      disabled: false,
      size: 12,
    },
    {
      type: TEXT,
      name: "role",
      label: "Vai trò",
      disabled: true,
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
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
