import * as yup from "yup";

export const loginValidation = yup.object({
  username: yup
    .string()
    .trim()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(50, "Tên đăng nhập tối đa 50 ký tự"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    // .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự"),
});
