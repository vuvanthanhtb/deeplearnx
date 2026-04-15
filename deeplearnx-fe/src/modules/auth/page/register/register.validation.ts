import * as yup from "yup";

export const registerValidation = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Họ và tên là bắt buộc")
    .max(50, "Họ và tên không được vượt quá 50 ký tự"),
  username: yup
    .string()
    .trim()
    .required("Tên tài khoản là bắt buộc")
    .max(50, "Tên tài khoản không được vượt quá 50 ký tự"),
  email: yup
    .string()
    .trim()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .trim()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .trim()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});
