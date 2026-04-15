import { BTN_SUBMIT } from "@/libs/constants/button.constant";
import { BUTTON, TEXT } from "@/libs/constants/form.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";

export const loginConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "username",
      label: "Tài khoản",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "password",
      label: "Mật khẩu",
      required: true,
      isPassword: true,
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          title: "Đăng nhập",
          type: "submit",
          action: BTN_SUBMIT,
        },
      ],
    },
  ],
};

export const initialValues = {
  username: "",
  password: "",
};
