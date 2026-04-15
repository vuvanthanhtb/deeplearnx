import { BTN_SUBMIT } from "@/libs/constants/button.constant";
import { BUTTON, TEXT } from "@/libs/constants/form.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";

export const loginConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "fullName",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "username",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "email",
      label: "Email",
      placeholder: "Nhập email...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "password",
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu...",
      required: true,
      isPassword: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "confirmPassword",
      label: "Xác nhận mật khẩu",
      placeholder: "Nhập lại mật khẩu...",
      required: true,
      isPassword: true,
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        {
          title: "Đăng ký",
          type: "submit",
          action: BTN_SUBMIT,
        },
      ],
    },
  ],
};

export const initialValues = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
