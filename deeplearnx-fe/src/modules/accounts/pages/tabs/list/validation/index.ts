import * as yup from "yup";

export const accountSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Họ và tên là bắt buộc")
    .max(200, "Họ và tên không được vượt quá 200 ký tự"),
  username: yup
    .string()
    .trim()
    .required("Tên tài khoản là bắt buộc")
    .max(200, "Tên tài khoản không được vượt quá 200 ký tự"),
  email: yup
    .string()
    .trim()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .trim()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .trim()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  role: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một vai trò"),
});

export const accountUpdateSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Tên tài khoản là bắt buộc")
    .max(200, "Tên tài khoản không được vượt quá 200 ký tự"),
  email: yup
    .string()
    .trim()
    .required("Email là bắt buộc")
    .email("Email không hợp lệ"),
});
